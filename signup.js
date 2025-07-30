// Load Supabase script first
const loadSupabase = () => {
    return new Promise((resolve) => {
        if (window.supabase) return resolve();
        
        // Check if already loading
        if (window.supabaseLoading) {
            const checkLoaded = setInterval(() => {
                if (window.supabase) {
                    clearInterval(checkLoaded);
                    resolve();
                }
            }, 100);
            return;
        }
        
        window.supabaseLoading = true;
        
        // Use the UMD build which exposes supabase as a global
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1.35.7/dist/umd/supabase.min.js';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
            try {
                // The UMD bundle exposes a global 'supabase' object with createClient
                window.supabase = supabase.createClient(
                    'https://nfpkylrjnxgicfsvdmjh.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcGt5bHJqbnhnaWNmc3ZkbWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzQxNjEsImV4cCI6MjA2ODc1MDE2MX0.SppVPt5I5NJCgsbha-ATOFanz7pTgcPIkkLBdnMdf7c'
                );
                resolve();
            } catch (err) {
                console.error('Error initializing Supabase:', err);
                throw new Error('Failed to initialize authentication service');
            }
        };
        
        script.onerror = () => {
            console.error('Failed to load Supabase script');
            throw new Error('Failed to load authentication service');
        };
        
        document.head.appendChild(script);
    });
};


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    
    const form = document.getElementById('signup-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const password = document.getElementById('password')?.value?.trim() || '';
        const confirmPassword = document.getElementById('confirm-password')?.value?.trim() || '';
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!submitButton) {
            console.error('Submit button not found');
            return;
        }
        
        const originalButtonText = submitButton.textContent;

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';

        try {
            // Ensure supabaseSignUp is available
            if (typeof window.supabaseSignUp !== 'function') {
                throw new Error('Authentication service is not available. Please refresh the page and try again.');
            }

            // Call Supabase signup
            const { user, error } = await window.supabaseSignUp(email, password, name);

            if (error) {
                throw error;
            }

            // Insert into Users table
            if (window.supabase) {
                const { data, error: insertError } = await window.supabase
                    .from('Users')
                    .insert([{ Username: name, email: email }]);
                if (insertError) {
                    alert('Signup succeeded, but failed to save profile info. Please contact support.');
                    console.error('Users table insert error:', insertError);
                    return;
                }
            }

            alert('Signup successful!');
            localStorage.clear();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Signup error:', error);
            alert('Sign up failed: ' + (error.message || 'Please try again.'));
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Helper function to wait for Supabase to be loaded
function waitForSupabase() {
    return new Promise((resolve) => {
        const checkSupabase = () => {
            if (window.supabaseSignUp && window.supabaseSignIn) {
                resolve();
            } else {
                setTimeout(checkSupabase, 100);
            }
        };
        checkSupabase();
    });
}
