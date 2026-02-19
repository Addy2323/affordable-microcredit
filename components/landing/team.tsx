"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function Team() {
  const team = [
    {
      name: "",
      role: "Managing Director",
      image: "/images/manage director.jpg.jpeg",
    },
    {
      name: "",
      role: "Finance Directors",
      image: "/images/team1.jpg.jpeg",
    },
    {
      name: "",
      role: "Branch Manager",
      image: "/images/Branch manager.jpg.jpeg",
    },
    {
      name: "",
      role: "Client Relations",
      image: "/images/customer service.jpg.jpeg",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const getCardVariants = (index: number) => {
    const directions = [
      { x: -120, y: 20 },  // Left card: slides from left
      { x: 0, y: 60 },     // Center card: rises from below
      { x: 120, y: 20 },   // Right card: slides from right
    ];
    const dir = directions[index] || directions[1];
    return {
      hidden: { opacity: 0, x: dir.x, y: dir.y, scale: 0.9 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          type: "spring" as const,
          stiffness: 60,
          damping: 15,
          duration: 0.7,
        },
      },
    };
  };

  return (
    <section id="team" className="py-12 sm:py-20 lg:py-32 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <span className="text-xs sm:text-sm font-semibold text-secondary uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-3 sm:mb-4 text-balance">
            Meet Our Leadership
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Our experienced team is committed to providing excellent service and
            supporting your financial growth.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
        >
          {team.map((member, index) => (
            <motion.div key={member.role} variants={getCardVariants(index)}>
              <Card className="group overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-[4/5] overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <CardContent className="p-4 sm:p-6 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {member.role}
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
