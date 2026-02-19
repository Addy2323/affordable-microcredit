"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanApplicationSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  CreditCard,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import { submitApplication } from "@/lib/actions/user-dashboard-actions";

type LoanApplicationValues = z.infer<typeof loanApplicationSchema>;

const steps = [
  { id: 1, name: "Loan Type", icon: CreditCard },
  { id: 2, name: "Personal Info", icon: User },
  { id: 3, name: "Financial Details", icon: FileText },
  { id: 4, name: "Review & Submit", icon: CheckCircle },
];

const loanProducts = [
  {
    id: "personal",
    name: "Personal Loan",
    description: "For personal needs and emergencies",
    rate: "16% p.a.",
    maxAmount: "TZS 2,000,000",
    tenure: "6-24 months",
  },
  {
    id: "business",
    name: "Business Loan",
    description: "Working capital for your business",
    rate: "18% p.a.",
    maxAmount: "TZS 10,000,000",
    tenure: "12-36 months",
  },
  {
    id: "emergency",
    name: "Emergency Loan",
    description: "Fast approval for urgent needs",
    rate: "15% p.a.",
    maxAmount: "TZS 500,000",
    tenure: "3-6 months",
  },
  {
    id: "sme",
    name: "SME Loan",
    description: "Grow and expand your SME business",
    rate: "17% p.a.",
    maxAmount: "TZS 20,000,000",
    tenure: "12-48 months",
  },
];

