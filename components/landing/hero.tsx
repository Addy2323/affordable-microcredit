"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroProps {
  isLoggedIn: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
  const benefits = [
    "Quick loan approval",
    "Competitive interest rates",
    "Flexible repayment plans",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/10 rounded-full"
            >
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-secondary">
                Trusted by 10,000+ SMEs
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight text-balance"
            >
              Improving Lives Through{" "}
              <span className="text-primary">Affordable Credit</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed"
            >
              Empowering SMEs and individuals with accessible microfinance
              solutions. Apply for loans online, track your applications, and
              manage repayments seamlessly.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button size="lg" asChild className="text-sm sm:text-base w-full sm:w-auto">
                <Link href={isLoggedIn ? "/dashboard/apply" : "/register"}>
                  {isLoggedIn ? "Apply for a Loan" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-sm sm:text-base bg-transparent w-full sm:w-auto">
                <Link href="#services">Learn More</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
              <Image
                src="/images/team1.jpg.jpeg"
                alt="Affordable Microcredit team members"
                width={600}
                height={380}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border max-w-[160px] sm:max-w-[200px]"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Customer Satisfaction Rate
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
