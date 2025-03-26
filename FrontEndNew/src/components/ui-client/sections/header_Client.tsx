"use client"

import { ArrowRight } from "lucide-react";
import Logo from "@/assets/logo.webp";
import Image from "next/image";
import { MenuIcon } from "lucide-react";

const Header_Client = () => {
    return (
        <>
            <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
                <p className="text-white/60 hidden md:block">
                    Streamline your workflow and boost your productivity
                </p>
                <div className="inline-flex gap-1 items-center">
                    <p>Get started for free</p>
                    <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
                </div>
            </div>
            <div className="py-5 px-0">
                <div className="w-full mx-auto px-5">
                    <div className="flex items-center justify-between">
                        <Image
                            src={Logo}
                            alt="Logo FindJob"
                            height={40}
                            width={40}
                        />
                        <MenuIcon className="h-5 w-5 md:hidden" />
                        <nav className="hidden md:flex gap-6 text-black/60 items-center">
                            <a href="#">About</a>
                            <a href="#">Feature</a>
                            <a href="#">Jobs</a>
                            <a href="#">Company</a>
                            <a href="#">Help</a>
                            <button className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex justify-center items-center tracking-tight">
                                Get for free
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header_Client;
