import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// This is a test endpoint to create a test user
// In production, you should remove this or secure it properly
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { success: false, message: 'Not available in production' },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    
    // Check if test user already exists
    const testEmail = 'test@example.com';
    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Test user already exists',
        user: {
          email: testEmail,
          username: 'testuser',
          password: 'testpassword'
        }
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = new User({
      username: 'testuser',
      email: testEmail,
      password: hashedPassword,
      fullname: 'Test User',
      active: true,
      emailVerified: true
    });

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        email: testEmail,
        username: 'testuser',
        password: 'testpassword' // Only for testing!
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error creating test user',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
