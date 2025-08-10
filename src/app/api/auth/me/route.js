import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not set! This is insecure in production.");
}

export async function GET(request) {
  try {
    await connectDB();

    // Check for prevent auto-login header
    const preventAutoLogin = 
      request.headers.get("x-prevent-auto-login") === "true" ||
      request.headers.get("X-Prevent-Auto-Login") === "true";
      
    if (preventAutoLogin) {
      return NextResponse.json(
        { success: false, message: "Auto-login disabled after logout" },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          }
        }
      );
    }

    // Get cookies safely
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("accessToken") || cookieStore.get("token");

    if (!tokenCookie?.value) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No authentication token found",
          requiresAuth: true
        },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(tokenCookie.value, JWT_SECRET, {
        algorithms: ["HS256"],
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(decoded.userId).select("-password -__v");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data (no Set-Cookie to avoid re-setting tokens)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        avatar: user.avatar,
        isGuest: false,
      },
    });
  } catch (error) {
    console.error("Error in auth/me endpoint:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
