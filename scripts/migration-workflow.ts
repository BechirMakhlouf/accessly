#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Migration workflow script that:
 * 1. Resets the database
 * 2. Generates a diff for the specified migration
 * 3. Applies the migration
 * 
 * Usage: npm run migration:workflow -- <migration-name>
 * Example: npm run migration:workflow -- change_org_members_id_foreign_key_to_reference_user_profiles
 */

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: Migration name is required');
    console.log('Usage: npm run migration:workflow -- <migration-name>');
    console.log('Example: npm run migration:workflow -- change_org_members_id_foreign_key_to_reference_user_profiles');
    process.exit(1);
  }

  const migrationName = args[0];

  console.log(`🚀 Starting migration workflow for: ${migrationName}`);
  console.log('');

  try {
    // Step 1: Reset database
    console.log('1️⃣ Resetting database...');
    execSync('npx supabase db reset', { stdio: 'inherit' });
    console.log('✅ Database reset completed');
    console.log('');

    // Step 2: Generate diff
    console.log('2️⃣ Generating diff...');
    execSync(`npx supabase db diff -f ${migrationName} --debug`, { stdio: 'inherit' });
    console.log('✅ Diff generation completed');
    console.log('');

    // Step 3: Apply migration
    console.log('3️⃣ Applying migration...');
    execSync('npx supabase migration up', { stdio: 'inherit' });
    console.log('✅ Migration applied successfully');
    console.log('');

    console.log('🎉 Migration workflow completed successfully!');
  } catch (error) {
    console.error('❌ Migration workflow failed:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
