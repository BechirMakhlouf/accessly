#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Environment variables for local Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SECRET_KEY environment variable is required');
  console.error('Make sure to set it in your .env.local file');
  process.exit(1);
}

// Create Supabase admin client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Schema for user creation
const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  verifyEmail: z.boolean().default(true)
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Test users to create
const testUsers: CreateUserInput[] = [
  {
    email: 'user1@test.com',
    password: 'password123',
    fullName: 'Test User 1',
    verifyEmail: true
  },
  {
    email: 'user2@test.com',
    password: 'password123',
    fullName: 'Test User 2',
    verifyEmail: true
  },
  {
    email: 'admin@test.com',
    password: 'admin123',
    fullName: 'Admin User',
    verifyEmail: true
  }
];

async function createUser(userData: CreateUserInput) {
  try {
    console.log(`🔄 Creating user: ${userData.email}`);
    
    // Create user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: userData.verifyEmail,
      user_metadata: {
        full_name: userData.fullName
      }
    });

    if (authError) {
      console.error(`❌ Failed to create auth user for ${userData.email}:`, authError.message);
      return { success: false, error: authError };
    }

    console.log(`✅ Auth user created: ${authData.user?.id}`);

    // Wait a moment for the trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify that user_profile was created
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user?.id)
      .single();

    if (profileError) {
      console.error(`❌ Failed to fetch user profile for ${userData.email}:`, profileError.message);
      return { success: false, error: profileError };
    }

    console.log(`✅ User profile created:`, {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      created_at: profile.created_at
    });

    // Verify that user_settings was created
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', authData.user?.id)
      .single();

    if (settingsError) {
      console.error(`❌ Failed to fetch user settings for ${userData.email}:`, settingsError.message);
      return { success: false, error: settingsError };
    }

    console.log(`✅ User settings created:`, {
      id: settings.id,
      theme: settings.theme,
      language: settings.language,
      notifications_enabled: settings.notifications_enabled
    });

    return { success: true, user: authData.user, profile, settings };

  } catch (error) {
    console.error(`❌ Unexpected error creating user ${userData.email}:`, error);
    return { success: false, error };
  }
}

async function verifyUser(userId: string, email: string) {
  try {
    console.log(`🔍 Verifying user: ${email}`);
    
    // Check if user exists in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError) {
      console.error(`❌ Failed to fetch auth user:`, authError.message);
      return false;
    }

    if (!authUser.user) {
      console.error(`❌ User not found in auth.users`);
      return false;
    }

    console.log(`✅ Auth user verified: ${authUser.user.email}`);

    // Check if user_profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error(`❌ User profile not found:`, profileError.message);
      return false;
    }

    console.log(`✅ User profile verified`);

    // Check if user_settings exists
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', userId)
      .single();

    if (settingsError) {
      console.error(`❌ User settings not found:`, settingsError.message);
      return false;
    }

    console.log(`✅ User settings verified`);

    return true;

  } catch (error) {
    console.error(`❌ Error verifying user:`, error);
    return false;
  }
}

async function listExistingUsers() {
  try {
    console.log(`📋 Listing existing users...`);
    
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`❌ Failed to fetch users:`, error.message);
      return;
    }

    if (profiles.length === 0) {
      console.log(`📭 No users found`);
      return;
    }

    console.log(`👥 Found ${profiles.length} users:`);
    profiles.forEach((profile, index) => {
      console.log(`  ${index + 1}. ${profile.email} (${profile.full_name || 'No name'}) - ${profile.created_at}`);
    });

  } catch (error) {
    console.error(`❌ Error listing users:`, error);
  }
}

async function main() {
  console.log('🚀 Starting user creation and verification script');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log('');

  // List existing users first
  await listExistingUsers();
  console.log('');

  const results = [];

  // Create each test user
  for (const userData of testUsers) {
    const result = await createUser(userData);
    results.push({ userData, result });
    console.log('');
  }

  // Summary
  console.log('📊 Summary:');
  const successful = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log(`✅ Successfully created: ${successful} users`);
  console.log(`❌ Failed to create: ${failed} users`);

  if (failed > 0) {
    console.log('\n❌ Failed users:');
    results
      .filter(r => !r.result.success)
      .forEach(r => {
        console.log(`  - ${r.userData.email}: ${r.result.error?.message || 'Unknown error'}`);
      });
  }

  console.log('\n🔍 Final verification - listing all users:');
  await listExistingUsers();

  console.log('\n✨ Script completed!');
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
