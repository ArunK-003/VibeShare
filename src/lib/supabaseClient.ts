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
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'music-room-app',
    },
  },
});

// Enhanced connection test with better error handling
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Test basic connectivity
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { 
        success: false, 
        error: `Supabase connection failed: ${error.message}` 
      };
    }
    
    return { success: true };
  } catch (error: any) {
    // Handle network errors specifically
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      return { 
        success: false, 
        error: 'Unable to connect to Supabase. Please check your internet connection and Supabase configuration.' 
      };
    }
    
    return { 
      success: false, 
      error: `Connection test failed: ${error.message || 'Unknown error'}` 
    };
  }
};

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