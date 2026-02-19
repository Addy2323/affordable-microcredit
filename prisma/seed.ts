import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding data...");

    // Clear existing data
    await prisma.activity.deleteMany();
    await prisma.application.deleteMany();
    await prisma.loan.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();

    // Create Admin User
    const admin = await prisma.user.create({
        data: {
            email: "admin@microcredit.com",
            password: "password123", // In a real app, this should be hashed
            name: "System Admin",
            role: "admin",
        },
    });

    // Create Clients
    const client1 = await prisma.client.create({
        data: {
            id: "CL-001",
            name: "John Mensah",
            email: "john.mensah@email.com",
            phone: "+233 24 123 4567",
            type: "Individual",
            registeredDate: new Date("2023-06-15"),
            status: "active",
            totalBorrowed: 120000,
            totalLoans: 3,
            activeLoans: 1,
        },
    });

    const client2 = await prisma.client.create({
        data: {
            id: "CL-002",
            name: "Grace Okonkwo",
            email: "grace.okonkwo@email.com",
            phone: "+233 50 987 6543",
            type: "SME",
            registeredDate: new Date("2023-08-20"),
            status: "active",
            totalBorrowed: 75000,
            totalLoans: 2,
            activeLoans: 1,
        },
    });

    // Create Loans
    await prisma.loan.create({
        data: {
            id: "LN-2024-001",
            clientId: client1.id,
            clientName: client1.name,
            loanType: "SME Loan",
            amount: 50000,
            disbursedDate: new Date("2024-01-15"),
            dueDate: new Date("2025-01-15"),
            interestRate: 15,
            amountPaid: 30000,
            status: "active",
            nextPayment: new Date("2024-02-15"),
            nextAmount: 5000,
        },
    });

    await prisma.loan.create({
        data: {
            id: "LN-2024-002",
            clientId: client2.id,
            clientName: client2.name,
            loanType: "Personal Loan",
            amount: 20000,
            disbursedDate: new Date("2024-01-20"),
            dueDate: new Date("2024-07-20"),
            interestRate: 18,
            amountPaid: 15000,
            status: "active",
            nextPayment: new Date("2024-02-20"),
            nextAmount: 2500,
        },
    });

    // Create Applications
    await prisma.application.create({
        data: {
            id: "APP-2024-089",
            client: "Grace Makundi",
            email: "grace@example.com",
            phone: "+255 712 345 678",
            type: "Business Loan",
            amount: "TZS 2,500,000",
            amountNumber: 2500000,
            purpose: "Expanding retail shop inventory",
            status: "Pending",
            submittedDate: new Date("2024-02-10"),
            risk: "Low",
            creditScore: 720,
            employmentStatus: "Self-employed",
            monthlyIncome: "TZS 800,000",
        },
    });

    // Create Activities
    await prisma.activity.create({
        data: {
            action: "Login",
            details: "Admin logged into the system",
            user: "System Admin",
            time: new Date(),
        },
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
