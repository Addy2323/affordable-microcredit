import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
      client: session.client
        ? {
          id: session.client.id,
          name: session.client.name,
          phone: session.client.phone,
          email: session.client.email,
          type: session.client.type,
          status: session.client.status,
        }
        : null,
    });
  } catch (error) {
    console.error("[API] Session check error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Session check failed" },
      { status: 500 }
    );
  }
}
