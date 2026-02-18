import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced error checking with detailed configuration messages
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  throw new Error(
    `❌ CONFIGURATION ERROR: Missing Supabase environment variables: ${missingVars.join(', ')}\n\n` +
    '🔧 SOLUTION:\n' +
    '1. Create a .env file in your project root directory\n' +
    '2. Add these lines to your .env file:\n' +
    '   VITE_SUPABASE_URL=https://your-project-id.supabase.co\n' +
    '   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
    '📍 WHERE TO FIND THESE VALUES:\n' +
    '• Go to your Supabase project dashboard\n' +
    '• Navigate to Settings → API\n' +
    '• Copy the Project URL and anon/public key\n\n' +
    '⚠️  IMPORTANT: Restart your development server after creating the .env file!'
  );
}

// Validate URL format with better error messages
if (!supabaseUrl.startsWith('https://')) {
  throw new Error(
    `❌ INVALID URL FORMAT: ${supabaseUrl}\n\n` +
    '🔧 SOLUTION: Your VITE_SUPABASE_URL must start with "https://"\n' +
    'Expected format: https://your-project-id.supabase.co\n\n' +
    'Please check your .env file and update the URL.'
  );
}

if (!supabaseUrl.includes('.supabase.co')) {
  throw new Error(
    `❌ INVALID SUPABASE URL: ${supabaseUrl}\n\n` +
    '🔧 SOLUTION: Your URL should end with ".supabase.co"\n' +
    'Expected format: https://your-project-id.supabase.co\n\n' +
    'Please verify you copied the correct Project URL from Supabase dashboard.'
  );
}

// Check for placeholder values
if (supabaseUrl.includes('your-project') || supabaseUrl === 'your_supabase_project_url') {
  throw new Error(
    `❌ PLACEHOLDER VALUES DETECTED in VITE_SUPABASE_URL\n\n` +
    '🔧 SOLUTION: Replace placeholder with your actual Supabase project URL\n' +
    '• Go to Supabase dashboard → Settings → API\n' +
    '• Copy the "Project URL" (not the placeholder text)\n' +
    '• Update your .env file with the real URL\n\n' +
    '⚠️  Remember to restart your development server!'
  );
}

if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey === 'your_supabase_anon_key') {
  throw new Error(
    `❌ PLACEHOLDER VALUES DETECTED in VITE_SUPABASE_ANON_KEY\n\n` +
    '🔧 SOLUTION: Replace placeholder with your actual Supabase anon key\n' +
    '• Go to Supabase dashboard → Settings → API\n' +
    '• Copy the "anon public" key (not the placeholder text)\n' +
    '• Update your .env file with the real key\n\n' +
    '⚠️  Remember to restart your development server!'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
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

// Enhanced connection test with configuration-specific error handling
export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Test basic connectivity with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
    
    const connectionPromise = supabase.auth.getSession();
    
    const { data, error } = await Promise.race([connectionPromise, timeoutPromise]);
    
    if (error) {
      return { 
        success: false, 
        error: `❌ Supabase connection failed: ${error.message}\n\n🔧 Please check your environment variables and restart the server.` 
      };
    }
    
    return { success: true };
  } catch (error: any) {
    // Handle specific error types with actionable solutions
    if (error.message?.includes('Failed to fetch')) {
      return { 
        success: false, 
        error: `❌ CONNECTION FAILED: Cannot reach Supabase server\n\n🔧 SOLUTIONS TO TRY:\n1. Check your internet connection\n2. Verify VITE_SUPABASE_URL in .env file\n3. Ensure URL format: https://your-project-id.supabase.co\n4. Restart your development server\n5. Check if Supabase is experiencing downtime\n\n📍 Current URL: ${supabaseUrl}` 
      };
    }
    
    if (error.message?.includes('Connection timeout')) {
      return { 
        success: false, 
        error: `❌ CONNECTION TIMEOUT: Supabase server is not responding\n\n🔧 SOLUTIONS:\n1. Check your internet connection\n2. Verify your Supabase project is active\n3. Try again in a few moments\n\n📍 URL: ${supabaseUrl}` 
      };
    }
    
    if (error.name === 'TypeError') {
      return { 
        success: false, 
        error: `❌ CONFIGURATION ERROR: Invalid Supabase configuration\n\n🔧 SOLUTIONS:\n1. Check your .env file exists\n2. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n3. Restart development server\n4. Ensure no typos in environment variables` 
      };
    }
    
    return { 
      success: false, 
      error: `❌ UNEXPECTED ERROR: ${error.message || 'Unknown connection error'}\n\n🔧 Try restarting your development server and check your .env configuration.` 
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