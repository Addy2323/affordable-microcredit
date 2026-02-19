"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

interface CTAProps {
  isLoggedIn: boolean;
}

export function CTA({ isLoggedIn }: CTAProps) {
  return (
    <section className="py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-primary rounded-2xl sm:rounded-3xl overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-foreground rounded-full -translate-y-1/2 translate-x-1/2"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-foreground rounded-full translate-y-1/2 -translate-x-1/2"
            />
          </div>

          <div className="relative px-6 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4 text-balance"
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            >
              Join thousands of satisfied customers who have grown their
              businesses with our affordable credit solutions. Apply today and
              get a decision within 24 hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-sm sm:text-base w-full sm:w-auto"
              >
                <Link href={isLoggedIn ? "/dashboard/apply" : "/register"}>
                  {isLoggedIn ? "Apply for a Loan" : "Apply Now"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-sm sm:text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent w-full sm:w-auto"
              >
                <Link href="tel:+255123456789">
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
