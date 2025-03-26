"use client";

import Image from "next/image";
import Logo from "@/assets/logo.webp";
import { TypeAnimation } from "react-type-animation";
import { BadgeCheck } from "lucide-react";
import Horse from "@/assets/horse.png";
import Cliff from "@/assets/cliff.webp";
import TreeGround from "@/assets/trees.webp";
import StarsSky from "@/assets/stars.png";

const Hero_Client = () => {
    return (
        <div className="relative w-full">
            <div className="mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-12 relative">
                    <div className="col-span-12 sm:col-span-7 place-self-center text-center sm:text-left px-4 sm:px-6 lg:px-8">
                        <h1
                            className="text-white mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold"
                            data-aos="fade-right"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-purple-400 via-rose-400 to-blue-600">
                                Hello, I'm{" "}
                            </span>
                            <br />
                            <TypeAnimation
                                className="text-transparent bg-clip-text bg-gradient-to-bl from-pink-400 via-purple-500 to-yellow-500"
                                sequence={[
                                    "Kaba",
                                    1000,
                                    "Web Developer",
                                    1000,
                                    "Mobile Developer",
                                    1000,
                                    "UI/UX Designer",
                                    1000,
                                ]}
                                wrapper="span"
                                speed={20}
                                repeat={Infinity}
                            />
                        </h1>
                        <ul
                            className="text-white sm:text-sm md:text-xl space-y-2 relative z-[30]"
                            data-aos="zoom-in-right"
                        >
                            <li className="flex gap-3 items-center">
                                <BadgeCheck color="#ffffff" />
                                <span>
                                    Discover opportunities – Elevate your
                                    career!
                                </span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <BadgeCheck color="#ffffff" />
                                <span>
                                    The right job, the foundation for a brighter
                                    future!
                                </span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <BadgeCheck color="#ffffff" />
                                <span>
                                    Find jobs fast, success within reach!
                                </span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <BadgeCheck color="#ffffff" />
                                <span>
                                    Build your dream career, starting today!
                                </span>
                            </li>
                        </ul>
                        <div
                            className="relative z-[30] mt-4 sm:mt-6 lg:mt-8"
                            data-aos="fade-up"
                            data-aos-anchor-placement="top-bottom"
                        >
                            <button className="px-6 py-3 rounded-full md:text-medium md:px-5 md:py-2 md:min-w-10 sm:text-sm sm:px-4 sm:py-2 sm:min-w-8 md:w-fit mr-4 bg-gradient-to-bl from-pink-500 via-sky-400 to-blue-500 hover:bg-slate-200 text-white">
                                Apply Now
                            </button>
                            <button className="px-1 py-1 rounded-full md:text-medium md:min-w-10 md:px-1.5 md:py-1.5 sm:text-sm sm:px-1 sm:py-1 sm:w-fit bg-transparent hover:bg-slate-800 text-white border bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 border-white mt-3 sm:mt-0">
                                <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2 sm:px-2 sm:py-1">
                                    Get Started
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="col-span-5 mt-4 lg:mt-0">
                        <div className="relative bottom-0 right-0 z-[10] flex justify-end">
                            <div className="relative">
                                <Image
                                    src={Cliff}
                                    alt="cliff"
                                    height={480}
                                    width={480}
                                    className="relative z-[10] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                                />
                                <div className="absolute inset-3 flex justify-center items-start">
                                    <Image
                                        src={Horse}
                                        alt="horse"
                                        className="z-[20] w-40 sm:w-40 md:w-52 lg:w-64 mt-[35%] mr-[75%] sm:mt-[40%] sm:mr-[75%] md:mt-[25%] md:mr-[75%] lg:mt-[30%] lg:mr-[75%] xl:mt-[35%] xl:mr-[75%] 2xl:mt-[35%] 2xl:mr-[75%]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Image
                                src={StarsSky}
                                alt="star"
                                className="absolute top-10 left-0 z-[10] w-auto h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-auto z-[5]">
                {/* Tree Ground Image */}
                <Image
                    src={TreeGround}
                    alt="trees"
                    className="w-full h-full object-cover md:object-contain"
                />
            </div>
        </div>
    );
};

export default Hero_Client;