export default function LoanApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<LoanApplicationValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanType: "",
      amount: "",
      tenure: "",
      purpose: "",
      fullName: "",
      dateOfBirth: "",
      nationalId: "",
      address: "",
      city: "",
      employmentStatus: "",
      employerName: "",
      monthlyIncome: "",
      existingLoans: "",
      bankName: "",
      accountNumber: "",
      termsAccepted: false,
      creditCheckConsent: false,
    },
  });

  const formData = watch();

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof LoanApplicationValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ["loanType", "amount", "tenure", "purpose"];
    } else if (step === 2) {
      fieldsToValidate = ["fullName", "dateOfBirth", "nationalId", "address", "city"];
    } else if (step === 3) {
      fieldsToValidate = ["employmentStatus", "monthlyIncome", "bankName", "accountNumber"];
    } else if (step === 4) {
      fieldsToValidate = ["termsAccepted", "creditCheckConsent"];
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: LoanApplicationValues) => {
    setIsSubmitting(true);
    try {
      const response = await submitApplication(data);
      if (response.success) {
        setSubmitted(true);
      } else {
        alert(response.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLoan = loanProducts.find((l) => l.id === formData.loanType);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Application Submitted!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your loan application has been submitted successfully. We will
              review your application and get back to you within 24-48 hours.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Application Reference: <span className="font-mono font-bold">APP-2024-090</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push("/dashboard/loans")}>
                View My Loans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Apply for a Loan
        </h1>
        <p className="text-muted-foreground">
          Complete the form below to submit your loan application
        </p>
      </div>

      {/* Progress steps */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                    }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 lg:w-24 h-0.5 mx-2 ${currentStep > step.id ? "bg-primary" : "bg-border"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((step) => (
              <span
                key={step.id}
                className={currentStep >= step.id ? "text-primary font-medium" : ""}
              >
                {step.name}
              </span>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="mt-4 h-2" />
        </CardContent>
      </Card>

      {/* Form steps */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Loan Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Select Loan Type
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the type of loan that best suits your needs
                  </p>
                </div>

                <RadioGroup
                  value={formData.loanType}
                  onValueChange={(value) => setValue("loanType", value)}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {loanProducts.map((loan) => (
                    <div key={loan.id}>
                      <RadioGroupItem
                        value={loan.id}
                        id={loan.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={loan.id}
                        className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50 ${errors.loanType ? "border-destructive/50" : ""}`}
                      >
                        <span className="font-semibold text-foreground">
                          {loan.name}
                        </span>
                        <span className="text-sm text-muted-foreground mt-1">
                          {loan.description}
                        </span>
                        <div className="flex gap-4 mt-3 text-xs">
                          <span className="text-primary">{loan.rate}</span>
                          <span className="text-muted-foreground">
                            Up to {loan.maxAmount}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.loanType && <p className="text-xs text-destructive">{errors.loanType.message}</p>}

                {selectedLoan && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Loan Amount (TZS)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="e.g., 1000000"
                          {...register("amount")}
                          className={errors.amount ? "border-destructive" : ""}
                        />
                        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
                        <p className="text-xs text-muted-foreground">
                          Maximum: {selectedLoan.maxAmount}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tenure">Repayment Period</Label>
                        <Select
                          value={formData.tenure}
                          onValueChange={(value) => setValue("tenure", value)}
                        >
                          <SelectTrigger className={errors.tenure ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                            <SelectItem value="18">18 months</SelectItem>
                            <SelectItem value="24">24 months</SelectItem>
                            <SelectItem value="36">36 months</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.tenure && <p className="text-xs text-destructive">{errors.tenure.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose of Loan</Label>
                      <Textarea
                        id="purpose"
                        placeholder="Describe why you need this loan..."
                        {...register("purpose")}
                        rows={3}
                        className={errors.purpose ? "border-destructive" : ""}
                      />
                      {errors.purpose && <p className="text-xs text-destructive">{errors.purpose.message}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Personal Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please provide your personal details
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Full Name (as per ID)</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      {...register("fullName")}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className={errors.dateOfBirth ? "border-destructive" : ""}
                    />
                    {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">National ID Number</Label>
                    <Input
                      id="nationalId"
                      placeholder="19XXXXXXXXXX"
                      {...register("nationalId")}
                      className={errors.nationalId ? "border-destructive" : ""}
                    />
                    {errors.nationalId && <p className="text-xs text-destructive">{errors.nationalId.message}</p>}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Residential Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      {...register("address")}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / District</Label>
                    <Input
                      id="city"
                      placeholder="Dar es Salaam"
                      {...register("city")}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Financial Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Financial Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Help us understand your financial situation
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => setValue("employmentStatus", value)}
                    >
                      <SelectTrigger className={errors.employmentStatus ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="business-owner">Business Owner</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employmentStatus && <p className="text-xs text-destructive">{errors.employmentStatus.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employerName">Employer / Business Name</Label>
                    <Input
                      id="employerName"
                      placeholder="Company name"
                      {...register("employerName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (TZS)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="e.g., 500000"
                      {...register("monthlyIncome")}
                      className={errors.monthlyIncome ? "border-destructive" : ""}
                    />
                    {errors.monthlyIncome && <p className="text-xs text-destructive">{errors.monthlyIncome.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="existingLoans">Existing Loan Obligations (TZS)</Label>
                    <Input
                      id="existingLoans"
                      type="number"
                      placeholder="0"
                      {...register("existingLoans")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select
                      value={formData.bankName}
                      onValueChange={(value) => setValue("bankName", value)}
                    >
                      <SelectTrigger className={errors.bankName ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crdb">CRDB Bank</SelectItem>
                        <SelectItem value="nmb">NMB Bank</SelectItem>
                        <SelectItem value="nbc">NBC Bank</SelectItem>
                        <SelectItem value="stanbic">Stanbic Bank</SelectItem>
                        <SelectItem value="equity">Equity Bank</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.bankName && <p className="text-xs text-destructive">{errors.bankName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Bank Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="XXXXXXXXXXXX"
                      {...register("accountNumber")}
                      className={errors.accountNumber ? "border-destructive" : ""}
                    />
                    {errors.accountNumber && <p className="text-xs text-destructive">{errors.accountNumber.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Review Your Application
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please review your information before submitting
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-3">
                      Loan Details
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Loan Type:</span>{" "}
                        <span className="font-medium">
                          {selectedLoan?.name || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>{" "}
                        <span className="font-medium">
                          TZS {Number(formData.amount).toLocaleString() || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tenure:</span>{" "}
                        <span className="font-medium">
                          {formData.tenure} months
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Interest:</span>{" "}
                        <span className="font-medium">
                          {selectedLoan?.rate || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-3">
                      Personal Information
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-medium">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">National ID:</span>{" "}
                        <span className="font-medium">{formData.nationalId}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">Address:</span>{" "}
                        <span className="font-medium">
                          {formData.address}, {formData.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-3">
                      Financial Information
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Employment:</span>{" "}
                        <span className="font-medium capitalize">
                          {formData.employmentStatus?.replace("-", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Income:</span>{" "}
                        <span className="font-medium">
                          TZS {Number(formData.monthlyIncome).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) =>
                        setValue("termsAccepted", checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        I agree to the Terms and Conditions and understand that this
                        application does not guarantee loan approval.
                      </label>
                      {errors.termsAccepted && <p className="text-xs text-destructive">{errors.termsAccepted.message}</p>}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="creditCheck"
                      checked={formData.creditCheckConsent}
                      onCheckedChange={(checked) =>
                        setValue("creditCheckConsent", checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="creditCheck"
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        I consent to Affordable Microcredit Limited conducting a
                        credit check and verifying my information.
                      </label>
                      {errors.creditCheckConsent && <p className="text-xs text-destructive">{errors.creditCheckConsent.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
