"use client";

import {
  ArrowRightIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_COUNTRIES, type TripType, TRIP_TYPE_LABELS } from "@/utils/data";

export default function SearchForm() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [tripType, setTripType] = useState<TripType | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const filteredCountries = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    if (!query) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((country) =>
      country.toLowerCase().includes(query),
    );
  }, [locationQuery]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (!location || !tripType) return;
    const params = new URLSearchParams();
    params.set("location", location);
    params.set("tripType", tripType);
    const queryString = params.toString();
    router.push(`/questionnaire${queryString ? `?${queryString}` : ""}`);
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
          <Field
            label="Location"
            icon={<MapPinIcon className="h-5 w-5" />}
            error={
              submitted && !location ? "This field is required" : undefined
            }
          >
            <Popover
              open={locationOpen}
              onOpenChange={(open) => {
                setLocationOpen(open);
                if (open) setLocationQuery("");
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationOpen}
                  className="cursor-pointer flex w-full items-center justify-between rounded-lg border-0 bg-transparent px-0 text-left text-base font-medium shadow-none hover:bg-transparent focus-visible:ring-0"
                >
                  <span className={location ? "text-black" : "text-gray-400"}>
                    {location || "Where are you going?"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    value={locationQuery}
                    onValueChange={(value) => {
                      setLocationQuery(value);
                      setLocation(value);
                    }}
                    placeholder="Search destinations..."
                  />
                  <CommandList>
                    <CommandEmpty>No destinations found.</CommandEmpty>
                    <CommandGroup>
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country}
                          value={country}
                          className="cursor-pointer"
                          onSelect={(value) => {
                            setLocation(value);
                            setLocationQuery(value);
                            setLocationOpen(false);
                          }}
                        >
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Field>

          <Field
            label="Trip type"
            icon={<UsersIcon className="h-5 w-5" />}
            error={
              submitted && !tripType ? "This field is required" : undefined
            }
          >
            <Select
              value={tripType}
              onValueChange={(value) => setTripType(value as TripType)}
            >
              <SelectTrigger className="h-12 w-full cursor-pointer rounded-lg border-0 bg-transparent px-0 text-left text-base font-medium text-black shadow-none hover:bg-transparent focus-visible:ring-0 [&>svg]:hidden">
                <SelectValue placeholder="Select trip type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRIP_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="cursor-pointer"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Button
            type="submit"
            aria-label="Search"
            size="lg"
            className="cursor-pointer flex h-12 w-full items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1e55d3] sm:w-12"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  const wrapperClasses =
    "flex min-w-[200px] flex-1 items-center gap-3 rounded-xl bg-[#f6f8fc] px-4 py-3 transition hover:bg-[#eef2ff] focus-within:ring-2 focus-within:ring-blue-500" +
    (error ? " ring-2 ring-red-500 focus-within:ring-red-500" : "");

  return (
    <div className="flex-1">
      <div className={wrapperClasses}>
        <div className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
          {icon}
        </div>

        <div className="flex-1">
          <label
            className={
              "pointer-events-none mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em]" +
              (error ? " text-red-600" : " text-gray-500")
            }
          >
            {label}
          </label>
          {children}
        </div>
      </div>
    </div>
  );
}
