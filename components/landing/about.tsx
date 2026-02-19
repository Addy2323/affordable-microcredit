"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  Building2,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

export function About() {
  const coreValues = [
    "Integrity",
    "Transparency",
    "Customer Commitment",
    "Accountability",
    "Professionalism",
  ];

  const branches = [
    { name: "Morogoro Mjini HQ", detail: "Head Office" },
    { name: "Dumila", detail: "Branch" },
    { name: "Dodoma", detail: "Branch" },
  ];

  return (
    <section id="about" className="py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main About Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Image + Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/team2.jpg.jpeg"
                alt="Affordable Microcredit team"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Head Office Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border"
            >
              <h3 className="font-semibold text-foreground mb-4 text-base sm:text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Head Office
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    1st Floor, Mrosso building<br />
                    Uhuru Road, Ngaka Street<br />
                    P.O. Box 1633<br />
                    Morogoro, Tanzania
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    0713911336
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    WhatsApp: 0713911336
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Branch Locations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border"
            >
              <h3 className="font-semibold text-foreground mb-4 text-base sm:text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Branch Locations
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {branches.map((branch) => (
                  <motion.div
                    key={branch.name}
                    whileHover={{ scale: 1.03 }}
                    className="text-center p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <p className="text-sm sm:text-base font-semibold text-foreground">
                      {branch.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {branch.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - About Text + Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8 lg:pl-8"
          >
            {/* Section Header */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-xs sm:text-sm font-semibold text-secondary uppercase tracking-wider"
              >
                About Us
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-3 sm:mb-4 text-balance"
              >
                Improving Lives Through Affordable Credits
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                Affordable Microcredit Limited was established with a strong commitment
                to financial empowerment and inclusion. We are a legally registered
                microfinance company operating under the laws of the United Republic of Tanzania,
                registered in accordance with Section 21 of the Microfinance Act, 2018
                (Registration number FD 349/377/02/321), licensed by the Bank of Tanzania.
              </motion.p>
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Our Vision
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  To become a leading and trusted microfinance institution that
                  transforms lives through accessible and affordable financial solutions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-4 sm:p-5 rounded-xl bg-secondary/5 border border-secondary/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Our Mission
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  To provide reliable, affordable, and customer-focused financial services
                  that empower individuals and small businesses to grow and improve
                  their quality of life.
                </p>
              </motion.div>
            </div>

            {/* Core Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="p-4 sm:p-5 rounded-xl bg-card border border-border shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Our Core Values
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {coreValues.map((value, index) => (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {value}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Leadership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                  Our Leadership
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Led by dedicated shareholders and directors,{" "}
                  <strong>Mr. Jovin Jeremiah</strong> and{" "}
                  <strong>Ms. Happy Nyabukika Ambao</strong>, who bring vision,
                  leadership, and commitment to the organization&apos;s growth and impact.
                </p>
              </div>
            </motion.div>

            {/* Licensed badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                  Licensed &amp; Regulated
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Established 2nd August 2021. Registered under the Microfinance Act, 2018.
                  Registration No. FD 349/377/02/321 — Licensed by the Bank of Tanzania (BoT).
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
