"use server";

import db from "@/lib/db";

export async function getAdminDashboardStats() {
    try {
        const totalClients = await db.client.count();
        const activeLoans = await db.loan.count({ where: { status: "active" } });
        const disbursedThisMonth = await db.loan.aggregate({
            _sum: { amount: true },
            where: {
                disbursedDate: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        const pendingApplications = await db.application.count({ where: { status: "Pending" } });

        return {
            totalClients,
            activeLoans,
            disbursedThisMonth: disbursedThisMonth._sum.amount || 0,
            pendingApplications,
        };
    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        return {
            totalClients: 0,
            activeLoans: 0,
            disbursedThisMonth: 0,
            pendingApplications: 0,
        };
    }
}
