"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getActivities() {
    try {
        return await db.activity.findMany({
            orderBy: { time: "desc" },
            take: 10,
        });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
}

export async function addActivity(action: string, details: string, user: string) {
    try {
        const activity = await db.activity.create({
            data: {
                action,
                details,
                user,
                time: new Date(),
            },
        });
        revalidatePath("/admin");
        return { success: true, activity };
    } catch (error) {
        console.error("Error adding activity:", error);
        return { success: false, error: "Failed to log activity" };
    }
}
