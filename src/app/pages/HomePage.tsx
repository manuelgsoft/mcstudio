
"use client";
import AboutUs from "@/app/components/AboutUs";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import Info from "@/app/components/Info";
import NavBar from "@/app/components/NavBar";
import SearchForm from "@/app/components/SearchForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0b1930]">
      <NavBar />
      <main className="relative isolate">
        <Hero />
        <SearchForm />
        <Info />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}
