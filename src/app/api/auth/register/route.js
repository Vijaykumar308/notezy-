import { connectDB } from "@/lib/dbconn";
import { NextResponse } from "next/server";
import User from "../../../../models/userModel";

export async function POST(req) {
    await connectDB();
     try {
        const {username, fullname, email, password, confirmPassword, rememberMe} = await req.json();

        // username;
        // username should be in small case;
        // password should be strong; uppercase, smallcase, numeric, special chars, min len: 6, max:16;

        if(!username || !email || !password || !confirmPassword) {
            return NextResponse.json({
                status: 400,
                message:"Required fields are missing",
            }, {status:400});
        }

        // check duplicate;
        const user = await User.find({username, active});
        if(!user) {
            return NextResponse.json({status:404, message:"User already exist with this username"}, {status:404});
        }
        
        const userCreate = {
            username, fullname, email, password, active, rememberMe
        }

        const userCreated = await User.save(userCreate);
        if(userCreated) {
            return NextResponse.json({
                message: 'Register successfully',
                data: userCreate,
            });
        }
        
        return NextResponse.json({status: 500, message:"User creation error"}, {status:500});
    } catch (error) {
        return NextResponse.json(
            { message: "Invalid JSON or server error" },
            { status: 400 }
        );
    }
}