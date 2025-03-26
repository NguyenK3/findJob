"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge, Check, CircleCheck, Goal } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import exp from "constants";

enum SubcriptionType {
    Free,
    Premium,
    Enterprise,
}

type SubcriptionStrings = keyof typeof SubcriptionType;

interface SubscriptionProps {
    title: string;
    description: string;
    feature: string[];
    price: number;
    typeMember: SubcriptionStrings;
    popular?: number;
    billing?: string;
    paymentLink?: string;
}

const subcriptionList: SubscriptionProps[] = [
    {
        title: "Free",
        description:
            "Dành cho những ứng viên mới bắt đầu tìm việc, cung cấp các công cụ cơ bản để tiếp cận thị trường lao động.",
        feature: [
            "Tìm kiếm việc làm cơ bản",
            "Ứng tuyển có giới hạn",
            "Hồ sơ & CV online với các mẫu cơ bản",
            "Thông báo việc làm qua email",
            "Tin tức & Blog",
            "Diễn đàn cộng đồng",
        ],
        price: 0,
        typeMember: "Free",
    },
    {
        title: "Premium",
        description:
            "Dành cho ứng viên chuyên nghiệp, với các tính năng nâng cao giúp tối ưu hóa quá trình tìm việc.",
        feature: [
            "Ứng tuyển không giới hạn",
            "Tìm kiếm việc làm nâng cao với bộ lọc chi tiết (lương, kinh nghiệm, vị trí…)",
            "Hồ sơ nổi bật trên trang tuyển dụng",
            "Thông báo cá nhân hóa qua email, SMS và ứng dụng",
            "Xem ai đã truy cập hồ sơ",
            "Phân tích hồ sơ bằng AI",
            "Webinar & Khóa học online",
            "Ứng dụng di động thân thiện",
        ],
        price: 200000,
        typeMember: "Premium",
        popular: 85,
        billing: "Monthly",
        paymentLink: "https://payment.example.com/premium",
    },
    {
        title: "Enterprise",
        description:
            "Dành cho ứng viên cao cấp cần dịch vụ toàn diện và hỗ trợ chuyên sâu, tối ưu hóa toàn bộ quá trình phát triển sự nghiệp.",
        feature: [
            "Tất cả tính năng của Premium",
            "Tư vấn cá nhân 1-1 chuyên sâu từ chuyên gia",
            "Phân tích hồ sơ chuyên sâu với feedback cá nhân",
            "Hỗ trợ định hướng nghề nghiệp và chiến lược thương hiệu cá nhân",
            "Tiếp cận việc làm độc quyền",
            "Sự kiện networking & job fair chuyên biệt",
            "Hỗ trợ đặt lịch phỏng vấn & quản lý lịch",
            "Công cụ tối ưu hóa CV nâng cao",
        ],
        price: 500000,
        typeMember: "Enterprise",
        popular: 19.99,
        billing: "Yearly",
        paymentLink: "https://payment.example.com/enterprise",
    },
];

// Sort the subscription list based on typeMember
const sortedSubcriptionList = subcriptionList.sort((a, b) => {
    const order = ['Free', 'Premium', 'Enterprise'];
    return order.indexOf(a.typeMember) - order.indexOf(b.typeMember);
});

