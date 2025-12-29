"use client";

import {
  ArrowRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useRef, useState } from "react";

type TripType = "individual" | "couple" | "family" | "group";

const TRIP_TYPE_LABELS: Record<TripType, string> = {
  individual: "Individual travel",
  couple: "Couple’s trip",
  family: "Family trip",
  group: "Group trip",
};

const COUNTRIES_BY_REGION: Record<string, string[]> = {
  Europe: [
    "Albania",
    "Andorra",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Ukraine",
    "United Kingdom",
    "Vatican City",
  ],
  Asia: [
    "Afghanistan",
    "Armenia",
    "Azerbaijan",
    "Bahrain",
    "Bangladesh",
    "Bhutan",
    "Brunei",
    "Cambodia",
    "China",
    "Georgia",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Israel",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Lebanon",
    "Malaysia",
    "Maldives",
    "Mongolia",
    "Myanmar",
    "Nepal",
    "North Korea",
    "Oman",
    "Pakistan",
    "Philippines",
    "Qatar",
    "Saudi Arabia",
    "Singapore",
    "South Korea",
    "Sri Lanka",
    "Syria",
    "Tajikistan",
    "Thailand",
    "Timor-Leste",
    "Turkey",
    "Turkmenistan",
    "United Arab Emirates",
    "Uzbekistan",
    "Vietnam",
    "Yemen",
  ],
  Africa: [
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cameroon",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Congo",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Ivory Coast",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "São Tomé and Príncipe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ],
  "North America": ["Canada", "Mexico", "United States"],
  Caribbean: [
    "Antigua and Barbuda",
    "Bahamas",
    "Barbados",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Trinidad and Tobago",
  ],
  "Central America": [
    "Belize",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Panama",
  ],
  "South America": [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela",
  ],
  Oceania: [
    "Australia",
    "Fiji",
    "Kiribati",
    "Marshall Islands",
    "Micronesia",
    "Nauru",
    "New Zealand",
    "Palau",
    "Papua New Guinea",
    "Samoa",
  ],
};

const ALL_COUNTRIES = Object.values(COUNTRIES_BY_REGION).flat();

export default function SearchForm() {
  const [location, setLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [tripType, setTripType] = useState<TripType | "">("");

  const dateRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ location, travelDate, tripType });
  }

  return (
    <section className="relative -mt-36 px-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-[0_30px_90px_rgba(12,17,43,0.12)] ring-1 ring-[#eef1f8]"
      >
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
          Tell us how you imagine your journey
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field label="Location" icon={<MapPinIcon className="h-5 w-5" />}>
            <input
              type="text"
              list="countries"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you going?"
              className="w-full cursor-text bg-transparent text-base font-medium text-black placeholder:text-gray-400 focus:outline-none"
            />
            <datalist id="countries">
              {ALL_COUNTRIES.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </Field>

          <Field
            label="Travel date"
            icon={<CalendarDaysIcon className="h-5 w-5" />}
            onClick={() => dateRef.current?.showPicker()}
          >
            <input
              ref={dateRef}
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              onPointerDown={(e) => {
                e.preventDefault();
                dateRef.current?.showPicker();
              }}
              onFocus={() => dateRef.current?.showPicker()}
              inputMode="none"
              onKeyDown={(e) => e.preventDefault()}
              placeholder="When are you going?"
              className={`w-full cursor-pointer bg-transparent text-base font-medium focus:outline-none ${
                travelDate ? "text-black" : "text-gray-400"
              }`}
            />
          </Field>

          <Field label="Trip type" icon={<UsersIcon className="h-5 w-5" />}>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value as TripType | "")}
              className={`w-full cursor-pointer bg-transparent text-base font-medium focus:outline-none ${
                tripType ? "text-black" : "text-gray-400"
              }`}
            >
              <option value="" disabled hidden>
                Select trip type
              </option>
              {Object.entries(TRIP_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            aria-label="Search"
            className="cursor-pointer flex h-12 w-full items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1e55d3] sm:w-12"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex min-w-[200px] flex-1 cursor-pointer items-center gap-3 rounded-xl bg-[#f6f8fc] px-4 py-3 transition hover:bg-[#eef2ff] focus-within:ring-2 focus-within:ring-blue-500"
    >
      <div className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
        {icon}
      </div>

      <div className="flex-1">
        <label className="pointer-events-none mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
          {label}
        </label>
        {children}
      </div>
    </div>
  );
}
