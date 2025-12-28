"use client";

import { useEffect, useState } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1453872302360-eed3c5f8ff66?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function Hero() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);

      return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="relative px-2 pb-12 pt-8 sm:px-4 sm:pb-14 sm:pt-10">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-slate-900 shadow-[0_25px_90px_rgba(12,17,43,0.18)] ring-1 ring-white/10 min-h-[500px] sm:min-h-[500px]">
            <div className="absolute inset-0">
              {heroImages.map((image, index) => (
                <div
                  key={image}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(115deg, rgba(9,12,26,0.78) 15%, rgba(9,12,26,0.55) 45%, rgba(9,12,26,0.35) 70%), url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 70%",
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="relative flex flex-col gap-10 px-4 pb-32 pt-16 sm:px-7 lg:flex-row lg:items-end lg:gap-12 lg:px-12 lg:pb-36 lg:pt-20">
              <div className="max-w-2xl space-y-5 text-white">
                <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight drop-shadow-sm sm:text-6xl lg:text-[72px]">
                  You dream it.
                  <br />
                  We plan it.
                </h1>
                <h2 className="text-2xl text-white/90 sm:text-xl">
                  Personalized travel consulting based on who you are. We design your trip around your travel style, pace, budget and preferences.
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <button className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#1e55d3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto">
                    Get your first free consult
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}   
