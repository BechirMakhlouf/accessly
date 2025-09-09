#!/usr/bin/env node

/**
 * Simple SQL syntax validator for test files
 * This script checks basic SQL syntax and structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateTestFile(filePath) {
  console.log(`Validating: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Basic validation checks
  const checks = [
    {
      name: 'Contains SELECT plan()',
      test: () => content.includes('SELECT plan('),
      required: true
    },
    {
      name: 'Contains BEGIN transaction',
      test: () => content.includes('BEGIN;'),
      required: true
    },
    {
      name: 'Contains ROLLBACK',
      test: () => content.includes('ROLLBACK;'),
      required: true
    },
    {
      name: 'Contains finish()',
      test: () => content.includes('SELECT * FROM finish()'),
      required: true
    },
    {
      name: 'Uses test helpers',
      test: () => content.includes('tests.'),
      required: true
    },
    {
      name: 'Contains pgTAP functions',
      test: () => content.includes('ok(') || content.includes('is(') || content.includes('throws_ok('),
      required: true
    },
    {
      name: 'No syntax errors (basic)',
      test: () => {
        // Check for common SQL syntax issues
        const lines = content.split('\n');
        let issues = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Check for unclosed quotes
          if (line.includes("'") && !line.match(/'[^']*'/)) {
            issues.push(`Line ${i + 1}: Possible unclosed quote`);
          }
          
          // Check for unclosed parentheses in function calls
          if (line.includes('(') && !line.match(/\([^)]*\)/)) {
            issues.push(`Line ${i + 1}: Possible unclosed parenthesis`);
          }
        }
        
        return issues.length === 0;
      },
      required: false
    }
  ];

  let allPassed = true;
  const results = [];

  for (const check of checks) {
    try {
      const passed = check.test();
      results.push({
        name: check.name,
        passed,
        required: check.required
      });
      
      if (!passed && check.required) {
        allPassed = false;
      }
    } catch (error) {
      results.push({
        name: check.name,
        passed: false,
        required: check.required,
        error: error.message
      });
      
      if (check.required) {
        allPassed = false;
      }
    }
  }

  // Print results
  console.log('\nValidation Results:');
  console.log('==================');
  
  for (const result of results) {
    const status = result.passed ? '✅' : (result.required ? '❌' : '⚠️');
    const required = result.required ? ' (required)' : ' (optional)';
    console.log(`${status} ${result.name}${required}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  console.log(`\nOverall: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return allPassed;
}

function main() {
  const testDir = path.join(__dirname, '..', 'supabase', 'tests', 'database');
  
  console.log('SQL Test File Validator');
  console.log('=======================\n');
  
  // Get all .sql files in the test directory
  const files = fs.readdirSync(testDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => path.join(testDir, file));
  
  if (files.length === 0) {
    console.log('No SQL test files found');
    return;
  }
  
  let allValid = true;
  
  for (const file of files) {
    const isValid = validateTestFile(file);
    if (!isValid) {
      allValid = false;
    }
    console.log(''); // Add spacing between files
  }
  
  console.log('='.repeat(50));
  console.log(`Overall Result: ${allValid ? '✅ ALL TESTS VALID' : '❌ SOME TESTS INVALID'}`);
  
  process.exit(allValid ? 0 : 1);
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateTestFile };