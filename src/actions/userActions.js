"use server";

export const registerUser = async (prevData, formData) => {
    try {
        console.log('Server action called');
        
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