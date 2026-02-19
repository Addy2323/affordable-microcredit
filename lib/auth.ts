import db from "./db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string | null;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  registeredDate: Date;
  status: string;
  totalBorrowed: number;
  totalLoans: number;
  activeLoans: number;
  createdAt: Date;
  updatedAt: Date;
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate session token
export function generateToken(): string {
  return uuidv4() + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2);
}

// Create session
export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  const cookieStore = await (await import("next/headers")).cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// Get current session
export async function getSession(): Promise<{ user: User; client?: Client | null } | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    console.log("[Auth] No session token found in cookies");
    return null;
  }

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  let client = null;
  if (session.user.role === "client") {
    client = await db.client.findUnique({
      where: { email: session.user.email },
    });
  }

  return {
    user: session.user as any,
    client: client as any
  };
}

// Delete session (logout)
export async function deleteSession(): Promise<void> {
  const cookieStore = await (await import("next/headers")).cookies();
  const token = cookieStore.get("session_token")?.value;

  if (token) {
    await db.session.deleteMany({ where: { token } });
    cookieStore.delete("session_token");
  }
}

// Require authentication middleware helper
export async function requireAuth(allowedRoles?: string[]): Promise<{ user: User }> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}

// Register new user
export async function registerUser(
  email: string,
  password: string,
  role: string = "client"
): Promise<User> {
  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email: email.toLowerCase(),
      password: passwordHash,
      role,
    },
  });

  return user as any;
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  const token = await createSession(user.id);

  return {
    user: user as any,
    token,
  };
}

// Create client profile
export async function createClientProfile(
  userId: string,
  data: any
): Promise<any> {
  const client = await db.client.create({
    data: {
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone: data.phone,
      type: data.account_type || "Individual",
      status: "active",
    },
  });

  return client;
}
