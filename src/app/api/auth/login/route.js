import { NextResponse } from "next/server";

// login;
export async function GET({params}) {
    return NextResponse.json({message:'login', params:params});
}
