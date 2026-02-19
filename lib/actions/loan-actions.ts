"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getLoans() {
    try {
        return await db.loan.findMany({
            include: { client: true },
            orderBy: { disbursedDate: "desc" },
        });
    } catch (error) {
        console.error("Error fetching loans:", error);
        return [];
    }
}

export async function recordPayment(loanId: string, amount: number) {
    try {
        const loan = await db.loan.findUnique({
            where: { id: loanId },
        });

        if (!loan) throw new Error("Loan not found");

        const newAmountPaid = loan.amountPaid + amount;
        const isCompleted = newAmountPaid >= loan.amount;

        const updatedLoan = await db.loan.update({
            where: { id: loanId },
            data: {
                amountPaid: newAmountPaid,
                status: isCompleted ? "completed" : loan.status,
            },
        });

        revalidatePath("/admin/loans");
        revalidatePath("/dashboard");
        return { success: true, loan: updatedLoan };
    } catch (error) {
        console.error("Error recording payment:", error);
        return { success: false, error: "Failed to record payment" };
    }
}