export const Subscription_Client = () => {
    return (
        <>
            <motion.h2
                initial={{ opacity: 0, x: -100 }} // Start from the left
                animate={{
                    x: 0, // Move to the original position
                    opacity: 1,
                    transition: {
                        duration: 6,
                        delay: 1, // Delay after the page load
                        ease: "backInOut", // Easing function for smooth transition
                    },
                }}
                className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
                <span className="bg-gradient-to-r from-red-400 to-yellow-400 text-transparent bg-clip-text">
                    Get
                </span>{" "}
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
                    Unlimited
                </span>{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                    Access
                </span>
            </motion.h2>

            <motion.h3
                animate={{
                    opacity: [1, 0, 1], // Keyframes for blinking effect
                    transition: {
                        duration: 3, // Duration of one blink cycle
                        repeat: Infinity, // Repeat the animation infinitely
                        ease: "easeInOut", // Easing function for smooth transition
                    },
                }}
                className="text-xs md:text-medium font-semibold text-center text-black-600 mb-12"
            >
                Unlock endless career opportunities
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
                {sortedSubcriptionList.map((subcription: SubscriptionProps) => (
                    <div key={subcription.title} className="flex">
                        <Card
                            className={`flex flex-col w-full p-4 rounded-lg shadow-md transition-transform hover:scale-105 
          ${subcription.typeMember === "Free"
                                    ? "border border-secondary mt-60"
                                    : subcription.typeMember === "Premium"
                                        ? "border border-primary mt-32"
                                        : "border border-accent mt-0"
                                }`}
                        >
                            <CardHeader className="mb-3 text-center transition-transform duration-300 ease-in-out hover:scale-105">
                                <CardTitle className="flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500">
                                    {subcription.title}
                                </CardTitle>
                                <div className="mt-2 flex flex-col items-center">
                                    {subcription.popular && (
                                        <div className="text-xs text-center font-medium text-white bg-orange-500 px-2 py-1 rounded-full mb-1 shadow-md">
                                            {subcription.popular}%
                                        </div>
                                    )}
                                    <div className="flex items-baseline">
                                        <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-t from-stone-500 via-slate-500 to-neutral-500 drop-shadow-md transition transform duration-300 ease-in-out hover:scale-105">
                                            {subcription.price !== 0 ? `$${subcription.price} /` : `$${subcription.price}`}
                                        </span>
                                        <span className="text-base italic font-semibold text-gray-500 ml-1">
                                            {subcription.billing}
                                        </span>
                                    </div>
                                </div>

                                <CardDescription className="mt-2 text-justify text-sm font-bold italic text-gray-700 p-3 bg-gradient-to-br from-pink-50 via-red-50 to-red-50 rounded-lg shadow transition-transform duration-300 hover:scale-105 hover:shadow-md">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-red-800 transition-colors duration-300">
                                            {subcription.description}
                                        </span>
                                    </div>
                                </CardDescription>
                            </CardHeader>

                            {/* <CardContent className="mb-3">
                                <ul className="space-y-3">
                                    {subcription.feature.map((feature: string) => (
                                        <li
                                            key={feature}
                                            className="flex items-center p-2 bg-white rounded-md shadow transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                                        >
                                            <CircleCheck className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                            <span className="ml-2 text-gray-800 font-semibold text-sm">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent> */}

                            <CardContent className="mb-3">
                                <ul className="space-y-3">
                                    {subcription.feature
                                        .slice(
                                            0,
                                            subcription.typeMember === "Premium"
                                                ? 5
                                                : subcription.typeMember === "Free"
                                                    ? 3
                                                    : 7
                                        )
                                        .map((feature: string, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center p-2 bg-white rounded-md shadow transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                                            >
                                                <CircleCheck className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                                <span className="ml-2 text-gray-800 font-semibold text-sm">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    {subcription.feature.length >
                                        (subcription.typeMember === "Premium"
                                            ? 5
                                            : subcription.typeMember === "Free"
                                                ? 3
                                                : 7) && (
                                            <li className="text-center text-xs text-gray-500">
                                                +{" "}
                                                {subcription.feature.length -
                                                    (subcription.typeMember === "Premium"
                                                        ? 5
                                                        : subcription.typeMember === "Free"
                                                            ? 3
                                                            : 7)}{" "}
                                                more
                                            </li>
                                        )}
                                </ul>
                            </CardContent>

                            <hr className="w-4/5 mx-auto mb-3 border-gray-300" />

                            {/* Phần footer được đẩy xuống dưới cùng của Card */}
                            <CardFooter className="mt-auto flex justify-center">
                                <div className="space-y-2 text-center">
                                    <Button
                                        variant="default"
                                        className="px-4 py-2 rounded-lg text-white font-bold bg-gradient-to-r from-orange-500 to-pink-500 shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 active:scale-95"
                                        rel="noopener noreferrer"
                                    >
                                        <Link href={`${subcription.paymentLink}`}>
                                            Get Started
                                        </Link>
                                    </Button>
                                    <p className="text-gray-600 text-xs">
                                        Already have an account?{" "}
                                        <Link href="#" className="text-orange-600 hover:underline">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>


        </>
    );
};

export default Subscription_Client;