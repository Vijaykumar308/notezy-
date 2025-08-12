import { NextResponse } from 'next/server';

// This endpoint tests if authentication is working properly
export async function GET(request) {
  try {
    // Test if JWT_SECRET is set
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secure_jwt_secret_here_please_change_me_in_production') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'JWT_SECRET is not properly configured',
          isDefaultSecret: process.env.JWT_SECRET === 'your_secure_jwt_secret_here_please_change_me_in_production'
        },
        { status: 500 }
      );
    }

    // Test database connection
    try {
      const { connectDB } = await import('@/lib/dbconn');
      await connectDB();
    } catch (dbError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed',
          error: dbError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication test passed',
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Authentication test failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
