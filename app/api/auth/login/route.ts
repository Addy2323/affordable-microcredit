import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import db from "@/lib/db";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  account_type: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Attempt login
    const result = await loginUser(email, password);

    if (!result) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Get client profile if exists
    const client = await db.client.findFirst({
      where: { email: result.user.email }, // Using email since user_id relation is not in schema yet
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
      client: client
        ? {
          id: client.id,
          name: client.name,
          type: client.type,
        }
        : null,
    });
  } catch (error) {
    console.error("[API] Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
