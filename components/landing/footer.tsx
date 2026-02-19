"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

export function Footer() {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Our Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    { name: "Group Loans", href: "#services" },
    { name: "Individual Loans", href: "#services" },
    { name: "Asset Loans", href: "#services" },
    { name: "Education Loans", href: "#services" },
    { name: "Emergency Loans", href: "#services" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Loan Agreement", href: "/loan-agreement" },
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer id="contact" className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Affordable Microcredit Limited"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <div className="ml-2">
                <span className="text-base sm:text-lg font-bold text-primary">Affordable</span>
                <span className="block text-[10px] sm:text-xs text-secondary font-medium -mt-1">
                  Microcredit Limited
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-background/70 leading-relaxed">
              Improving lives through affordable credit. Licensed by the Bank of
              Tanzania under the Microfinance Act, 2018.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.div key={index} whileHover={{ scale: 1.1, y: -2 }}>
                  <Link
                    href="#"
                    className="p-2 bg-background/10 rounded-lg hover:bg-background/20 transition-colors inline-block"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-background mb-4 sm:mb-6 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-background mb-4 sm:mb-6 text-sm sm:text-base">Our Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-xs sm:text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-background mb-4 sm:mb-6 text-sm sm:text-base">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-background/70">
                  1st Floor, Mrosso building, Uhuru Road, Ngaka Street, P.O. Box 1633, Morogoro, Tanzania
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-background/70">
                  0713911336
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-background/70 break-all">
                  info@affordablemicrocredit.co.tz
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-background/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs sm:text-sm text-background/60 text-center md:text-left">
            {new Date().getFullYear()} Affordable Microcredit Limited. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs sm:text-sm text-background/60 hover:text-background transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
