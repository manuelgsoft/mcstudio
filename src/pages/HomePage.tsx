"use client";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Info from "@/components/Info";
import NavBar from "@/components/NavBar";
import SearchForm from "@/components/SearchForm";

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
