"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CreditCard,
  Banknote,
  FileText,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/lib/actions/dashboard-actions";
import { getApplications } from "@/lib/actions/application-actions";
import { getActivities } from "@/lib/actions/activity-actions";

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [pendingApps, setPendingApps] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [stats, apps, acts] = await Promise.all([
        getAdminDashboardStats(),
        getApplications(),
        getActivities(),
      ]);
      setStatsData(stats);
      setPendingApps(apps.filter(a => a.status === "Pending").slice(0, 4));
      setActivities(acts);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = statsData ? [
    {
      title: "Total Clients",
      value: statsData.totalClients.toLocaleString(),
      change: "+12%",
      changeType: "increase" as const,
      icon: Users,
    },
    {
      title: "Active Loans",
      value: statsData.activeLoans.toLocaleString(),
      change: "+8%",
      changeType: "increase" as const,
      icon: CreditCard,
    },
    {
      title: "Disbursed This Month",
      value: `TZS ${(statsData.disbursedThisMonth / 1000000).toFixed(1)}M`,
      change: "+23%",
      changeType: "increase" as const,
      icon: Banknote,
    },
    {
      title: "Pending Applications",
      value: statsData.pendingApplications.toLocaleString(),
      change: "-5%",
      changeType: "decrease" as const,
      icon: FileText,
    },
  ] : [];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Low":
        return "secondary";
      case "Medium":
        return "outline";
      case "High":
        return "destructive";
      default:
        return "default";
    }
  };

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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of loan operations and system metrics
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/reports">
            View Reports
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
                      <p className="text-lg sm:text-2xl font-bold text-foreground mt-0.5 sm:mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                        {stat.changeType === "increase" ? (
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                        )}
                        <span
                          className={`text-[10px] sm:text-xs ${stat.changeType === "increase"
                            ? "text-secondary"
                            : "text-destructive"
                            }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg bg-muted flex-shrink-0">
                      <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Pending Applications */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Pending Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                <Link href="/admin/applications">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : pendingApps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending applications</p>
              ) : (
                pendingApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 gap-2 sm:gap-4"
                  >
                    <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm">
                          {app.id}
                        </span>
                        <Badge variant={getRiskBadgeVariant(app.risk)} className="text-[10px] sm:text-xs">
                          {app.risk} Risk
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {app.client} - {app.type}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-foreground text-sm">{app.amount}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {new Date(app.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
                        <Link href="/admin/applications">Review</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent activity</p>
              ) : (
                activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="w-2 h-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0"
                    />
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {activity.details}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {activity.user} - {new Date(activity.time).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        {statsData && [
          { icon: TrendingUp, label: "Repayment Rate", value: statsData.activeLoans > 0 ? "N/A" : "N/A", color: "secondary" },
          { icon: Banknote, label: "Portfolio Value", value: `TZS ${(statsData.disbursedThisMonth * 12 / 1000000).toFixed(1)}M`, color: "primary" },
          { icon: Users, label: "New This Month", value: `${statsData.totalClients} Clients`, color: "chart-4" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2 sm:p-3 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
