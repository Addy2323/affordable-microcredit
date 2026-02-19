"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ImageGallery() {
    const images = [
        { src: "/images/Micro_35-1-1.jpg.jpeg", alt: "Office Activity" },
        { src: "/images/Micro_37-1-1.jpg.jpeg", alt: "Team Meeting" },
        { src: "/images/Micro_60-1-1.jpg.jpeg", alt: "Customer Interaction" },
        { src: "/images/Micro_69-1-1.jpg.jpeg", alt: "Modern Office" },
        { src: "/images/team1.jpg.jpeg", alt: "Our Team" },
        { src: "/images/team2.jpg.jpeg", alt: "Operations" },
    ];

    // Duplicate images for infinite scroll effect
    const marqueeImages = [...images, ...images];

    return (
        <section className="py-12 sm:py-20 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 mb-8 sm:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                >
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-lg sm:text-xl font-bold text-muted-foreground uppercase tracking-widest text-center">
                        Our Environment & Culture
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                </motion.div>
            </div>

            <div className="relative flex overflow-hidden group">
                <div
                    className="flex w-max animate-scroll hover:[animation-play-state:paused]"
                >
                    {marqueeImages.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 px-2 sm:px-4"
                            style={{ width: "300px", height: "200px" }}
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border/50 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gradient Fades for Smooth Edges */}
                <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
}
