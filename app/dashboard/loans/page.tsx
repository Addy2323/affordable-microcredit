"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Eye, Download, Calendar, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { getUserLoans } from "@/lib/actions/user-dashboard-actions";

interface Loan {
  id: string;
  type: string;
  amount: string;
  amountNumber: number;
  status: "Active" | "Completed" | "Pending" | "Overdue" | "Under Review" | "Rejected";
  disbursedDate: string;
  dueDate: string;
  interestRate: string;
  monthlyPayment: string;
  totalPaid: number;
  totalAmount: number;
  purpose: string;
}

// Hardcoded data removed, fetching from database

export default function LoansPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const data = await getUserLoans();
      setLoans(data as any);
      setLoading(false);
    };
    fetchLoans();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    if (filter === "all") return true;
    return loan.status.toLowerCase() === filter;
  });

  const getStatusVariant = (status: Loan["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "Pending":
        return "outline";
      case "Overdue":
        return "destructive";
      case "Under Review":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Loans</h1>
          <p className="text-muted-foreground">
            View and manage all your loan applications
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Loans</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loans summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Active Loans</p>
            <p className="text-2xl font-bold text-foreground">
              {loading ? "..." : loans.filter((l) => l.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Outstanding Balance
            </p>
            <p className="text-2xl font-bold text-primary">
              {loading ? "..." : `TZS ${loans.filter(l => l.status === "Active").reduce((acc, l) => acc + (l.totalAmount - l.totalPaid), 0).toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Completed Loans</p>
            <p className="text-2xl font-bold text-secondary">
              {loading ? "..." : loans.filter((l) => l.status === "Completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loans list */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Loan History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              filteredLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">
                        {loan.id}
                      </span>
                      <Badge variant={getStatusVariant(loan.status)}>
                        {loan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{loan.type}</p>
                    {loan.status === "Active" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Repayment Progress</span>
                          <span>
                            {Math.round(
                              (loan.totalPaid / loan.totalAmount) * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(loan.totalPaid / loan.totalAmount) * 100}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <p className="text-lg font-bold text-foreground">
                      {loan.amount}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {loan.status === "Completed"
                          ? `Completed ${loan.dueDate}`
                          : `Due ${loan.dueDate}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLoan(loan)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Loan Details - {loan.id}</DialogTitle>
                          <DialogDescription>
                            Complete information about this loan
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Loan Type
                              </p>
                              <p className="font-medium">{loan.type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Status
                              </p>
                              <Badge variant={getStatusVariant(loan.status)}>
                                {loan.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Principal Amount
                              </p>
                              <p className="font-medium">{loan.amount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Interest Rate
                              </p>
                              <p className="font-medium">{loan.interestRate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Monthly Payment
                              </p>
                              <p className="font-medium">{loan.monthlyPayment}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Disbursed Date
                              </p>
                              <p className="font-medium">{loan.disbursedDate}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Purpose
                            </p>
                            <p className="font-medium">{loan.purpose}</p>
                          </div>
                          {loan.status === "Active" && (
                            <div className="pt-4">
                              <Button className="w-full">Make Payment</Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            {!loading && filteredLoans.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No loans found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
