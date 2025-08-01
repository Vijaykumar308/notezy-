import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear all authentication cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Set to past date to delete cookie
    };

    // Clear access token
    response.cookies.set("accessToken", "", cookieOptions);
    
    // Clear refresh token
    response.cookies.set("refreshToken", "", cookieOptions);
    
    // Clear user session (this one is not httpOnly)
    response.cookies.set("userSession", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    return response;

  } catch (error) {
    console.error("Logout Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed. Please try again.",
      },
      { status: 500 }
    );
  }
}