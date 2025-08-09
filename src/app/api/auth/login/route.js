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
    const domain = isProduction ? ".yourdomain.com" : "localhost";
    
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? "lax" : "lax", // More compatible with most browsers
      path: "/",
      domain: domain,
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      sameSite: "lax"
    };
    
    console.log('Cookie options:', {
      ...cookieOptions,
      domain: domain,
      isProduction: isProduction
    });

    // Access token cookie (shorter expiry)
    const accessTokenExpiry = rememberMe 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      : new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    console.log('Setting access token cookie with expiry:', accessTokenExpiry);
    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      ...cookieOptions,
      expires: accessTokenExpiry,
    });

    // Refresh token cookie (longer expiry)
    const refreshTokenExpiry = rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    console.log('Setting refresh token cookie with expiry:', refreshTokenExpiry);
    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      ...cookieOptions,
      expires: refreshTokenExpiry,
    });

    // Set user session info cookie with initials
    const userSessionData = {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      isLoggedIn: true,
      initials: userData.initials
    };
    
    console.log('Setting user session cookie with data:', userSessionData);
    response.cookies.set({
      name: "userSession",
      value: JSON.stringify(userSessionData),
      httpOnly: false, // Accessible to client-side JavaScript
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      expires: accessTokenExpiry,
    });
    
    // Log all cookies being set
    console.log('All response cookies:', response.cookies.getAll().map(c => ({
      name: c.name,
      domain: c.domain,
      path: c.path,
      expires: c.expires,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite
    })));

    // Set a token cookie that will be used for API authentication
    response.cookies.set("token", accessToken, {
      ...cookieOptions,
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