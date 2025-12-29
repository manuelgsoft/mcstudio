import Image from "next/image";

export default function AboutUs() {
    const foundersImage = "/images/us.jpeg";
    return (
        <section id="support" className="bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center sm:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                Meet the team
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#0b1930] sm:text-4xl">
                Maria and Carolina, your travel tailors
              </h2>
              <p className="mt-3 text-base text-[#3d4a68] sm:text-lg">
                Here to make our dream come true: custom-sewing trips designed for each of you.
              </p>
            </div>
            <div className="w-full max-w-md overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(12,17,43,0.18)]">
              <Image
                src={foundersImage}
                alt="Maria and Carolina smiling together"
                className="h-full w-full rounded-[14px] object-cover grayscale"
                width={1042}
                height={1426}
                loading="lazy"
              />
            </div>
          </div>
        </section>
    )
}
