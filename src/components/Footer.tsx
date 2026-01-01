import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-[#e7eaf3] bg-[#f5f7fb] py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-[0_10px_28px_rgba(47,111,248,0.25)]">
            <GlobeAsiaAustraliaIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#0b1930]">MC Studio</p>
            <p className="text-sm text-[#3d4a68]">
              Journey architects for people who love great stays.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-[#3d4a68]">
          <a
            href="mailto:hello@mcstudio.travel"
            className="rounded-full bg-white px-4 py-2 transition hover:-translate-y-0.5 hover:bg-[#e8f0ff]"
          >
            hello@mcstudio.travel
          </a>
          <span className="rounded-full bg-white px-4 py-2">
            +34 000 000 000
          </span>
        </div>
      </div>
    </footer>
  );
}
