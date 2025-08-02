import { connectDB } from "@/lib/dbconn";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator";

export async function POST(req) {
  await connectDB();
  
  try {
    const {
      username,
      fullname,
      email,
      password,
      confirmPassword,
      rememberMe = false,
    } = await req.json();

    // Input validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields must be provided",
          errors: {
            username: !username ? "Username is required" : null,
            email: !email ? "Email is required" : null,
            password: !password ? "Password is required" : null,
            confirmPassword: !confirmPassword ? "Confirm password is required" : null,
          }
        },
        { status: 400 }
      );
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedFullname = fullname?.trim() || "";

    // Validate email format
    if (!validator.isEmail(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Validate username (alphanumeric, 3-20 characters, no spaces)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        {
          success: false,
          message: "Username must be 3-20 characters and contain only letters, numbers, and underscores",
        },
        { status: 400 }
      );
    }

    // Normalize username and email
    const normalizedUsername = trimmedUsername.toLowerCase();
    const normalizedEmail = trimmedEmail.toLowerCase();

    // Password match check
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Enhanced password strength validation
    const passwordErrors = [];
    if (password.length < 8) {
      passwordErrors.push("Password must be at least 8 characters long");
    }
    if (password.length > 128) {
      passwordErrors.push("Password must be less than 128 characters");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      passwordErrors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      passwordErrors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      passwordErrors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      passwordErrors.push("Password must contain at least one special character");
    }

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Password does not meet requirements",
          errors: passwordErrors,
        },
        { status: 400 }
      );
    }

    // Check for common passwords (optional - you can expand this list)
    const commonPasswords = ['password', '123456', 'password123', 'admin', 'qwerty'];
    if (commonPasswords.includes(password.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is too common. Please choose a more secure password",
        },
        { status: 400 }
      );
    }

    // Check if user already exists (both username and email)
    const existingUser = await User.findOne({
      $or: [
        { username: normalizedUsername },
        { email: normalizedEmail }
      ]
    });

    if (existingUser) {
      const conflictField = existingUser.username === normalizedUsername ? 'username' : 'email';
      return NextResponse.json(
        {
          success: false,
          message: `User already exists with this ${conflictField}`,
          field: conflictField,
        },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const saltRounds = 12; // Higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const newUser = new User({
      username: normalizedUsername,
      fullname: trimmedFullname,
      email: normalizedEmail,
      password: hashedPassword, // Store hashed password
      active: true,
      rememberMe: Boolean(rememberMe),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save user to database
    const userCreated = await newUser.save();

    // Return success response (never include password in response)
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          id: userCreated._id,
          username: userCreated.username,
          fullname: userCreated.fullname,
          email: userCreated.email,
          active: userCreated.active,
          createdAt: userCreated.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          message: `User already exists with this ${duplicateField}`,
          field: duplicateField,
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}