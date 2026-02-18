import { supabase } from './supabaseClient';

// Enhanced error handling for network issues
const handleNetworkError = (error: any) => {
  if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
    return {
      message: 'Unable to connect to the authentication service. Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable.'
    };
  }
  
  if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
    return {
      message: 'Network connection failed. Please check your internet connection and try again.'
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred. Please try again.'
  };
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });
    return { data, error };
  } catch (err) {
    return {
      data: null,
      error: handleNetworkError(err)
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    return { data, error };
  } catch (err) {
    return {
      data: null,
      error: handleNetworkError(err)
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    return {
      error: handleNetworkError(err)
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Failed to get current user:', handleNetworkError(err).message);
    return null;
  }
};