"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Trash2,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Download,
  Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { getClients, addClient, deleteClient } from "@/lib/actions/client-actions";

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

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
      setLoading(false);
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleViewClient = (client: (typeof clients)[0]) => {
    Swal.fire({
      title: `<strong>${client.name}</strong>`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><strong>Client ID:</strong> ${client.id}</p>
          <p><strong>Email:</strong> ${client.email}</p>
          <p><strong>Phone:</strong> ${client.phone}</p>
          <p><strong>Account Type:</strong> ${client.type}</p>
          <p><strong>Registered:</strong> ${client.registeredDate}</p>
          <hr style="margin: 10px 0;">
          <p><strong>Total Loans:</strong> ${client.totalLoans}</p>
          <p><strong>Active Loans:</strong> ${client.activeLoans}</p>
          <p><strong>Total Borrowed:</strong> TZS ${client.totalBorrowed.toLocaleString()}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#e07a5f",
    });
  };

  const handleAddClient = () => {
    Swal.fire({
      title: "Add New Client",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Full Name">
        <input id="swal-email" class="swal2-input" placeholder="Email Address">
        <input id="swal-phone" class="swal2-input" placeholder="Phone Number">
        <select id="swal-type" class="swal2-select">
          <option value="">Select Account Type</option>
          <option value="Individual">Individual</option>
          <option value="SME">SME</option>
          <option value="Group">Group</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#e07a5f",
      confirmButtonText: "Add Client",
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          ?.value;
        const email = (document.getElementById("swal-email") as HTMLInputElement)
          ?.value;
        const phone = (document.getElementById("swal-phone") as HTMLInputElement)
          ?.value;
        const type = (document.getElementById("swal-type") as HTMLSelectElement)
          ?.value;
        if (!name || !email || !phone || !type) {
          Swal.showValidationMessage("Please fill in all fields");
        }
        return { name, email, phone, type };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await addClient(result.value);
        if (response.success) {
          setClients([response.client, ...clients]);
          Swal.fire({
            title: "Client Added!",
            text: `${result.value?.name} has been added successfully`,
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        } else {
          Swal.fire("Error", "Failed to add client", "error");
        }
      }
    });
  };

  const handleDeleteClient = (client: any) => {
    Swal.fire({
      title: "Delete Client?",
      text: `Are you sure you want to delete ${client.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteClient(client.id);
        if (response.success) {
          setClients(clients.filter((c) => c.id !== client.id));
          Swal.fire({
            title: "Deleted!",
            text: `${client.name} has been deleted.`,
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        } else {
          Swal.fire("Error", "Failed to delete client", "error");
        }
      }
    });
  };

  const handleContactClient = (client: (typeof clients)[0]) => {
    Swal.fire({
      title: `Contact ${client.name}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Choose contact method:</strong></p>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Send Email",
      denyButtonText: "Send SMS",
      confirmButtonColor: "#e07a5f",
      denyButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Email Sent!",
          text: `Email has been sent to ${client.email}`,
          icon: "success",
          confirmButtonColor: "#e07a5f",
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: "SMS Sent!",
          text: `SMS has been sent to ${client.phone}`,
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
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "defaulter":
        return <Badge variant="destructive">Defaulter</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Individual":
        return <Badge variant="outline">Individual</Badge>;
      case "SME":
        return (
          <Badge className="bg-secondary text-secondary-foreground">SME</Badge>
        );
      case "Group":
        return (
          <Badge className="bg-primary text-primary-foreground">Group</Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const stats = [
    {
      title: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Clients",
      value: clients.filter((c) => c.status === "active").length,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      title: "Defaulters",
      value: clients.filter((c) => c.status === "defaulter").length,
      icon: UserX,
      color: "text-destructive",
    },
    {
      title: "New This Month",
      value: 2,
      icon: UserPlus,
      color: "text-secondary",
    },
  ];

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
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client database and relationships
          </p>
        </div>
        <Button onClick={handleAddClient} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Client
        </Button>
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

      {/* Client Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
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
                      {filterType || "All Types"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterType(null)}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterType("Individual")}
                    >
                      Individual
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("SME")}>
                      SME
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("Group")}>
                      Group
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
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Loans</TableHead>
                      <TableHead className="text-right">Total Borrowed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredClients.map((client, index) => (
                        <motion.tr
                          key={client.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {client.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {client.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate max-w-[150px]">
                                  {client.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(client.type)}</TableCell>
                          <TableCell className="text-center">
                            <div>
                              <p className="font-medium">{client.activeLoans}</p>
                              <p className="text-xs text-muted-foreground">
                                of {client.totalLoans}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            TZS {client.totalBorrowed.toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(client.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewClient(client)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleContactClient(client)}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Contact
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClient(client)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
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
