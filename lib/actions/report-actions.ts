"use server";

import db from "@/lib/db";

export async function getReportData() {
    try {
        const loans = await db.loan.findMany({
            include: { client: true },
        });

        const clients = await db.client.findMany();

        const totalDisbursed = loans.reduce((acc, l) => acc + l.amount, 0);
        const totalCollected = loans.reduce((acc, l) => acc + l.amountPaid, 0);
        const activeClients = clients.filter(c => c.status === "active").length;

        // Default rate (mock for now or calculate based on overdue loans)
        const overdueLoans = loans.filter(l => l.status === "overdue").length;
        const defaultRate = loans.length > 0 ? (overdueLoans / loans.length) * 100 : 0;

        // Monthly disbursements (last 6 months)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            last6Months.push(months[m]);
        }

        const monthlyDisbursements = last6Months.map((month, idx) => {
            // Calculate based on actual loan data for the month
            const monthIndex = (currentMonth - 5 + idx + 12) % 12;
            const monthLoans = loans.filter(l => {
                const loanMonth = l.disbursedDate.getMonth();
                return loanMonth === monthIndex;
            });
            const disbursed = monthLoans.reduce((acc, l) => acc + l.amount, 0);
            const repaid = monthLoans.reduce((acc, l) => acc + l.amountPaid, 0);
            return {
                month,
                disbursed: disbursed || 0,
                repaid: repaid || 0,
            };
        });

        const loanTypeDistribution = [
            { name: "SME Loans", value: loans.filter(l => l.loanType === "SME Loan").length, color: "#e07a5f" },
            { name: "Personal Loans", value: loans.filter(l => l.loanType === "Personal Loan").length, color: "#81b29a" },
            { name: "Business Loans", value: loans.filter(l => l.loanType === "Business Loan").length, color: "#f2cc8f" },
            { name: "Emergency Loans", value: loans.filter(l => l.loanType === "Emergency Loan").length, color: "#3d405b" },
        ];

        // Normalize distribution to percentages
        const totalLoans = loans.length || 1;
        const normalizedDistribution = loanTypeDistribution.map(item => ({
            ...item,
            value: Math.round((item.value / totalLoans) * 100),
        }));

        return {
            totalDisbursed,
            totalCollected,
            activeClients,
            defaultRate,
            monthlyDisbursements,
            loanTypeDistribution: normalizedDistribution,
            // Client growth - calculate from actual client registration dates
            clientGrowth: last6Months.map((month, idx) => {
                const monthIndex = (currentMonth - 5 + idx + 12) % 12;
                const clientsUpToMonth = clients.filter(c => {
                    const regMonth = c.registeredDate.getMonth();
                    return regMonth <= monthIndex;
                }).length;
                return { month, clients: clientsUpToMonth || 0 };
            }),
            // Repayment rates - calculate from actual loan data
            repaymentRates: last6Months.map((month, idx) => {
                const totalLoansCount = loans.length || 1;
                const paidLoans = loans.filter(l => l.amountPaid > 0).length;
                const rate = Math.round((paidLoans / totalLoansCount) * 100);
                return { month, rate: rate || 0 };
            }),
        };
    } catch (error) {
        console.error("Error fetching report data:", error);
        return null;
    }
}
