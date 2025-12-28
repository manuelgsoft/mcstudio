import {
    GlobeAsiaAustraliaIcon,
    LanguageIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
export default function NavBar() {
    return (
    <header className="z-30 w-full bg-white/90 backdrop-blur border-b border-[#e7eaf3]">
      <nav className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-3 text-[#0b1930] transition hover:scale-[1.03]"
          aria-label="Back to top"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-[0_10px_28px_rgba(47,111,248,0.25)]">
            <GlobeAsiaAustraliaIcon className="h-8 w-8" />
          </div>
          <div className="leading-tight text-left">
            <h1 className="text-lg font-bold tracking-tight text-[#0b1930]">MC Studio</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">Travel design</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button
            className="hidden cursor-pointer items-center gap-2 rounded-full border border-[#0f172a]/10 bg-white/70 px-3 py-2 text-sm font-medium text-[#0f172a] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#2f6ff8]/50 hover:text-[#2f6ff8] sm:flex"
            title="Change language"
            id="language"
          >
            <LanguageIcon className="h-5 w-5" />
            EN
          </button>
          <button className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#1e55d3]">
            <UserCircleIcon className="h-5 w-5" />
            Sign in
          </button>
        </div>
      </nav>
    </header>
  )
}
