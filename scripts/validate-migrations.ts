#!/usr/bin/env tsx

/**
 * Migration Validation Script
 * 
 * This script validates the consistency between schema changes and migrations:
 * 1. If schemas changed but no new migration exists -> FAIL
 * 2. If migration exists but no schema changes -> FAIL
 * 3. If both exist or neither exist -> PASS
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  success: boolean;
  hasSchemaChanges: boolean;
  hasNewMigrations: boolean;
  errors: string[];
  warnings: string[];
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

function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', { 
      encoding: 'utf-8',
      cwd: process.cwd()
    });
    return output.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    log('❌ Failed to get staged files', 'error');
    return [];
  }
}

function getSchemaFiles(): string[] {
  const schemaDir = 'supabase/schemas';
  if (!existsSync(schemaDir)) {
    return [];
  }
  
  const files: string[] = [];
  
  function scanDirectory(dir: string): void {
    const items = readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = join(dir, item.name);
      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile() && item.name.endsWith('.sql')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(schemaDir);
  return files;
}

function getMigrationFiles(): string[] {
  const migrationDir = 'supabase/migrations';
  if (!existsSync(migrationDir)) {
    return [];
  }
  
  return readdirSync(migrationDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => join(migrationDir, file));
}

function hasSchemaChanges(stagedFiles: string[]): boolean {
  const schemaFiles = getSchemaFiles();
  
  return stagedFiles.some(file => 
    schemaFiles.some(schemaFile => 
      file === schemaFile || file.startsWith(schemaFile)
    )
  );
}

function hasNewMigrations(stagedFiles: string[]): boolean {
  const migrationFiles = getMigrationFiles();
  
  return stagedFiles.some(file => 
    migrationFiles.some(migrationFile => 
      file === migrationFile || file.startsWith(migrationFile)
    )
  );
}

function getLatestMigrationTimestamp(): string | null {
  const migrationDir = 'supabase/migrations';
  if (!existsSync(migrationDir)) {
    return null;
  }
  
  const files = readdirSync(migrationDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    return null;
  }
  
  // Extract timestamp from filename (format: YYYYMMDDHHMMSS_description.sql)
  const latestFile = files[0];
  const timestampMatch = latestFile.match(/^(\d{14})_/);
  
  return timestampMatch ? timestampMatch[1] : null;
}

function getSchemaFileContent(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    return '';
  }
}

function hasSignificantSchemaChanges(stagedFiles: string[]): boolean {
  const schemaFiles = getSchemaFiles();
  
  for (const stagedFile of stagedFiles) {
    const schemaFile = schemaFiles.find(sf => 
      stagedFile === sf || stagedFile.startsWith(sf)
    );
    
    if (schemaFile) {
      const content = getSchemaFileContent(stagedFile);
      
      // Check for significant changes (not just comments or whitespace)
      const significantContent = content
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.length > 0 && 
                 !trimmed.startsWith('--') && 
                 !trimmed.startsWith('/*') &&
                 !trimmed.startsWith('*') &&
                 !trimmed.startsWith('*/');
        })
        .join('\n');
      
      if (significantContent.trim().length > 0) {
        return true;
      }
    }
  }
  
  return false;
}

function hasSignificantMigrationChanges(stagedFiles: string[]): boolean {
  const migrationFiles = getMigrationFiles();
  
  for (const stagedFile of stagedFiles) {
    const migrationFile = migrationFiles.find(mf => 
      stagedFile === mf || stagedFile.startsWith(mf)
    );
    
    if (migrationFile) {
      const content = getSchemaFileContent(stagedFile);
      
      // Check for significant changes (not just comments or whitespace)
      const significantContent = content
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.length > 0 && 
                 !trimmed.startsWith('--') && 
                 !trimmed.startsWith('/*') &&
                 !trimmed.startsWith('*') &&
                 !trimmed.startsWith('*/');
        })
        .join('\n');
      
      if (significantContent.trim().length > 0) {
        return true;
      }
    }
  }
  
  return false;
}

async function validateMigrations(): Promise<ValidationResult> {
  try {
    log('🔍 Validating migration-schema consistency...', 'info');
    
    const stagedFiles = getStagedFiles();
    
    if (stagedFiles.length === 0) {
      log('ℹ️  No staged files to validate', 'info');
      return {
        success: true,
        hasSchemaChanges: false,
        hasNewMigrations: false,
        errors: [],
        warnings: []
      };
    }
    
    const schemaChanges = hasSchemaChanges(stagedFiles);
    const newMigrations = hasNewMigrations(stagedFiles);
    const significantSchemaChanges = hasSignificantSchemaChanges(stagedFiles);
    const significantMigrationChanges = hasSignificantMigrationChanges(stagedFiles);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Rule 1: Schema changes without migrations
    if (significantSchemaChanges && !newMigrations) {
      errors.push('Schema files have been modified but no new migration was created');
      errors.push('Please create a migration to reflect your schema changes:');
      errors.push('  npm run supabase:db:gen-migration');
    }
    
    // Rule 2: Migrations without schema changes
    if (newMigrations && !significantSchemaChanges) {
      errors.push('New migration was created but no schema files were modified');
      errors.push('Please ensure your migration reflects actual schema changes');
    }
    
    // Rule 3: Schema changes without significant content
    if (schemaChanges && !significantSchemaChanges) {
      warnings.push('Schema files were modified but only comments/whitespace changes detected');
    }
    
    // Rule 4: Migration changes without significant content
    if (newMigrations && !significantMigrationChanges) {
      warnings.push('Migration files were modified but only comments/whitespace changes detected');
    }
    
    const success = errors.length === 0;
    
    if (success) {
      if (schemaChanges && newMigrations) {
        log('✅ Schema changes and migrations are consistent', 'success');
      } else if (!schemaChanges && !newMigrations) {
        log('✅ No schema or migration changes detected', 'success');
      } else {
        log('✅ Migration validation passed', 'success');
      }
    } else {
      log('❌ Migration validation failed', 'error');
      errors.forEach(error => log(`  - ${error}`, 'error'));
    }
    
    if (warnings.length > 0) {
      warnings.forEach(warning => log(`⚠️  ${warning}`, 'warn'));
    }
    
    return {
      success,
      hasSchemaChanges: schemaChanges,
      hasNewMigrations: newMigrations,
      errors,
      warnings
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`❌ Validation failed: ${errorMessage}`, 'error');
    
    return {
      success: false,
      hasSchemaChanges: false,
      hasNewMigrations: false,
      errors: [errorMessage],
      warnings: []
    };
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  validateMigrations()
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

export { validateMigrations, type ValidationResult };
