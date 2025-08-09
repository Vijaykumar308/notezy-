import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
  console.warn('WARNING: Using default JWT secret. This is not secure for production!');
}
if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-refresh-secret-key') {
  console.warn('WARNING: Using default JWT refresh secret. This is not secure for production!');
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
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
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

    // Create JWT payload
    const tokenPayload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Common JWT options
    const jwtOptions = {
      issuer: "your-app-name",
      audience: "your-app-users"
    };

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { 
        expiresIn: rememberMe ? "7d" : "1h", // Longer if remember me is checked
        issuer: "your-app-name",
        audience: "your-app-users"
      }
    );

    console.log('Generated access token with payload:', tokenPayload);

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { 
        userId: user._id.toString(),
        username: user.username
      },
      JWT_REFRESH_SECRET,
      { 
        expiresIn: rememberMe ? "30d" : "7d",
        issuer: "your-app-name",
        audience: "your-app-users"
      }
    );
    
    console.log('Generated refresh token for user:', user._id);

    // Log the token for debugging (remove in production)
    console.log('Generated access token:', accessToken);
    console.log('Token payload:', tokenPayload);

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
        data: { user: userData },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies
    const isProduction = process.env.NODE_ENV === "production";
    
    // Base cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: "lax",
      path: "/"
    };
    
    // Set maxAge based on rememberMe
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60; // 7 days or 1 hour
    
    console.log('Cookie options:', {
      ...cookieOptions,
      maxAge,
      isProduction
    });

    // Calculate token expiration times
    const accessTokenExpiry = rememberMe 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      : new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const refreshTokenExpiry = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Set access token cookie
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: accessTokenExpiry,
      maxAge: Math.floor((accessTokenExpiry.getTime() - Date.now()) / 1000) // in seconds
    });

    // Set refresh token cookie
    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: refreshTokenExpiry,
      maxAge: Math.floor((refreshTokenExpiry.getTime() - Date.now()) / 1000) // in seconds
    });

    // Set user session info cookie (for client-side use)
    const userSessionData = {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      isLoggedIn: true,
      initials: userData.initials
    };
    
    response.cookies.set({
      name: "userSession",
      value: JSON.stringify(userSessionData),
      httpOnly: false, // Accessible to client-side JavaScript
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: accessTokenExpiry,
      maxAge: Math.floor((accessTokenExpiry.getTime() - Date.now()) / 1000) // in seconds
    });

    // Set token cookie for API authentication
    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: accessTokenExpiry,
      maxAge: Math.floor((accessTokenExpiry.getTime() - Date.now()) / 1000) // in seconds
    });

    return response;

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