import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Clear all possible authentication cookies
    const cookiesToClear = [
      'accessToken',
      'refreshToken',
      'token',
      'userSession',
      'next-auth.session-token',
      '__Secure-next-auth.session-token'
    ];

    // Clear each cookie
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0)
      });
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