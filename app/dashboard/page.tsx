"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Banknote,
  Calendar,
  CreditCard,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserDashboardStats } from "@/lib/actions/user-dashboard-actions";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserDashboardStats();
      setData(res);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = data ? [
    {
      title: "Active Loans",
      value: data.activeLoansCount.toString(),
      icon: CreditCard,
      change: "Current",
      color: "text-primary",
    },
    {
      title: "Total Borrowed",
      value: `TZS ${data.totalBorrowed.toLocaleString()}`,
      icon: Banknote,
      change: "Lifetime",
      color: "text-secondary",
    },
    {
      title: "Next Payment",
      value: `TZS ${data.nextPaymentAmount.toLocaleString()}`,
      icon: Calendar,
      change: data.nextPaymentDate ? `Due on ${new Date(data.nextPaymentDate).toLocaleDateString()}` : "No payment due",
      color: "text-chart-4",
    },
    {
      title: "Credit Score",
      value: "Good",
      icon: TrendingUp,
      change: `${data.creditScore} points`,
      color: "text-chart-5",
    },
  ] : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      {/* Page header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your loans and track your repayments
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/apply">
            Apply for New Loan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-border/50 h-24 animate-pulse bg-muted/20" />
          ))
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-border/50 h-full">
                <CardContent className="p-3 sm:p-5">
                  <div className="flex items-start sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.title}</p>
                      <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1 truncate">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-lg bg-muted ${stat.color} flex-shrink-0`}>
                      <stat.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Loans */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Recent Loans</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                <Link href="/dashboard/loans">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !data || data.recentLoans.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent loans</p>
              ) : (
                data.recentLoans.map((loan: any, index: number) => (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 gap-2 sm:gap-4"
                  >
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm sm:text-base">
                          {loan.id}
                        </span>
                        <Badge
                          variant={loan.status === "active" ? "default" : "secondary"}
                          className="text-[10px] sm:text-xs"
                        >
                          {loan.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{loan.type}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        TZS {loan.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {new Date(loan.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Payments */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Upcoming Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !data || data.upcomingPayments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No upcoming payments</p>
              ) : (
                data.upcomingPayments.map((payment: any, index: number) => (
                  <motion.div
                    key={payment.loan}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-3 sm:p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-xs sm:text-sm font-medium text-foreground">
                        {payment.loan}
                      </span>
                      <span className="text-[10px] sm:text-sm text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-primary">
                      TZS {payment.amount.toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
              <Button variant="outline" className="w-full bg-transparent text-sm" asChild>
                <Link href="/dashboard/loans">Make Payment</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { icon: CreditCard, label: "Apply for Loan", href: "/dashboard/apply", color: "text-primary" },
                { icon: Banknote, label: "View My Loans", href: "/dashboard/loans", color: "text-secondary" },
                { icon: TrendingUp, label: "Update Profile", href: "/dashboard/profile", color: "text-chart-5" },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="h-auto py-3 sm:py-4 bg-transparent w-full" asChild>
                    <Link href={action.href} className="flex flex-col items-center gap-1.5 sm:gap-2">
                      <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.color}`} />
                      <span className="text-[10px] sm:text-sm text-center leading-tight">{action.label}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
