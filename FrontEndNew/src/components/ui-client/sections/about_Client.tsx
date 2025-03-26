"use client"

import Image from "next/image";
import Customers from "@/assets/customer.png";
import Rockets from "@/assets/rocket.png";
import Completes from "@/assets/completed.png";
import Experiences from "@/assets/experience.png";
import { FileText, Laptop, Search } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About_Client = () => {
    useEffect(() => {
        const initAOS = async () => {
            await import("aos")
            AOS.init({
                duration: 1000,
                easing: "ease-in-out",
                delay: 100,
                once: true,
                anchorPlacement: "top-bottom"
            })
        }
        initAOS()
    }, [])
    return (
        <>
            <div className="pt-16 pb-16 bg-[#050709]">
                <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-20">
                    <div>
                        <h1
                            data-aos="fade-down-right"
                            className="text-bg text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text"
                        >
                            Finding Your Perfect Role in Web Development
                        </h1>
                        <p
                            data-aos="zoom-out"
                            className="mt-6 text-base text-gray-500 italic"
                        >
                            At KabaJobs, we’re not just a team—we’re a community
                            of passionate designers and developers united by the
                            mission to create outstanding web solutions. Whether
                            you’re a creative mind, a problem-solver, or a
                            full-stack enthusiast, we’re looking for talented
                            individuals to help businesses achieve their goals.
                        </p>
                        <div className="mt-8">
                            <div
                                data-aos="fade-right"
                                className="flex items-center space-x-2 mb-6"
                            >
                                <div className="w-7 h-7 flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-yellow-400">
                                    <Search className="text-white transition-all duration-300 ease-in-out hover:text-yellow-400" />
                                </div>
                                <p className="text-sm sm:text-base md:text-large font-semibold text-gray-300">
                                    Job Search Specialist
                                </p>
                            </div>
                            <div
                                data-aos="fade-right"
                                className="flex items-center space-x-2 mb-6">
                                <div className="w-7 h-7 flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-pink-400">
                                    <FileText className="text-white transition-all duration-300 ease-in-out hover:text-pink-400" />
                                </div>
                                <p className="text-sm sm:text-base md:text-large font-bold text-gray-300">
                                    Resume Optimization Expert
                                </p>
                            </div>
                            <div
                                data-aos="fade-right"
                                className="flex items-center space-x-2 mb-6">
                                <div className="w-7 h-7 flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-purple-400">
                                    <Laptop className="text-white transition-all duration-300 ease-in-out hover:text-purple-400" />
                                </div>
                                <p className="text-sm sm:text-base md:text-large font-semibold text-gray-300">
                                    Freelance & Remote Opportunities Coordinator
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-16 items-center lg:mx-auto">
                        <div className="transition-transform transform hover:scale-110 hover:opacity-90" data-aos="fade-down-left">
                            <Image
                                src={Customers}
                                alt="customers-logo"
                                width={80}
                                height={80}
                                className="mx-auto transition-all duration-300 ease-in-out"
                            />
                            <p className="mt-3 font-bold text-xl text-white text-center">
                                100+
                            </p>
                            <p className="text-base sm:text-lg text-gray-400 text-center italic font-semibold">
                                Satisfied Customers
                            </p>
                        </div>
                        <div className="transition-transform transform hover:scale-110 hover:opacity-90" data-aos="fade-down-left">
                            <Image
                                src={Experiences}
                                alt="experiences-logo"
                                width={80}
                                height={80}
                                className="mx-auto transition-all duration-300 ease-in-out"
                            />
                            <p className="mt-3 font-bold text-xl text-white text-center">
                                0 - more than
                            </p>
                            <p className="text-base sm:text-lg text-gray-400 text-center italic font-semibold">
                                Years Experience
                            </p>
                        </div>
                        <div className="transition-transform transform hover:scale-110 hover:opacity-90" data-aos="fade-up-left">
                            <Image
                                src={Completes}
                                alt="completes-logo"
                                width={80}
                                height={80}
                                className="mx-auto transition-all duration-300 ease-in-out"
                            />
                            <p className="mt-3 font-bold text-xl text-white text-center">
                                3000+
                            </p>
                            <p className="text-base sm:text-lg text-gray-400 text-center italic font-semibold">
                                Finds Job
                            </p>
                        </div>
                        <div className="transition-transform transform hover:scale-110 hover:opacity-90" data-aos="fade-up-left">
                            <Image
                                src={Rockets}
                                alt="rockets-logo"
                                width={80}
                                height={80}
                                className="mx-auto transition-all duration-300 ease-in-out"
                            />
                            <p className="mt-3 font-bold text-xl text-white text-center">
                                3+ years
                            </p>
                            <p className="text-base sm:text-lg text-gray-400 text-center italic font-semibold">
                                Website Launched
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About_Client;
