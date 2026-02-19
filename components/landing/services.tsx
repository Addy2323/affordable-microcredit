"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCircle,
  Home,
  GraduationCap,
  AlertTriangle,
  HeadphonesIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Services() {
  const services = [
    {
      icon: Users,
      title: "Group Loans",
      description:
        "Access affordable credit through group lending. Members support each other while building a strong savings and repayment culture.",
    },
    {
      icon: UserCircle,
      title: "Individual Loans",
      description:
        "Tailored personal loan products designed to meet your unique financial needs with flexible repayment terms.",
    },
    {
      icon: Home,
      title: "Asset Loans",
      description:
        "Finance the purchase of assets for personal or business use. Acquire equipment, vehicles, or property with manageable installments.",
    },
    {
      icon: GraduationCap,
      title: "Education Loans",
      description:
        "Invest in your future or your children's education. We provide affordable financing for school fees, training, and academic needs.",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Loans",
      description:
        "Fast-tracked loans for both emergency and non-emergency needs. Get approved quickly with minimal documentation when you need it most.",
    },
    {
      icon: HeadphonesIcon,
      title: "Financial Consultation",
      description:
        "Get expert guidance on financial planning, budgeting, and growing your business sustainably. Our advisors are here to help.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="services" className="py-12 sm:py-20 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
            Our Services &amp; Loan Products
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We focus on providing loan products and financial consultation services,
            especially tailored to Small and Medium Enterprises (SMEs). Our goal is to
            enhance easy access to credit, support business growth, and improve the
            overall quality of our clients&apos; lives.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 h-full hover:-translate-y-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors"
                  >
                    <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </motion.div>
                  <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
