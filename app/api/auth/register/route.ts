import { NextRequest, NextResponse } from "next/server";
import { registerUser, createClientProfile, createSession } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      accountType = "individual",
      address,
      city,
      state,
      dateOfBirth,
      gender,
      occupation,
      employer,
      monthlyIncome,
      idType,
      idNumber,
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "Email, password, first name, last name, and phone are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if email exists
    const emailExists = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (emailExists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create user
    const user = await registerUser(email, password, "client");

    // Create client profile
    const client = await createClientProfile(user.id, {
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      account_type: accountType,
      address,
      city,
      state,
      date_of_birth: dateOfBirth,
      gender,
      occupation,
      employer,
      monthly_income: monthlyIncome ? parseFloat(monthlyIncome) : undefined,
      id_type: idType,
      id_number: idNumber,
    });

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      client: {
        id: client.id,
        name: client.name,
        type: client.type,
      },
    });
  } catch (error) {
    console.error("[API] Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
