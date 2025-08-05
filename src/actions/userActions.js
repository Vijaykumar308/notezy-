"use server";

export const registerUser = async (prevData, formData) => {
    try {
        // Extract form data properly
        const userData = {
            username: formData.get('username'),
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            rememberMe: formData.get('rememberMe') === 'on' || formData.get('rememberMe') === 'true'
        };

        console.log('Form data extracted:', userData);

        // Use the correct API endpoint path
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            // Important: include cache control for server actions
            cache: 'no-store'
        });

        const data = await res.json();
        console.log('API response:', data);

        if (!res.ok) {
            // Return error state for the client
            return {
                success: false,
                message: data.message || 'Registration failed',
                errors: data.errors || null
            };
        }

        // Return success state
        return {
            success: true,
            message: data.message || 'Registration successful',
            data: data.data
        };

    } catch (err) {
        console.error('Server action error:', err);
        
        // Return error state instead of throwing
        return {
            success: false,
            message: 'Network error. Please try again.',
            error: err.message
        };
    }
}


export const LoginUser = async (prevData, formData) => {
    try {
        const isGuest = formData.get('isGuest') === 'true';
        
        let userData;
        
        if (isGuest) {
            const guestName = formData.get('guestName');
            
            // Validate guest name
            if (!guestName || guestName.trim() === '') {
                return {
                    success: false,
                    message: "Please enter your name to continue as guest",
                    errors: null
                };
            }
            
            // For guest login, you can either:
            // Option 1: Handle guest login locally (no server call needed)
            // Option 2: Send to server guest endpoint
            
            // Option 1 - Local guest handling (immediate success)
            return {
                success: true,
                message: `Welcome ${guestName.trim()}! You're logged in as a guest.`,
                data: {
                    user: {
                        name: guestName.trim(),
                        isGuest: true,
                        id: `guest_${Date.now()}` // Temporary guest ID
                    }
                }
            };
            
            // Option 2 - Uncomment below if you want to send guest data to server
            /*
            userData = {
                guestName: guestName.trim(),
                isGuest: true
            };
            */
        } else {
            userData = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            // Validate required fields for regular login
            if (!userData.username || !userData.password) {
                return {
                    success: false,
                    message: "Username and password are required",
                    errors: null
                };
            }
        }

        // Only make server call for regular login (not guest)
        if (!isGuest) {
            // Use environment variable for API URL or a more robust localhost URL
            const apiUrl = 'http://localhost:3000';
            
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            // Handle different response scenarios
            if (!res.ok) {
                let errorData;
                try {
                    errorData = await res.json();
                } catch (parseError) {
                    return {
                        success: false,
                        message: `Server error: ${res.status} ${res.statusText}`,
                        errors: null
                    };
                }

                return {
                    success: false,
                    message: errorData.message || "Login Failed",
                    errors: errorData.errors || null
                };
            }

            const data = await res.json();

            return {
                success: true,
                message: data.message || 'Login Successful',
                data: data.data
            };
        }

    } catch (err) {
        console.error('Login error:', err);
        
        // More specific error messages
        if (err.code === 'ECONNREFUSED') {
            return {
                success: false,
                message: 'Unable to connect to server. Please check if the server is running.',
                error: err.message
            };
        }
        
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return {
                success: false,
                message: 'Network connection failed. Please check your internet connection.',
                error: err.message
            };
        }

        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
            error: err.message
        };
    }
};