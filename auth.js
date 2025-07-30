// auth.js
// Initialize Supabase client and provide authentication functions

// Configuration
const SUPABASE_URL = 'https://nfpkylrjnxgicfsvdmjh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcGt5bHJqbnhnaWNmc3ZkbWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzQxNjEsImV4cCI6MjA2ODc1MDE2MX0.SppVPt5I5NJCgsbha-ATOFanz7pTgcPIkkLBdnMdf7c';

// Initialize Supabase client
let supabaseClient = null;

// Function to get or create Supabase client
function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    // Check for global supabase instance (from UMD bundle)
    if (window.supabase) {
        // If it's already initialized as a client, use it
        if (window.supabase.auth) {
            supabaseClient = window.supabase;
            return supabaseClient;
        }
        // If not, create a new client
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabase = supabaseClient; // Update global reference
        return supabaseClient;
    }
    
    throw new Error('Supabase client not available. Make sure supabase-js is loaded.');
}

// Wait for Supabase to be ready
async function ensureSupabase() {
    if (supabaseClient) return supabaseClient;
    
    return new Promise((resolve, reject) => {
        const checkSupabase = () => {
            try {
                const client = getSupabase();
                if (client) {
                    resolve(client);
                } else {
                    setTimeout(checkSupabase, 100);
                }
            } catch (e) {
                console.error('Error initializing Supabase:', e);
                reject(e);
            }
        };
        
        checkSupabase();
    });
}

// Initialize immediately
async function initSupabase() {
    if (window.createClient) {
        window.supabase = window.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

initSupabase();

// Signup function with improved error handling
async function signUp(email, password, name) {
  try {
    const supabase = await ensureSupabase();
    if (!supabase) {
      throw new Error('Failed to initialize Supabase client');
    }
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name,
          name: name
        }
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
      return { user: null, error };
    }
    
    return { user: data?.user, error: null };
    
  } catch (err) {
    console.error('Signup exception:', err);
    return { 
      user: null, 
      error: { 
        message: err.message || 'Network error. Please try again.' 
      } 
    };
  }
}

// Signin function with improved error handling
window.supabaseSignIn = async (email, password) => {
    try {
        const supabase = await ensureSupabase();
        // v1.x API: returns { data, error }
        const { data, error } = await supabase.auth.signIn({ email, password });
        console.log('Supabase signIn result:', { data, error });
        if (error) throw error;
        return { user: data && data.user ? data.user : null, error: null };
    } catch (error) {
        console.error('Login error:', error);
        return { user: null, error };
    }
};

// Logout function
async function signOut() {
  try {
    const supabase = await ensureSupabase();
    if (!supabase) return { error: { message: 'Client not initialized' } };
    
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem('mindbloom_loggedIn');
      localStorage.removeItem('mindbloom_user_id');
    }
    return { error };
  } catch (err) {
    console.error('Signout error:', err);
    return { error: { message: err.message || 'Failed to sign out' } };
  }
}

// Get current user session
async function getCurrentUser() {
  try {
    const supabase = await ensureSupabase();
    if (!supabase) return null;
    
    // For Supabase v1, use user() instead of getUser()
    const user = supabase.auth.user();
    return user;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
}

// Check if user is authenticated
async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Export functions to global scope
window.supabaseSignUp = signUp;
window.supabaseSignIn = supabaseSignIn;
window.supabaseSignOut = signOut;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
