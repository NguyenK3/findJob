import { useEffect, useState } from "react";
import Header_Client from "@/components/ui-client/sections/header_Client";
import Hero_Client from "@/components/ui-client/sections/hero_Client";
import LogoTicker_Client from "@/components/ui-client/sections/logoTicker_Client";
import About_Client from "@/components/ui-client/sections/about_Client";
import "aos/dist/aos.css";
import Loading from "./loading";
import Skills_Client from "@/components/ui-client/sections/skills_Client";
import { Image } from "@heroui/image";
import Subscription_Client from "@/components/ui-client/sections/subscription_Client";

const Home = async () => {

  return (
    <>
      <header className="sticky md:max-w-screen sm:min-w-screen top-0 w-full bg-gradient-to-tr from-indigo-200 via-emerald-100 to-pink-300 z-50">
        <Header_Client />
      </header>
      <main className="w-full bg-gradient-to-br from-white to-gray-100">
        <section className="flex flex-col bg-[url('/main-bg.webp')] w-full md:max-w-screen sm:min-w-screen">
          <div className="flex flex-col items-center justify-center h-full w-full bg-opacity-50">
            <Hero_Client />
          </div>
        </section>
        <section className="md:max-w-screen sm:min-w-screen w-full">
          <LogoTicker_Client />
        </section>
        <section className="md:max-w-screen sm:min-w-screen w-full">
          <About_Client />
        </section>
        <section className="md:max-w-screen sm:min-w-screen w-10/12 mx-auto px-4 py-12">
          <Subscription_Client />
        </section>
        <section className="relative md:max-w-screen sm:min-w-screen w-full">
          <div className="absolute inset-0 bg-[url('/star-bg.webp')] bg-cover opacity-50"></div>
          <div className="absolute inset-0 bg-[url('/skills-bg.webp')] opacity-70 bg-center bg-cover"></div>
          <div className="relative">
            <Skills_Client />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;