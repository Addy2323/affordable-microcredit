"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  AlertTriangle,
  Download,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { getLoans, recordPayment } from "@/lib/actions/loan-actions";

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

export default function ActiveLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      const data = await getLoans();
      setLoans(data);
      setLoading(false);
    };
    fetchLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || loan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (loan: (typeof loans)[0]) => {
    Swal.fire({
      title: `<strong>Loan Details</strong>`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>Loan ID:</strong> ${loan.id}</p>
          <p><strong>Client:</strong> ${loan.clientName}</p>
          <p><strong>Loan Type:</strong> ${loan.loanType}</p>
          <p><strong>Principal Amount:</strong> GHS ${loan.amount.toLocaleString()}</p>
          <p><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
          <p><strong>Amount Paid:</strong> GHS ${loan.amountPaid.toLocaleString()}</p>
          <p><strong>Outstanding:</strong> GHS ${(loan.amount - loan.amountPaid).toLocaleString()}</p>
          <p><strong>Progress:</strong> ${((loan.amountPaid / loan.amount) * 100).toFixed(0)}%</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#e07a5f",
    });
  };

  const handleRecordPayment = (loan: (typeof loans)[0]) => {
    Swal.fire({
      title: "Record Payment",
      html: `
        <p style="margin-bottom: 10px;">Client: <strong>${loan.clientName}</strong></p>
        <p style="margin-bottom: 15px;">Expected Amount: <strong>GHS ${loan.nextAmount.toLocaleString()}</strong></p>
      `,
      input: "number",
      inputLabel: "Payment Amount (GHS)",
      inputPlaceholder: "Enter amount",
      inputValue: loan.nextAmount,
      showCancelButton: true,
      confirmButtonColor: "#e07a5f",
      confirmButtonText: "Record Payment",
      preConfirm: (amount) => {
        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Please enter a valid amount");
        }
        return amount;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await recordPayment(loan.id, Number(result.value));
        if (response.success) {
          // Refresh loans
          const data = await getLoans();
          setLoans(data);
          Swal.fire({
            title: "Payment Recorded!",
            text: `GHS ${Number(result.value).toLocaleString()} has been recorded for ${loan.clientName}`,
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        } else {
          Swal.fire("Error", "Failed to record payment", "error");
        }
      }
    });
  };

  const handleSendReminder = (loan: (typeof loans)[0]) => {
    Swal.fire({
      title: "Send Payment Reminder?",
      text: `This will send an SMS reminder to ${loan.clientName} for their upcoming payment of GHS ${loan.nextAmount.toLocaleString()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e07a5f",
      confirmButtonText: "Send Reminder",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Reminder Sent!",
          text: `Payment reminder has been sent to ${loan.clientName}`,
          icon: "success",
          confirmButtonColor: "#e07a5f",
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            Active
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    {
      title: "Total Active Loans",
      value: loans.filter((l) => l.status === "active").length,
      icon: CreditCard,
      color: "text-primary",
    },
    {
      title: "Total Disbursed",
      value: `GHS ${loans.reduce((acc, l) => acc + l.amount, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-secondary",
    },
    {
      title: "Overdue Loans",
      value: loans.filter((l) => l.status === "overdue").length,
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "Completed This Month",
      value: loans.filter((l) => l.status === "completed").length,
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground">Active Loans</h1>
        <p className="text-muted-foreground">
          Manage and monitor all active loan accounts
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
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
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filter */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name or loan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      {filterStatus || "All Status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("overdue")}>
                      Overdue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("completed")}
                    >
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredLoans.map((loan, index) => (
                        <motion.tr
                          key={loan.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b"
                        >
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{loan.clientName}</p>
                              <p className="text-xs text-muted-foreground">
                                {loan.clientId}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{loan.loanType}</TableCell>
                          <TableCell className="text-right">
                            GHS {loan.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <p>GHS {loan.amountPaid.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {((loan.amountPaid / loan.amount) * 100).toFixed(0)}
                                %
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {loan.nextPayment && loan.nextPayment !== "-" ? (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(loan.nextPayment).toLocaleDateString()}
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(loan.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(loan)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {loan.status !== "completed" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleRecordPayment(loan)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Record Payment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleSendReminder(loan)}
                                    >
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      Send Reminder
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
