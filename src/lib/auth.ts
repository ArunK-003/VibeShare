import { supabase } from './supabaseClient';

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    return { 
      data: null, 
      error: { 
        message: 'Failed to connect to authentication service. Please check your internet connection and try again.' 
      } 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (err) {
    return { 
      data: null, 
      error: { 
        message: 'Failed to connect to authentication service. Please check your internet connection and try again.' 
      } 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    return { 
      error: { 
        message: 'Failed to sign out. Please try again.' 
      } 
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
};