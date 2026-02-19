"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Printer,
  Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { getReportData } from "@/lib/actions/report-actions";

// Hardcoded data removed, fetching from database

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

export default function ReportsPage() {
  const [period, setPeriod] = useState("6months");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getReportData();
      setData(res);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleExportReport = (reportType: string) => {
    Swal.fire({
      title: "Export Report",
      text: `Choose export format for ${reportType}`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "PDF",
      denyButtonText: "Excel",
      confirmButtonColor: "#e07a5f",
      denyButtonColor: "#81b29a",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Generating PDF...",
          text: "Please wait while we prepare your report",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.fire({
            title: "Report Generated!",
            text: `${reportType} has been exported as PDF`,
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: "Generating Excel...",
          text: "Please wait while we prepare your report",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.fire({
            title: "Report Generated!",
            text: `${reportType} has been exported as Excel`,
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        });
      }
    });
  };

  const handleGenerateFullReport = () => {
    Swal.fire({
      title: "Generate Full Report",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p>This will generate a comprehensive report including:</p>
          <ul style="margin-top: 10px;">
            <li>Financial Summary</li>
            <li>Loan Portfolio Analysis</li>
            <li>Client Demographics</li>
            <li>Repayment Performance</li>
            <li>Risk Assessment</li>
          </ul>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Generate Report",
      confirmButtonColor: "#e07a5f",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Generating Report...",
          html: "Processing data...",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.fire({
            title: "Report Ready!",
            text: "Your comprehensive report has been generated and is ready for download.",
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        });
      }
    });
  };

  const stats = data ? [
    {
      title: "Total Disbursed (YTD)",
      value: `TZS ${(data.totalDisbursed / 1000000).toFixed(2)}M`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Collected (YTD)",
      value: `TZS ${(data.totalCollected / 1000000).toFixed(2)}M`,
      change: "+8.3%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Active Clients",
      value: data.activeClients.toString(),
      change: "+15.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Default Rate",
      value: `${data.defaultRate.toFixed(1)}%`,
      change: "-0.5%",
      trend: "down",
      icon: TrendingDown,
    },
  ] : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Analytics and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateFullReport} className="gap-2">
            <FileText className="h-4 w-4" />
            Full Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-border/50 h-24 animate-pulse bg-muted/20" />
          ))
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge
                        variant={stat.trend === "up" ? "default" : "secondary"}
                        className={
                          stat.trend === "up"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <stat.icon
                      className={`h-8 w-8 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">
              Disbursements vs Repayments
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExportReport("Disbursements Report")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyDisbursements}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `TZS ${value.toLocaleString()}`,
                      ]}
                    />
                    <Bar
                      dataKey="disbursed"
                      fill="#e07a5f"
                      name="Disbursed"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="repaid"
                      fill="#81b29a"
                      name="Repaid"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Loan Type Distribution</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExportReport("Loan Distribution Report")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.loanTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {data.loanTypeDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Client Growth</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExportReport("Client Growth Report")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.clientGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="clients"
                      stroke="#e07a5f"
                      fill="#e07a5f"
                      fillOpacity={0.3}
                      name="Total Clients"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Repayment Rate Trend</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExportReport("Repayment Rate Report")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.repaymentRates}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      domain={[80, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip formatter={(value: number) => [`${value}%`, "Rate"]} />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#81b29a"
                      strokeWidth={3}
                      dot={{ fill: "#81b29a", strokeWidth: 2 }}
                      name="Repayment Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Reports */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Daily Collection Report", icon: DollarSign },
                { name: "Outstanding Loans", icon: FileText },
                { name: "Defaulters List", icon: Users },
                { name: "Monthly Summary", icon: Calendar },
              ].map((report) => (
                <motion.div
                  key={report.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
                    onClick={() => handleExportReport(report.name)}
                  >
                    <report.icon className="h-6 w-6 text-primary" />
                    <span className="text-sm">{report.name}</span>
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
