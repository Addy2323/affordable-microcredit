"use client";

import React from "react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    LayoutDashboard,
    FileText,
    Users,
    CreditCard,
    Settings,
    BarChart3,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronDown,
    User,
    Shield,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Loan Applications", href: "/admin/applications", icon: FileText },
    { name: "Active Loans", href: "/admin/loans", icon: CreditCard },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminClientLayoutProps {
    children: React.ReactNode;
    userProfile: { name: string; email: string } | null;
}

export default function AdminClientLayout({
    children,
    userProfile,
}: AdminClientLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-foreground transition-transform duration-300 lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-background/10">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <svg viewBox="0 0 40 40" className="w-8 h-8">
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="14"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="text-primary"
                                />
                                <path
                                    d="M12 20 C12 14, 20 10, 28 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    className="text-secondary"
                                />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-primary">Affordable</span>
                            <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-secondary" />
                                <span className="text-xs text-background/70">Admin Portal</span>
                            </div>
                        </div>
                    </Link>
                    <button
                        className="lg:hidden p-1 text-background/70"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navigation.map((item, index) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "text-background/70 hover:bg-background/10 hover:text-background"
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-background/10">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-background/70 hover:bg-background/10 hover:text-background transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border"
                >
                    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                        <button
                            className="lg:hidden p-2 text-foreground"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="hidden lg:flex items-center gap-2">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <h1 className="text-base sm:text-lg font-semibold text-foreground">
                                Admin Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"
                                />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-1 sm:gap-2 px-2 sm:px-3">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
                                        </div>
                                        <span className="hidden sm:inline text-sm font-medium">
                                            {userProfile?.name || "Admin User"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/" className="text-destructive">
                                            Sign Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </motion.header>

                {/* Page content */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 lg:p-6"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
}
