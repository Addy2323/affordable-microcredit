"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { loanApplicationSchema, profileSchema } from "@/lib/validations";

export async function getUserDashboardStats() {
    try {
        const session = await getSession();
        if (!session) return null;

        const client = await db.client.findFirst({
            where: { email: session.user.email },
            include: {
                loans: true,
            },
        });

        if (!client) return null;

        const activeLoans = client.loans.filter(l => l.status === "active");
        const totalBorrowed = client.loans.reduce((acc, l) => acc + l.amount, 0);

        // Find next payment
        const nextLoan = activeLoans
            .filter(l => l.nextPayment)
            .sort((a, b) => a.nextPayment!.getTime() - b.nextPayment!.getTime())[0];

        return {
            activeLoansCount: activeLoans.length,
            totalBorrowed,
            nextPaymentAmount: nextLoan?.nextAmount || 0,
            nextPaymentDate: nextLoan?.nextPayment || null,
            creditScore: 720, // Mock for now
            recentLoans: client.loans.slice(0, 5).map(l => ({
                id: l.id,
                type: l.loanType,
                amount: l.amount,
                status: l.status,
                date: l.disbursedDate,
            })),
            upcomingPayments: activeLoans
                .filter(l => l.nextPayment)
                .map(l => ({
                    loan: l.id,
                    amount: l.nextAmount,
                    dueDate: l.nextPayment,
                })),
        };
    } catch (error) {
        console.error("Error fetching user dashboard stats:", error);
        return null;
    }
}

export async function getUserLoans() {
    try {
        const session = await getSession();
        if (!session) return [];

        const client = await db.client.findFirst({
            where: { email: session.user.email },
            include: {
                loans: {
                    orderBy: { disbursedDate: "desc" },
                },
            },
        });

        const applications = await db.application.findMany({
            where: { email: session.user.email },
            orderBy: { submittedDate: "desc" },
        });

        const formattedLoans = client?.loans.map(l => ({
            id: l.id,
            type: l.loanType,
            amount: `TZS ${l.amount.toLocaleString()}`,
            amountNumber: l.amount,
            status: l.status.charAt(0).toUpperCase() + l.status.slice(1) as any,
            disbursedDate: l.disbursedDate.toLocaleDateString(),
            dueDate: l.dueDate.toLocaleDateString(),
            interestRate: `${l.interestRate}%`,
            monthlyPayment: `TZS ${(l.nextAmount || 0).toLocaleString()}`,
            totalPaid: l.amountPaid,
            totalAmount: l.amount * (1 + l.interestRate / 100), // Simplified
            purpose: "N/A",
        })) || [];

        const formattedApps = applications
            .filter(app => app.status !== "Approved") // Approved apps become loans
            .map(app => ({
                id: app.id,
                type: app.type,
                amount: app.amount,
                amountNumber: app.amountNumber,
                status: app.status as any,
                disbursedDate: "Pending",
                dueDate: "Pending",
                interestRate: "N/A",
                monthlyPayment: "N/A",
                totalPaid: 0,
                totalAmount: app.amountNumber,
                purpose: app.purpose,
            }));

        return [...formattedApps, ...formattedLoans];
    } catch (error) {
        console.error("Error fetching user loans and applications:", error);
        return [];
    }
}

export async function getUserProfile() {
    try {
        const session = await getSession();
        if (!session) return null;

        const client = await db.client.findFirst({
            where: { email: session.user.email },
        });

        if (!client) return {
            name: session.user.name || "User",
            email: session.user.email,
        };

        const nameParts = client.name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        return {
            name: client.name,
            firstName,
            lastName,
            email: client.email,
            phone: client.phone,
            address: "N/A", // Not in schema yet
            city: "N/A", // Not in schema yet
            nationalId: "N/A", // Not in schema yet
            accountType: client.type,
            registeredDate: client.registeredDate.toLocaleDateString(),
            totalLoans: client.totalLoans,
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function submitApplication(data: any) {
    try {
        console.log("[Submit] Starting submission process...");
        const session = await getSession();
        if (!session) {
            console.error("[Submit] Submission failed: No session found");
            throw new Error("Unauthorized");
        }
        console.log("[Submit] Session found for user:", session.user.email);

        // Server-side validation
        const validation = loanApplicationSchema.safeParse(data);
        if (!validation.success) {
            console.warn("Submission failed: Validation error", validation.error.format());
            return {
                success: false,
                error: "Validation failed: " + validation.error.errors.map(e => e.message).join(", ")
            };
        }

        const validatedData = validation.data;
        const amountNumber = parseFloat(validatedData.amount);
        const incomeNumber = parseFloat(validatedData.monthlyIncome);

        console.log("Attempting to create application in database...");
        const application = await db.application.create({
            data: {
                client: validatedData.fullName,
                email: session.user.email,
                phone: "N/A", // Phone is not in loanApplicationSchema
                type: validatedData.loanType,
                amount: `TZS ${amountNumber.toLocaleString()}`,
                amountNumber: amountNumber,
                purpose: validatedData.purpose || "N/A",
                status: "Pending",
                risk: "Low",
                creditScore: 700,
                employmentStatus: validatedData.employmentStatus || "N/A",
                monthlyIncome: `TZS ${incomeNumber.toLocaleString()}`,
            },
        });

        console.log("Application created successfully with ID:", application.id);
        return { success: true, application };
    } catch (error: any) {
        console.error("Error submitting application:", error);
        return {
            success: false,
            error: error.message || "Failed to submit application. Please check your inputs."
        };
    }
}

export async function updateUserProfile(data: any) {
    try {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");

        // Server-side validation
        const validation = profileSchema.safeParse(data);
        if (!validation.success) {
            return { success: false, error: "Validation failed: " + validation.error.errors.map(e => e.message).join(", ") };
        }

        const validatedData = validation.data;

        await db.client.updateMany({
            where: { email: session.user.email },
            data: {
                name: `${validatedData.firstName} ${validatedData.lastName}`,
                email: validatedData.email,
                phone: validatedData.phone,
                type: validatedData.accountType,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
