"use client";

import {
    CalendarDaysIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { type ReactNode } from "react";

type FieldPillProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export default function SearchForm() {
  return (
    <section className="relative -mt-36 px-2 sm:-mt-38 sm:px-4">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_80px_rgba(12,17,43,0.12)] ring-1 ring-[#e7eaf3]">
        <p className="px-6 pt-6 text-xs text-center font-semibold uppercase tracking-[0.2em] text-blue-500">
          Tell us how you imagine your journey
        </p>
        <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap gap-3">
            <FieldPill
              icon={<MapPinIcon className="h-5 w-5" />}
              label="Location"
              value="Where are you going?"
            />
            <FieldPill
              icon={<CalendarDaysIcon className="h-5 w-5" />}
              label="Time"
              value="When are you going?"
            />
            <FieldPill
              icon={<UsersIcon className="h-5 w-5" />}
              label="Travelers"
              value="How many are going?"
            />
          </div>
          <button className="cursor-pointer flex h-12 w-full items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[#1e55d3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e55d3] sm:w-12">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FieldPill({ icon, label, value }: FieldPillProps) {
  return (
    <button className="group flex min-w-[180px] flex-1 items-center gap-3 rounded-xl border border-transparent bg-[#f5f7fb] px-4 py-3 text-left shadow-inner transition duration-150 hover:-translate-y-0.5 hover:border-[#d9e2ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6ff8] sm:min-w-[200px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2f6ff8] shadow-sm transition duration-150 group-hover:shadow-md">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
          {label}
        </p>
        <p className="text-sm font-semibold text-[#0b1930]">{value}</p>
      </div>
    </button>
  );
}
