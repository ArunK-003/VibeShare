import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced error checking with detailed messages
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  throw new Error(
    `Missing Supabase environment variables: ${missingVars.join(', ')}.\n\n` +
    'Please create a .env file in your project root with:\n' +
    'VITE_SUPABASE_URL=your_supabase_project_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
    'You can find these values in your Supabase project settings under API.'
  );
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error(
    `Invalid VITE_SUPABASE_URL format: ${supabaseUrl}\n\n` +
    'Expected format: https://your-project-id.supabase.co'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'music-room-app',
    },
  },
});

// Test connection on initialization
const testConnection = async () => {
  try {
    // Simple connection test that doesn't require specific tables
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase connection test failed:', error.message);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (error) {
    console.warn('Supabase connection test failed:', error);
    // Don't throw error to prevent app from breaking
  }
};

// Run connection test in development
if (import.meta.env.DEV) {
  // Run test connection without blocking app startup
  setTimeout(() => {
    testConnection();
  }, 1000);
}

// Initialize storage bucket
export const initializeStorage = async () => {
  try {
    // Create songs bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const songsBucket = buckets?.find(bucket => bucket.name === 'songs');
    
    if (!songsBucket) {
      await supabase.storage.createBucket('songs', {
        public: true,
        allowedMimeTypes: ['audio/*'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      });
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

export interface Room {
  id: string;
  name: string;
  admin_id: string;
  password?: string;
  max_songs_per_user: number;
  songs_per_round: number;
  room_code: string;
  created_at: string;
}

export interface Song {
  id: string;
  room_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  display_name?: string;
  order: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  created_at: string;
}