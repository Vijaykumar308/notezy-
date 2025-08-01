import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function POST(req) {
  await connectDB();
  
  try {
    const { identifier, password, rememberMe = false } = await req.json();

    // Input validation
    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/username and password are required",
        },
        { status: 400 }
      );
    }

    // Trim and normalize input
    const normalizedIdentifier = identifier.trim().toLowerCase();

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

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { 
        expiresIn: rememberMe ? "7d" : "1h", // Longer if remember me is checked
        issuer: "your-app-name",
        audience: "your-app-users",
      }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id },
      JWT_REFRESH_SECRET,
      { 
        expiresIn: rememberMe ? "30d" : "7d",
        issuer: "your-app-name",
        audience: "your-app-users",
      }
    );

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            active: user.active,
            emailVerified: user.emailVerified,
            lastLogin: new Date(),
          },
        },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      path: "/",
    };

    // Access token cookie (shorter expiry)
    const accessTokenExpiry = rememberMe 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      : new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      expires: accessTokenExpiry,
    });

    // Refresh token cookie (longer expiry)
    const refreshTokenExpiry = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: refreshTokenExpiry,
    });

    // Set user session info cookie (for client-side access to basic user info)
    response.cookies.set("userSession", JSON.stringify({
      id: user._id,
      username: user.username,
      role: user.role,
      isLoggedIn: true,
    }), {
      httpOnly: false, // Accessible to client-side JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: accessTokenExpiry,
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}