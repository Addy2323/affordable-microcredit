"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getClients() {
    try {
        return await db.client.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
    }
}

export async function addClient(data: any) {
    try {
        const client = await db.client.create({
            data: {
                ...data,
                registeredDate: new Date(),
            },
        });
        revalidatePath("/admin/clients");
        return { success: true, client };
    } catch (error) {
        console.error("Error adding client:", error);
        return { success: false, error: "Failed to add client" };
    }
}

export async function deleteClient(id: string) {
    try {
        await db.client.delete({
            where: { id },
        });
        revalidatePath("/admin/clients");
        return { success: true };
    } catch (error) {
        console.error("Error deleting client:", error);
        return { success: false, error: "Failed to delete client" };
    }
}
