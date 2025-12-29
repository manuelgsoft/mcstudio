"use client";

import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import Footer from "@/app/components/Footer";
import NavBar from "@/app/components/NavBar";
import { ALL_COUNTRIES } from "@/app/data/countries";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
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

type TripType = "individual" | "couple" | "family" | "group";

const TRIP_TYPE_LABELS: Record<TripType, string> = {
  individual: "Individual travel",
  couple: "Couple's trip",
  family: "Family trip",
  group: "Group trip",
};

const EXPERIENCE_OPTIONS = [
  "Nature and landscapes",
  "Food and wine",
  "Relax",
  "Culture and city",
  "Adventure",
];

function isTripType(value: string | null): value is TripType {
  return value !== null && Object.keys(TRIP_TYPE_LABELS).includes(value);
}

export default function QuestionnairePage() {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 4;

  const locationFromSearch = searchParams.get("location") ?? "";
  const dateFromSearch = useMemo(() => {
    const raw = searchParams.get("date");
    if (!raw) return undefined;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }, [searchParams]);
  const tripTypeFromSearch = isTripType(searchParams.get("tripType"))
    ? (searchParams.get("tripType") as TripType)
    : undefined;

  const [location, setLocation] = useState(locationFromSearch);
  const [travelDate, setTravelDate] = useState<Date | undefined>(dateFromSearch);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState(locationFromSearch);
  const [dateOpen, setDateOpen] = useState(false);

  const [tripType, setTripType] = useState<TripType | undefined>(
    tripTypeFromSearch
  );
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);

  const [budgetAmount, setBudgetAmount] = useState(1500);

  const [experiencePrefs, setExperiencePrefs] = useState<string[]>([]);

  const [flightPrefs, setFlightPrefs] = useState<string[]>([]);
  const [flightCompany, setFlightCompany] = useState("");

  const [accommodationPrefs, setAccommodationPrefs] = useState<string[]>([]);
  const [accommodationCompany, setAccommodationCompany] = useState("");

  const [otherDetails, setOtherDetails] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const filteredDestinations = useMemo(() => {
    if (!locationQuery.trim()) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((d) =>
      d.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [locationQuery]);

  function toggleSelection(
    value: string,
    current: string[],
    setter: (next: string[]) => void
  ) {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  }

  function validateStep(step: number) {
    if (step === 1)
      return location.trim() && travelDate && tripType && adults >= 1;
    if (step === 4) return contactEmail.trim() && contactName.trim();
    return true;
  }

  function next() {
    setShowErrors(true);
    if (!validateStep(currentStep)) return;
    setShowErrors(false);
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setShowErrors(false);
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(true);
    if (!validateStep(currentStep)) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <NavBar />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="rounded-2xl bg-white px-10 py-14 shadow-xl">
            <h1 className="text-3xl font-bold text-[#0b1930]">Thank you!</h1>
            <p className="mt-4 text-lg text-[#3d4a68]">
              We’ll craft a personalized trip proposal and get back to you
              shortly.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0b1930]">
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <div className="mb-8 text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            Your dream escape
          </p>
          <h1 className="text-3xl font-bold text-[#0b1930]">
            Tell us your travel preferences
          </h1>
          <p className="text-base text-[#3d4a68]">
            Share your destination, dates, and the vibe you want—we will craft a custom proposal around you.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl bg-white px-6 py-10 shadow-xl"
        >
          <header className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {currentStep === 1 && "Trip basics"}
              {currentStep === 2 && "Budget & preferences"}
              {currentStep === 3 && "Logistics"}
              {currentStep === 4 && "Contact details"}
            </h1>
          </header>

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="space-y-6">
              <Field label="Destination">
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 w-full justify-start gap-3 cursor-pointer">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      {location || "Search destinations"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        value={locationQuery}
                        onValueChange={(v) => {
                          setLocationQuery(v);
                          setLocation(v);
                        }}
                        placeholder="Search destinations..."
                      />
                      <CommandList>
                        <CommandEmpty>No results</CommandEmpty>
                        <CommandGroup>
                          {filteredDestinations.map((d) => (
                            <CommandItem
                              key={d}
                              value={d}
                              onSelect={() => {
                                setLocation(d);
                                setLocationOpen(false);
                              }}
                            >
                              {d}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {showErrors && !location && (
                  <Error>Please select a destination</Error>
                )}
              </Field>

              <Field label="Departure date">
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 w-full justify-start gap-3 cursor-pointer">
                      <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                      {travelDate ? format(travelDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={travelDate}
                      onSelect={(d) => {
                        setTravelDate(d ?? undefined);
                        setDateOpen(false);
                      }}
                      components={{
                        DayButton: (props) => (
                          <CalendarDayButton {...props} />
                        ),
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {showErrors && !travelDate && (
                  <Error>Please select a date</Error>
                )}
              </Field>

              <Field label="Type of trip">
                <RadioGroup
                  options={TRIP_TYPE_LABELS}
                  value={tripType}
                  onChange={setTripType}
                />
                {showErrors && !tripType && (
                  <Error>Please select a trip type</Error>
                )}
              </Field>

              <PeopleCounters
                adults={adults}
                childrenCount={childrenCount}
                infants={infants}
                setAdults={setAdults}
                setChildrenCount={setChildrenCount}
                setInfants={setInfants}
              />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Field label="Budget">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-[#0b1930]">
                    Total trip budget (optional)
                  </label>
                  <div className="rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-[#0b1930]">Suggested</span>
                      <span className="text-lg font-bold text-[#0b1930]">
                        €{budgetAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <input
                        type="range"
                        min={100}
                        max={10000}
                        step={100}
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-[#3d4a68]">
                        <span>€100</span>
                        <span>€5050</span>
                        <span>€10,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Field>

              <Field label="Top experiences (select up to 3)">
                <CheckboxGroup
                  options={EXPERIENCE_OPTIONS}
                  values={experiencePrefs}
                  onToggle={(v) =>
                    experiencePrefs.length < 3 || experiencePrefs.includes(v)
                      ? toggleSelection(v, experiencePrefs, setExperiencePrefs)
                      : null
                  }
                />
              </Field>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Field label="Flight preferences">
                <CheckboxGroup
                  options={[
                    "Avoid early / late flights",
                    "Minimize stopovers",
                    "Specific airline",
                  ]}
                  values={flightPrefs}
                  onToggle={(v) =>
                    toggleSelection(v, flightPrefs, setFlightPrefs)
                  }
                />
                {flightPrefs.includes("Specific airline") && (
                  <input
                    className="mt-3 w-full rounded-lg border px-4 py-3"
                    placeholder="Preferred airline"
                    value={flightCompany}
                    onChange={(e) => setFlightCompany(e.target.value)}
                  />
                )}
              </Field>

              <Field label="Accommodation preferences">
                <CheckboxGroup
                  options={[
                    "Convenient hours",
                    "Minimize stopovers",
                    "Specific hotel brand",
                  ]}
                  values={accommodationPrefs}
                  onToggle={(v) =>
                    toggleSelection(v, accommodationPrefs, setAccommodationPrefs)
                  }
                />
                {accommodationPrefs.includes("Specific hotel brand") && (
                  <input
                    className="mt-3 w-full rounded-lg border px-4 py-3"
                    placeholder="Hotel brand or property"
                    value={accommodationCompany}
                    onChange={(e) => setAccommodationCompany(e.target.value)}
                  />
                )}
              </Field>

              <Field label="Other useful requests or details">
                <textarea
                  className="w-full rounded-lg border px-4 py-3"
                  rows={3}
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  placeholder="Share any additional context for your trip"
                />
              </Field>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Field
                label={
                  <span className="flex items-center gap-1">
                    Your name <span className="text-red-500">*</span>
                  </span>
                }
              >
                <input
                  className="w-full rounded-lg border px-4 py-3"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </Field>

              <Field
                label={
                  <span className="flex items-center gap-1">
                    Email <span className="text-red-500">*</span>
                  </span>
                }
              >
                <input
                  type="email"
                  className="w-full rounded-lg border px-4 py-3"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                {showErrors && !contactEmail && null}
              </Field>

              <Field label="Phone">
                <input
                  className="w-full rounded-lg border px-4 py-3"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </Field>
            </div>
          )}

          <footer className="mt-10 flex justify-end gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={back}
                className="cursor-pointer rounded-full border border-[#e7eaf3]"
              >
                Back
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={next}
                className="cursor-pointer rounded-full bg-blue-500 px-6 text-white hover:bg-[#1e55d3]"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                className="cursor-pointer rounded-full bg-blue-500 px-6 text-white hover:bg-[#1e55d3]"
              >
                Get my custom trip plan
              </Button>
            )}
          </footer>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Error({ children }: { children: string }) {
  return <p className="text-xs font-semibold text-red-600">{children}</p>;
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: Record<string, string>;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {Object.entries(options).map(([k, label]) => (
        <label
          key={k}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer ${
            value === k ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <input
            type="radio"
            checked={value === k}
            onChange={() => onChange(k)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((o) => (
        <label
          key={o}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer ${
            values.includes(o) ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={values.includes(o)}
            onChange={() => onToggle(o)}
          />
          {o}
        </label>
      ))}
    </div>
  );
}

type PeopleCountersProps = {
  adults: number;
  childrenCount: number;
  infants: number;
  setAdults: (v: number) => void;
  setChildrenCount: (v: number) => void;
  setInfants: (v: number) => void;
};

function PeopleCounters({
  adults,
  childrenCount,
  infants,
  setAdults,
  setChildrenCount,
  setInfants,
}: PeopleCountersProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Counter label="Adults" value={adults} min={1} onChange={setAdults} />
      <Counter label="Children" value={childrenCount} min={0} onChange={setChildrenCount} />
      <Counter label="Infants" value={infants} min={0} onChange={setInfants} />
    </div>
  );
}

type CounterProps = {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
};

function Counter({ label, value, min, onChange }: CounterProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#e7eaf3] bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-[#0b1930]">{label}</p>
        <p className="text-xs text-gray-500">{min > 0 ? "Required" : "Optional"}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => value > min && onChange(value - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eaf3] text-lg font-bold text-[#0b1930] transition hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          –
        </button>
        <span className="w-8 text-center text-base font-semibold text-[#0b1930]">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eaf3] text-lg font-bold text-[#0b1930] transition hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
