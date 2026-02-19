"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function StartupLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        transition: { duration: 0.6, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fdf5f5]"
                >
                    {/* Soft background glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(244,164,164,0.35) 0%, rgba(244,164,164,0.15) 50%, transparent 70%)",
                            }}
                        />
                    </div>

                    {/* Rotating outer ring */}
                    <div className="absolute flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: 360, opacity: 0.3 }}
                            transition={{
                                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                opacity: { duration: 1 }
                            }}
                            className="w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-rose-300/40"
                        />
                    </div>

                    {/* Logo Card */}
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.2,
                        }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Card */}
                        <motion.div
                            animate={{
                                y: [0, -6, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-3xl shadow-xl shadow-rose-200/40 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Affordable Microcredit Limited"
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Brand name below card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="mt-8 text-center"
                        >
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                                Affordable Microcredit
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="text-xs sm:text-sm text-gray-400 mt-1 font-medium"
                            >
                                Improving Lives Through Affordable Credit
                            </motion.p>
                        </motion.div>

                        {/* Minimal loading dots */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="flex gap-1.5 mt-8"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.4, 1],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut",
                                    }}
                                    className="w-2 h-2 rounded-full bg-rose-400"
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
