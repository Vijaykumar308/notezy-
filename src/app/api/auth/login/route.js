import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    // Generate session token
    const sessionToken = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { 
        expiresIn: rememberMe ? "7d" : "1h", // Longer if remember me is checked
        issuer: "your-app-name",
        audience: "your-app-users"
      }
    );

    console.log('Generated session token with payload:', tokenPayload);

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
      initials: userData.initials
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
    response.cookies.set("token", sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: tokenExpiry,
      maxAge: Math.floor((tokenExpiry.getTime() - Date.now()) / 1000) // in seconds
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