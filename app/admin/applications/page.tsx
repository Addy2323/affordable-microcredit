"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { getApplications, updateApplicationStatus } from "@/lib/actions/application-actions";

interface Application {
  id: string;
  client: string;
  email: string;
  phone: string;
  type: string;
  amount: string;
  amountNumber: number;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected" | "Under Review";
  submittedDate: string;
  risk: "Low" | "Medium" | "High";
  creditScore: number;
  employmentStatus: string;
  monthlyIncome: string;
}

// Hardcoded data removed, fetching from database

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getApplications();
      setApplications(data as any);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const response = await updateApplicationStatus(id, status);
    if (response.success) {
      setApplications(applications.map(app => app.id === id ? { ...app, status: status as any } : app));
      setSelectedApp(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.client.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      app.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "Under Review":
        return <Eye className="h-4 w-4 text-chart-4" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: Application["status"]) => {
    switch (status) {
      case "Approved":
        return "secondary";
      case "Rejected":
        return "destructive";
      case "Under Review":
        return "outline";
      default:
        return "default";
    }
  };

  const getRiskVariant = (risk: Application["risk"]) => {
    switch (risk) {
      case "Low":
        return "secondary";
      case "Medium":
        return "outline";
      case "High":
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Loan Applications
        </h1>
        <p className="text-muted-foreground">
          Review and process loan applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Pending</p>
            <p className="text-2xl font-bold text-foreground">
              {applications.filter((a) => a.status === "Pending").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="text-2xl font-bold text-chart-4">
              {applications.filter((a) => a.status === "Under Review").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-secondary">
              {applications.filter((a) => a.status === "Approved").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <p className="text-2xl font-bold text-destructive">
              {applications.filter((a) => a.status === "Rejected").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client name or application ID..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.client}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getRiskVariant(app.risk)}>
                            {app.risk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            <Badge variant={getStatusVariant(app.status)}>
                              {app.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(app.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApp(app)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Application Review - {app.id}
                                </DialogTitle>
                                <DialogDescription>
                                  Review application details and make a decision
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-6 py-4">
                                {/* Client Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Client Name
                                    </Label>
                                    <p className="font-medium">{app.client}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Email
                                    </Label>
                                    <p className="font-medium">{app.email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Phone
                                    </Label>
                                    <p className="font-medium">{app.phone}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Credit Score
                                    </Label>
                                    <p className="font-medium">{app.creditScore}</p>
                                  </div>
                                </div>

                                {/* Loan Details */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Loan Type
                                    </Label>
                                    <p className="font-medium">{app.type}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Amount Requested
                                    </Label>
                                    <p className="font-medium">{app.amount}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Employment Status
                                    </Label>
                                    <p className="font-medium">
                                      {app.employmentStatus}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Monthly Income
                                    </Label>
                                    <p className="font-medium">{app.monthlyIncome}</p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-muted-foreground">
                                    Purpose
                                  </Label>
                                  <p className="font-medium">{app.purpose}</p>
                                </div>

                                <div className="flex gap-4">
                                  <Badge variant={getRiskVariant(app.risk)}>
                                    {app.risk} Risk
                                  </Badge>
                                  <Badge variant={getStatusVariant(app.status)}>
                                    {app.status}
                                  </Badge>
                                </div>

                                {(app.status === "Pending" ||
                                  app.status === "Under Review") && (
                                    <div className="space-y-2">
                                      <Label htmlFor="notes">Review Notes</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Add notes about your decision..."
                                        value={reviewNotes}
                                        onChange={(e) =>
                                          setReviewNotes(e.target.value)
                                        }
                                      />
                                    </div>
                                  )}
                              </div>

                              {(app.status === "Pending" ||
                                app.status === "Under Review") && (
                                  <DialogFooter className="gap-2">
                                    <Button variant="outline" onClick={() => handleUpdateStatus(app.id, "Under Review")}>
                                      Request More Info
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleUpdateStatus(app.id, "Rejected")}>Reject</Button>
                                    <Button onClick={() => handleUpdateStatus(app.id, "Approved")}>Approve</Button>
                                  </DialogFooter>
                                )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found matching your criteria.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
