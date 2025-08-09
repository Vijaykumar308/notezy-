import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
  console.warn('WARNING: Using default JWT secret. This is not secure for production!');
}

export async function GET(request) {
  try {
    await connectDB();
    
    // Log request headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Request Headers:', JSON.stringify(headers, null, 2));
    
    // Get the auth token from cookies
    const cookieStore = cookies();
    console.log('Available cookies:', [...cookieStore.getAll()].map(c => c.name));
    
    const token = cookieStore.get('accessToken') || cookieStore.get('token');
    
    if (!token) {
      console.error('No token found in cookies');
      return NextResponse.json(
        { 
          success: false, 
          message: 'No authentication token found',
          availableCookies: [...cookieStore.getAll()].map(c => c.name)
        },
        { status: 401 }
      );
    }

    console.log('Found token in cookies');
    
    // Log token details without the actual value for security
    console.log('Token details:', {
      name: token.name,
      httpOnly: token.httpOnly,
      secure: token.secure,
      sameSite: token.sameSite,
      expires: token.expires,
      valueLength: token.value?.length
    });

    // Verify the token with the same options used during creation
    let decoded;
    try {
      console.log('Verifying token with secret:', JWT_SECRET ? 'Secret is set' : 'WARNING: JWT_SECRET is not set!');
      
      // First, try to verify without options to get the exact error
      try {
        decoded = jwt.verify(token.value, JWT_SECRET);
        console.log('Token verified successfully with default options:', { userId: decoded?.userId });
      } catch (simpleError) {
        console.log('Simple verification failed, trying with options...', simpleError.message);
        // If simple verification fails, try with options
        decoded = jwt.verify(token.value, JWT_SECRET, {
          issuer: "your-app-name",
          audience: "your-app-users",
          ignoreExpiration: false,
          algorithms: ['HS256']
        });
        console.log('Token verified successfully with options:', { userId: decoded?.userId });
      }
      
    } catch (error) {
      console.error('Token verification failed:', {
        name: error.name,
        message: error.message,
        expiredAt: error.expiredAt,
        dateNow: new Date(),
        tokenIssuedAt: decoded?.iat ? new Date(decoded.iat * 1000) : null,
        tokenExpiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : null
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token',
          error: error.message,
          errorName: error.name,
          currentTime: new Date().toISOString(),
          tokenExpiredAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null
        },
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await User.findById(decoded.userId).select('-password -__v');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (without sensitive information)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        avatar: user.avatar,
        isGuest: false
      }
    });

  } catch (error) {
    console.error('Error in auth/me endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
