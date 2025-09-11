#!/usr/bin/env tsx

/**
 * Database Type Validation Script
 * 
 * This script:
 * 1. Runs pending migrations
 * 2. Generates fresh database types
 * 3. Compares generated types with existing types
 * 4. Reports any differences
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATABASE_TYPES_PATH = 'src/types/database.types.ts';
const TEMP_TYPES_PATH = 'temp-database.types.ts';

interface ValidationResult {
  success: boolean;
  hasChanges: boolean;
  differences: string[];
  error?: string;
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warn: '\x1b[33m',    // Yellow
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function execCommand(command: string, description: string): void {
  try {
    log(`🔄 ${description}...`, 'info');
    execSync(command, { 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    log(`✅ ${description} completed`, 'success');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to ${description.toLowerCase()}: ${errorMessage}`);
  }
}

function normalizeContent(content: string): string {
  // Remove timestamp comments and normalize whitespace
  return content
    .replace(/\/\* Generated on .+ \*\/\n?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compareFiles(file1Path: string, file2Path: string): string[] {
  const differences: string[] = [];
  
  if (!existsSync(file1Path)) {
    differences.push(`File ${file1Path} does not exist`);
    return differences;
  }
  
  if (!existsSync(file2Path)) {
    differences.push(`File ${file2Path} does not exist`);
    return differences;
  }
  
  const content1 = normalizeContent(readFileSync(file1Path, 'utf-8'));
  const content2 = normalizeContent(readFileSync(file2Path, 'utf-8'));
  
  if (content1 !== content2) {
    differences.push('Generated types differ from existing types');
    
    // Try to find specific differences using a simple line-by-line comparison
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');
    
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        differences.push(`Line ${i + 1}: ${line1 !== '' ? 'Expected' : 'Missing'}: "${line1}" | ${line2 !== '' ? 'Actual' : 'Missing'}: "${line2}"`);
        
        // Limit the number of differences shown to avoid overwhelming output
        if (differences.length > 20) {
          differences.push('... (truncated)');
          break;
        }
      }
    }
  }
  
  return differences;
}

async function validateDatabaseTypes(updateTypes = false): Promise<ValidationResult> {
  try {
    log('🚀 Starting database type validation...', 'info');
    
    // Step 1: Check if Supabase is running
    try {
      execCommand('supabase status', 'Checking Supabase status');
    } catch (error) {
      log('⚠️  Supabase not running, starting it...', 'warn');
      execCommand('supabase start', 'Starting Supabase');
    }
    
    // Step 2: Run migrations
    try {
      execCommand('supabase db reset', 'Running database migrations');
    } catch (error) {
      log('⚠️  Database reset failed, trying to continue with current state...', 'warn');
      // Continue with validation even if reset fails
    }
    
    // Step 3: Generate fresh types
    execCommand(
      `supabase gen types typescript --local --schema public,auth,storage > ${TEMP_TYPES_PATH}`,
      'Generating fresh database types'
    );
    
    // Step 4: Compare types
    log('🔍 Comparing generated types with existing types...', 'info');
    const differences = compareFiles(DATABASE_TYPES_PATH, TEMP_TYPES_PATH);
    
    if (differences.length === 0) {
      log('✅ Database types are up to date!', 'success');
      return {
        success: true,
        hasChanges: false,
        differences: []
      };
    } else {
      if (updateTypes) {
        log('🔄 Updating database types...', 'info');
        writeFileSync(DATABASE_TYPES_PATH, readFileSync(TEMP_TYPES_PATH, 'utf-8'));
        log('✅ Database types updated successfully!', 'success');
        return {
          success: true,
          hasChanges: true,
          differences: []
        };
      } else {
        log('❌ Database types are out of sync!', 'error');
        log('Differences found:', 'error');
        differences.forEach(diff => log(`  - ${diff}`, 'error'));
        log('💡 Run "npm run validate:db-types:update" to update the types', 'info');
        
        return {
          success: false,
          hasChanges: true,
          differences
        };
      }
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`❌ Validation failed: ${errorMessage}`, 'error');
    
    return {
      success: false,
      hasChanges: false,
      differences: [],
      error: errorMessage
    };
  } finally {
    // Cleanup temporary file
    try {
      if (existsSync(TEMP_TYPES_PATH)) {
        execSync(`rm ${TEMP_TYPES_PATH}`, { stdio: 'pipe' });
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const updateTypes = process.argv.includes('--update');
  
  validateDatabaseTypes(updateTypes)
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(error => {
      log(`❌ Unexpected error: ${error.message}`, 'error');
      process.exit(1);
    });
}

export { validateDatabaseTypes, type ValidationResult };
