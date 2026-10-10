import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'arthromed-products';

let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Supabase client:', error);
  }
} else {
  console.log('ℹ️ Supabase credentials not fully provided. Running in resilient mock/in-memory mode.');
}

export const supabase = supabaseClient;
