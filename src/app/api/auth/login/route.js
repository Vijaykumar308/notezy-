import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
  console.warn('WARNING: Using default JWT secret. This is not secure for production!');
}

export async function POST(req) {
  await connectDB();
  
  try {
    const { username, password, rememberMe = false } = await req.json();

    // Input validation
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "username and password are required",
        },
        { status: 400 }
      );
    }

    // Trim and normalize input
    const normalizedIdentifier = username.trim().toLowerCase();

    // Find user by email or username
    const user = await User.findByEmailOrUsername(normalizedIdentifier);
    
    if (!user) {
      console.log('User not found for identifier:', normalizedIdentifier);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials',
          debug: { identifier: normalizedIdentifier, userFound: false }
        },
        { status: 401 }
      );
    }
    
    console.log('Found user:', { 
      _id: user._id, 
      username: user.username, 
      email: user.email,
      hasPassword: !!user.password
    });

    // Check if account is locked
    if (user.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is temporarily locked due to too many failed login attempts. Please try again later.",
          lockUntil: user.lockUntil,
        },
        { status: 423 }
      );
    }

    // Check if account is active
    if (!user.active) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is deactivated. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Verify password
    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email);
      console.log('Provided password:', password);
      console.log('Stored hash:', user.password ? '[hash exists]' : '[no password hash]');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials',
          debug: { 
            passwordMatch: false,
            hasStoredPassword: !!user.password,
            passwordLength: password?.length
          }
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.failedLoginAttempts >= 5) {
      const lastAttempt = user.lastFailedLogin || new Date();
      const lockoutTime = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      if (new Date() - new Date(lastAttempt) < lockoutTime) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Account temporarily locked. Please try again later.',
            locked: true,
            retryAfter: Math.ceil((lockoutTime - (new Date() - new Date(lastAttempt))) / 1000 / 60) // minutes remaining
          },
          { status: 429 }
        );
      } else {
        // Reset failed attempts if lockout period has passed
        user.failedLoginAttempts = 0;
        await user.save();
      }
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      rememberMe: Boolean(rememberMe),
    });

    // Create token payload
    const tokenPayload = { 
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role 
    };
    
    console.log('Creating JWT with payload:', JSON.stringify(tokenPayload, null, 2));
    console.log('JWT Secret being used:', JWT_SECRET === 'your-secret-key' ? 'DEFAULT SECRET - UNSAFE FOR PRODUCTION' : 'Custom secret from env');
    console.log('JWT Secret length:', JWT_SECRET ? JWT_SECRET.length : 'undefined');
    
    // Create token
    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1h" }
    );
    
    console.log('Generated token:', token ? 'Token generated successfully' : 'Failed to generate token');

    console.log('Generated JWT token with payload:', tokenPayload);

    // Create response with user data including initials
    const userData = {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      active: user.active,
      emailVerified: user.emailVerified,
      lastLogin: new Date(),
      // Add initials for avatar
      initials: user.fullname 
        ? user.fullname
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : (user.username || 'U').substring(0, 2).toUpperCase()
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: userData,
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies
    const isProduction = process.env.NODE_ENV === "production";
    
    // Calculate token expiration time
    const tokenExpiry = rememberMe 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      : new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Set user session info cookie (for client-side use)
    const userSessionData = {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      isLoggedIn: true,
      initials: user.fullname 
        ? user.fullname
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : (user.username || 'U').substring(0, 2).toUpperCase()
    };
    
    // Set user session cookie
    response.cookies.set({
      name: "userSession",
      value: JSON.stringify(userSessionData),
      httpOnly: false, // Accessible to client-side JavaScript
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: tokenExpiry,
      maxAge: Math.floor((tokenExpiry.getTime() - Date.now()) / 1000) // in seconds
    });

    // Set session token cookie for API authentication
    response.cookies.set("token", token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: tokenExpiry,
      maxAge: Math.floor((tokenExpiry.getTime() - Date.now()) / 1000) // in seconds
    });

    // Also include the token in the response body for client-side storage
    const responseData = {
      success: true,
      message: 'Login successful',
      user: userSessionData,
      token: token // Include the token in the response body
    };

    // Update the response with the token in the body
    return NextResponse.json(responseData, {
      status: 200,
      headers: Object.fromEntries(response.headers)
    });

  } catch (error) {
    console.error("Login Error:", error);
    
    // More detailed error response
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error. Please try again later.",
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : undefined
      },
      { status: 500 }
    );
  }
}