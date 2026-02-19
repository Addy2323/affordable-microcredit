import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    accountType: z.string().min(1, "Please select an account type"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const loanApplicationSchema = z.object({
    // Step 1: Loan Type
    loanType: z.string().min(1, "Please select a loan type"),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Please enter a valid loan amount",
    }),
    tenure: z.string().min(1, "Please select a repayment period"),
    purpose: z.string().min(10, "Please describe the purpose (min 10 characters)"),

    // Step 2: Personal Info
    fullName: z.string().min(3, "Full name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationalId: z.string().min(5, "National ID is required"),
    address: z.string().min(5, "Residential address is required"),
    city: z.string().min(2, "City/District is required"),

    // Step 3: Financial Details
    employmentStatus: z.string().min(1, "Employment status is required"),
    employerName: z.string().optional(),
    monthlyIncome: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Monthly income is required",
    }),
    existingLoans: z.string().optional(),
    bankName: z.string().min(1, "Bank name is required"),
    accountNumber: z.string().min(5, "Account number is required"),

    // Agreements
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms",
    }),
    creditCheckConsent: z.boolean().refine((val) => val === true, {
        message: "You must consent to the credit check",
    }),
});

export const applicationStatusSchema = z.object({
    status: z.enum(["Pending", "Approved", "Rejected", "Under Review"]),
    notes: z.string().optional(),
});

export const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    accountType: z.string().min(1, "Please select an account type"),
});
