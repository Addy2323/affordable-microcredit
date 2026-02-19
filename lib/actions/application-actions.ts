"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { applicationStatusSchema } from "@/lib/validations";
import { addActivity } from "./activity-actions";
import { getSession } from "@/lib/auth";

export async function getApplications() {
    try {
        return await db.application.findMany({
            orderBy: { submittedDate: "desc" },
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: "Unauthorized" };

        // Server-side validation
        const validation = applicationStatusSchema.safeParse({ status, notes });
        if (!validation.success) {
            return { success: false, error: "Invalid status or notes" };
        }

        const currentApp = await db.application.findUnique({
            where: { id },
        });

        if (!currentApp) {
            return { success: false, error: "Application not found" };
        }

        const application = await db.application.update({
            where: { id },
            data: { status: validation.data.status },
        });

        // Log activity
        await addActivity(
            "Update Application Status",
            `Changed status of application ${id} to ${status}`,
            session.user.name || session.user.email
        );

        // If approved, create a loan record
        if (status === "Approved") {
            const client = await db.client.findFirst({
                where: { email: currentApp.email }
            });

            if (client) {
                // Create loan
                const dueDate = new Date();
                dueDate.setMonth(dueDate.getMonth() + 12); // Default 12 months for now

                await db.loan.create({
                    data: {
                        clientId: client.id,
                        clientName: client.name,
                        loanType: currentApp.type,
                        amount: currentApp.amountNumber,
                        dueDate: dueDate,
                        interestRate: 15, // Default 15% for now
                        status: "active",
                    }
                });

                // Update client stats
                await db.client.update({
                    where: { id: client.id },
                    data: {
                        activeLoans: { increment: 1 },
                        totalLoans: { increment: 1 },
                        totalBorrowed: { increment: currentApp.amountNumber }
                    }
                });

                await addActivity(
                    "Loan Created",
                    `Automatically created loan for ${client.name} following application approval`,
                    "System"
                );
            }
        }

        revalidatePath("/admin/applications");
        revalidatePath("/admin/loans");
        revalidatePath("/dashboard/loans");

        return { success: true, application };
    } catch (error) {
        console.error("Error updating application status:", error);
        return { success: false, error: "Failed to update status" };
    }
}
