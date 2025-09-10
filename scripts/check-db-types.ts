#!/usr/bin/env tsx

/**
 * Quick Database Type Check Script
 * 
 * This script performs a quick check without running migrations.
 * It's useful for CI/CD or when you want to verify types without
 * the overhead of a full migration run.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

const DATABASE_TYPES_PATH = 'src/types/database.types.ts';

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

function checkDatabaseTypes(): boolean {
  try {
    log('🔍 Checking database types...', 'info');
    
    // Check if database types file exists
    if (!existsSync(DATABASE_TYPES_PATH)) {
      log('❌ Database types file not found!', 'error');
      log('💡 Run "npm run supabase:types:local" to generate types', 'info');
      return false;
    }
    
    // Check if Supabase is running
    try {
      execSync('supabase status', { stdio: 'pipe' });
      log('✅ Supabase is running', 'success');
    } catch (error) {
      log('⚠️  Supabase is not running', 'warn');
      log('💡 Run "npm run supabase:start" to start Supabase', 'info');
      return false;
    }
    
    // Check if the types file has content
    const content = readFileSync(DATABASE_TYPES_PATH, 'utf-8');
    if (content.trim().length === 0) {
      log('❌ Database types file is empty!', 'error');
      log('💡 Run "npm run supabase:types:local" to generate types', 'info');
      return false;
    }
    
    // Check if the types file looks valid (has Database type)
    if (!content.includes('export type Database')) {
      log('❌ Database types file appears to be invalid!', 'error');
      log('💡 Run "npm run supabase:types:local" to regenerate types', 'info');
      return false;
    }
    
    log('✅ Database types file looks valid', 'success');
    return true;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`❌ Check failed: ${errorMessage}`, 'error');
    return false;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = checkDatabaseTypes();
  process.exit(isValid ? 0 : 1);
}

export { checkDatabaseTypes };
