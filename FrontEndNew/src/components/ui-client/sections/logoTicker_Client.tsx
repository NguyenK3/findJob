"use client"

import acmeLogo from "@/assets/acme.png";
import quantumLogo from "@/assets/quantum.png";
import echoLogo from "@/assets/echo.png";
import celestialLogo from "@/assets/celestial.png";
import pulseLogo from "@/assets/pulse.png";
import apexLogo from "@/assets/apex.png";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
    { src: acmeLogo, alt: "Acme Logo" },
    { src: quantumLogo, alt: "Quantum Logo" },
    { src: echoLogo, alt: "Echo Logo" },
    { src: celestialLogo, alt: "Celestial Logo" },
    { src: pulseLogo, alt: "Pulse Logo" },
    { src: apexLogo, alt: "Apex Logo" },
];

const LogoTicker_Client = () => {
    return (
        <div className="bg-black text-white">
            <div className="max-w-full">
                {/* Phần Gradient cho h2 */}
                <div className="bg-gradient-to-tr from-sky-200 via-red-100 to-neutral-100 flex items-center justify-center">
                    <motion.h2
                        className="text-base sm:text-sm md:text-md lg:text-lg xl:text-xl font-semibold text-center bg-clip-text text-transparent py-4"
                        animate={{
                            backgroundImage: [
                                "linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)",
                                "linear-gradient(90deg, #8b00ff, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)"
                            ], // Chuyển đổi màu gradient
                        }}
                        transition={{
                            duration: 3, // Thời gian hoàn thành một chu kỳ (5 giây)
                            repeat: Infinity, // Lặp vô hạn
                            ease: "linear", // Hiệu ứng tuyến tính
                        }}
                    >
                        Trusted by the world's most innovative teams
                    </motion.h2>
                </div>
                {/* Phần Gradient cho các logo */}
                <div className="overflow-hidden relative bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-200 backdrop-blur-md backdrop-brightness-50">
                    <div className="container mx-auto">
                        <motion.div
                            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                            animate={{ x: ["0%", "-100%", "0%"] }}
                            className="flex gap-16 p-6 flex-none"
                            style={{ width: '200%', background: 'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))' }} // Gradient background
                        >
                            <div className="flex gap-16">
                                {images.concat(images).map(({ src, alt }, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={alt}
                                        className="flex-none h-8 w-auto"
                                    />
                                ))}
                                {images.concat(images).map(({ src, alt }, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={alt}
                                        className="flex-none h-8 w-auto"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoTicker_Client;
