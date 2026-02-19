"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function VideoSection() {
    return (
        <section className="py-12 sm:py-20 lg:py-32 bg-background overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
                >
                    <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                        About Affordable
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4 text-balance">
                        Empowering Your Future in Under 2 Minutes
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        Watch how Affordable Microcredit is transforming lives across Tanzania
                        through accessible financial solutions and dedicated support.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-primary/10 group"
                >
                    {/* Glassmorphism Overlay (Visible on hover or initially) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <video
                        className="w-full h-auto object-cover aspect-video"
                        autoPlay
                        loop
                        playsInline
                        controls
                        poster="/images/Micro_69-1-1.jpg.jpeg"
                        src="/images/video.mp4"
                    >
                        <source src="/images/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Floating Play Button Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
                        >
                            <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-current" />
                        </motion.div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-semibold text-lg">Affordable Microcredit</h4>
                                <p className="text-white/70 text-sm">Official Introduction Video</p>
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-xs font-medium">
                                Full HD
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
