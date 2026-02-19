"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  User,
  Bell,
  Shield,
  Percent,
  CreditCard,
  Save,
  RefreshCw,
} from "lucide-react";

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

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Affordable Microcredit Limited",
    companyEmail: "info@affordablemicrocredit.com",
    companyPhone: "+233 30 123 4567",
    companyAddress: "123 Business Street, Accra, Ghana",
    defaultInterestRate: "15",
    maxLoanAmount: "100000",
    minLoanAmount: "500",
    loanProcessingFee: "2",
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    overdueAlerts: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  const handleSaveSettings = (section: string) => {
    Swal.fire({
      title: "Save Changes?",
      text: `Do you want to save changes to ${section} settings?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e07a5f",
      confirmButtonText: "Save Changes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Saving...",
          text: "Please wait while we save your settings",
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.fire({
            title: "Saved!",
            text: `${section} settings have been updated successfully.`,
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        });
      }
    });
  };

  const handleResetSettings = (section: string) => {
    Swal.fire({
      title: "Reset Settings?",
      text: `This will reset all ${section} settings to their default values. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Reset",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Reset Complete!",
          text: `${section} settings have been reset to defaults.`,
          icon: "success",
          confirmButtonColor: "#e07a5f",
        });
      }
    });
  };

  const handleTestNotification = () => {
    Swal.fire({
      title: "Send Test Notification?",
      text: "This will send a test notification to verify your settings.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e07a5f",
      confirmButtonText: "Send Test",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sending...",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          Swal.fire({
            title: "Test Sent!",
            text: "Test notification has been sent successfully.",
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        });
      }
    });
  };

  const handleBackup = () => {
    Swal.fire({
      title: "Backup Database?",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p>This will create a full backup of:</p>
          <ul style="margin-top: 10px;">
            <li>Client records</li>
            <li>Loan data</li>
            <li>Transaction history</li>
            <li>System settings</li>
          </ul>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#e07a5f",
      confirmButtonText: "Start Backup",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Backing Up...",
          html: "Creating backup... <b></b>",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup()?.querySelector("b");
            if (timer) {
              let progress = 0;
              const interval = setInterval(() => {
                progress += 10;
                timer.textContent = `${progress}%`;
                if (progress >= 100) clearInterval(interval);
              }, 280);
            }
          },
        }).then(() => {
          Swal.fire({
            title: "Backup Complete!",
            text: "Database backup has been created successfully.",
            icon: "success",
            confirmButtonColor: "#e07a5f",
          });
        });
      }
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your system configuration and preferences
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="loan" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Loan Settings</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.companyName}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Company Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={settings.companyEmail}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            companyEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Phone Number</Label>
                      <Input
                        id="companyPhone"
                        value={settings.companyPhone}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            companyPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Address</Label>
                      <Input
                        id="companyAddress"
                        value={settings.companyAddress}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            companyAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleResetSettings("Company")}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                    <Button onClick={() => handleSaveSettings("Company")}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Loan Settings */}
          <TabsContent value="loan">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    Loan Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">
                        Default Interest Rate (%)
                      </Label>
                      <Input
                        id="interestRate"
                        type="number"
                        value={settings.defaultInterestRate}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultInterestRate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="processingFee">Processing Fee (%)</Label>
                      <Input
                        id="processingFee"
                        type="number"
                        value={settings.loanProcessingFee}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            loanProcessingFee: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minLoan">Minimum Loan Amount (GHS)</Label>
                      <Input
                        id="minLoan"
                        type="number"
                        value={settings.minLoanAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            minLoanAmount: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoan">Maximum Loan Amount (GHS)</Label>
                      <Input
                        id="maxLoan"
                        type="number"
                        value={settings.maxLoanAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maxLoanAmount: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleResetSettings("Loan")}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Default
                    </Button>
                    <Button onClick={() => handleSaveSettings("Loan")}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, smsNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Payment Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Send automatic payment reminders to clients
                        </p>
                      </div>
                      <Switch
                        checked={settings.paymentReminders}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, paymentReminders: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Overdue Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when loans become overdue
                        </p>
                      </div>
                      <Switch
                        checked={settings.overdueAlerts}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, overdueAlerts: checked })
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleTestNotification}>
                      Send Test Notification
                    </Button>
                    <Button onClick={() => handleSaveSettings("Notification")}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          setSettings({ ...settings, twoFactorAuth: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Select
                        value={settings.sessionTimeout}
                        onValueChange={(value) =>
                          setSettings({ ...settings, sessionTimeout: value })
                        }
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBackup}>
                      Backup Database
                    </Button>
                    <Button onClick={() => handleSaveSettings("Security")}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      Swal.fire({
                        title: "Update Password?",
                        text: "Are you sure you want to change your password?",
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#e07a5f",
                        confirmButtonText: "Update Password",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire({
                            title: "Password Updated!",
                            text: "Your password has been changed successfully.",
                            icon: "success",
                            confirmButtonColor: "#e07a5f",
                          });
                        }
                      });
                    }}
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
