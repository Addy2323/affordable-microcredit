"use server";

import { registerUser, loginUser, createClientProfile } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function registerAction(data: any) {
    try {
        const validation = registerSchema.safeParse(data);
        if (!validation.success) {
            return { success: false, error: "Validation failed" };
        }

        const { email, password, firstName, lastName, phone, accountType } = validation.data;

        const user = await registerUser(email, password, "client");
        await createClientProfile(user.id, {
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            account_type: accountType
        });

        // Create session so the user is logged in
        await (await import("@/lib/auth")).createSession(user.id);

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, error: error.message || "Registration failed" };
    }
}

export async function loginAction(data: any) {
    try {
        const validation = loginSchema.safeParse(data);
        if (!validation.success) {
            return { success: false, error: "Validation failed" };
        }

        const result = await loginUser(validation.data.email, validation.data.password);
        if (!result) {
            return { success: false, error: "Invalid email or password" };
        }

        revalidatePath("/");
        return { success: true, user: result.user };
    } catch (error: any) {
        console.error("Login error:", error);
        return { success: false, error: "Login failed" };
    }
}

export async function logoutAction() {
    try {
        const { deleteSession } = await import("@/lib/auth");
        await deleteSession();
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Logout error:", error);
        return { success: false, error: "Logout failed" };
    }
}
