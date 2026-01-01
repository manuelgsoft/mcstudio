"use client";

import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import { DateRange } from "react-day-picker";

type TripType = "individual" | "couple" | "family" | "group";

const TRIP_TYPE_LABELS: Record<TripType, string> = {
  individual: "Individual travel",
  couple: "Couple's trip",
  family: "Family trip",
  group: "Group trip",
};

const STEP_IMAGES: Record<number, { src: string; alt: string }> = {
  1: {
    src: "https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Traveler overlooking mountains at sunrise",
  },
  2: {
    src: "https://images.unsplash.com/photo-1637169797848-12431f1d355c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Couple enjoying a scenic sunset over the sea",
  },
  3: {
    src: "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Airplane wing flying above the clouds",
  },
  4: {
    src: "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Cozy hotel lobby with warm lighting",
  },
};

const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/;

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
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 4;

  const locationFromSearch = searchParams.get("location") ?? "";
  const datesFromSearch = useMemo(() => {
    const startRaw = searchParams.get("startDate");
    const endRaw = searchParams.get("endDate");

    const parseDate = (raw: string | null) => {
      if (!raw) return undefined;
      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    };

    const start = parseDate(startRaw);
    const end = parseDate(endRaw);
    if (!start && !end) return undefined;
    return { from: start, to: end };
  }, [searchParams]);
  const tripTypeFromSearch = isTripType(searchParams.get("tripType"))
    ? (searchParams.get("tripType") as TripType)
    : undefined;

  const [location, setLocation] = useState(locationFromSearch);
  const [travelDates, setTravelDates] = useState<DateRange | undefined>(
    datesFromSearch,
  );
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState(locationFromSearch);
  const [dateOpen, setDateOpen] = useState(false);

  const [tripType, setTripType] = useState<TripType | undefined>(
    tripTypeFromSearch,
  );
  const [adults, setAdults] = useState(() => {
    if (tripTypeFromSearch === "individual") return 1;
    if (tripTypeFromSearch === "couple") return 2;
    if (tripTypeFromSearch === "family") return 2;
    if (tripTypeFromSearch === "group") return 3;
    return 2;
  });
  const [childrenCount, setChildrenCount] = useState(
    tripTypeFromSearch === "family" ? 1 : 0,
  );
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
  const [showSubmitErrors, setShowSubmitErrors] = useState(false);

  const isSignedIn = false; // TODO: replace with real auth state
  const trimmedContactName = contactName.trim();
  const trimmedContactEmail = contactEmail.trim();
  const emailValid = trimmedContactEmail
    ? EMAIL_REGEX.test(trimmedContactEmail)
    : false;
  const phoneValid =
    !contactPhone.trim() || /^\+?[0-9 ()-]{7,20}$/.test(contactPhone.trim());
  const stepImage = STEP_IMAGES[currentStep] ?? STEP_IMAGES[1];
  const isFinalStep = currentStep === TOTAL_STEPS;

  const filteredDestinations = useMemo(() => {
    if (!locationQuery.trim()) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((d) =>
      d.toLowerCase().includes(locationQuery.toLowerCase()),
    );
  }, [locationQuery]);

  function toggleSelection(
    value: string,
    current: string[],
    setter: (next: string[]) => void,
  ) {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  }

  function validateStep(step: number) {
    const needsFlightCompany =
      flightPrefs.includes("Specific airline") && !flightCompany.trim();
    const needsAccommodationCompany =
      accommodationPrefs.includes("Specific hotel brand") &&
      !accommodationCompany.trim();

    if (step === 1)
      return (
        location.trim() &&
        travelDates?.from &&
        travelDates?.to &&
        tripType &&
        adults >= 1
      );
    if (step === 3) return !needsFlightCompany && !needsAccommodationCompany;
    if (step === 4) {
      if (isSignedIn) return true;
      return emailValid && trimmedContactName && phoneValid;
    }
    return true;
  }

  function next() {
    setShowErrors(false);
    setShowSubmitErrors(false);
    if (!validateStep(currentStep)) {
      setShowErrors(true);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setShowErrors(false);
    setShowSubmitErrors(false);
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(false);
    setShowSubmitErrors(false);
    if (!validateStep(currentStep)) {
      if (currentStep === 4) setShowSubmitErrors(true);
      setShowErrors(true);
      return;
    }
    const payload = {
      location,
      startDate: travelDates?.from?.toISOString() ?? "",
      endDate: travelDates?.to?.toISOString() ?? "",
      tripType: tripType ?? "",
      adults,
      children: childrenCount,
      infants,
      budgetAmount,
      experiences: experiencePrefs,
      flightPrefs,
      flightCompany,
      accommodationPrefs,
      accommodationCompany,
      otherDetails: otherDetails || null,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
    };

    console.log("Questionnaire submission", payload);
    setSubmitted(true);
  }

  const cardContent = (
    <>
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          {currentStep === 1 && "General information"}
          {currentStep === 2 && "Budget"}
          {currentStep === 3 && "Preferences"}
          {currentStep === 4 && "Review & Submit"}
        </h1>
      </header>

      {currentStep === 1 && (
        <div className="space-y-8">
          <div className="space-y-6">
            <Field
              label={
                <span className="flex items-center gap-1">
                  Destination <span className="text-red-500">*</span>
                </span>
              }
            >
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start gap-3 cursor-pointer"
                  >
                    <MapPinIcon className="h-5 w-5 text-blue-500" />
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

            <Field
              label={
                <span className="flex items-center gap-1">
                  Travel dates <span className="text-red-500">*</span>
                </span>
              }
            >
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-start gap-3 cursor-pointer"
                  >
                    <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                    {travelDates?.from
                      ? travelDates.to
                        ? `${format(travelDates.from, "PPP")} – ${format(travelDates.to, "PPP")}`
                        : format(travelDates.from, "PPP")
                      : "Select your dates"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    defaultMonth={travelDates?.from}
                    selected={travelDates}
                    onSelect={setTravelDates}
                    numberOfMonths={2}
                    showOutsideDays={false}
                    className="bg-blue-500"
                    components={{
                      DayButton: (props) => <CalendarDayButton {...props} />,
                    }}
                  />
                </PopoverContent>
              </Popover>
              {showErrors && (!travelDates?.from || !travelDates?.to) && (
                <Error>Please select both start and end dates</Error>
              )}
            </Field>

            <Field
              label={
                <span className="flex items-center gap-1">
                  Type of trip <span className="text-red-500">*</span>
                </span>
              }
            >
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
          <Field label="Estimated budget">
            <div className="space-y-3">
              <div className="rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#0b1930]">
                    Suggested
                  </span>
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

          <Field label="Experiences">
            <CheckboxGroup
              options={EXPERIENCE_OPTIONS}
              values={experiencePrefs}
              onToggle={(v) =>
                toggleSelection(v, experiencePrefs, setExperiencePrefs)
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
              onToggle={(v) => toggleSelection(v, flightPrefs, setFlightPrefs)}
            />
            {flightPrefs.includes("Specific airline") && (
              <div className="space-y-2">
                <input
                  className="mt-3 w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Preferred airline"
                  value={flightCompany}
                  onChange={(e) => setFlightCompany(e.target.value)}
                />
                {showErrors && !flightCompany.trim() && (
                  <Error>Please provide the airline</Error>
                )}
              </div>
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
              <div className="space-y-2">
                <input
                  className="mt-3 w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Hotel brand or property"
                  value={accommodationCompany}
                  onChange={(e) => setAccommodationCompany(e.target.value)}
                />
                {showErrors && !accommodationCompany.trim() && (
                  <Error>Please provide the hotel or brand</Error>
                )}
              </div>
            )}
          </Field>

          <Field label="Other useful requests or details">
            <textarea
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          <Field label="Summary">
            <div className="space-y-2 rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4 text-sm text-[#0b1930]">
              <SummaryRow label="Destination" value={location || "—"} />
              <SummaryRow
                label="Dates"
                value={
                  travelDates?.from && travelDates?.to
                    ? `${format(travelDates.from, "PPP")} – ${format(travelDates.to, "PPP")}`
                    : "—"
                }
              />
              <SummaryRow
                label="Trip type"
                value={tripType ? TRIP_TYPE_LABELS[tripType] : "—"}
              />
              <SummaryRow
                label="Travelers"
                value={`${adults} adult${adults !== 1 ? "s" : ""}${childrenCount ? `, ${childrenCount} child${childrenCount !== 1 ? "ren" : ""}` : ""}${infants ? `, ${infants} infant${infants !== 1 ? "s" : ""}` : ""}`}
              />
              <SummaryRow
                label="Budget"
                value={`€${budgetAmount.toLocaleString()}`}
              />
              <SummaryRow
                label="Experiences"
                value={
                  experiencePrefs.length ? experiencePrefs.join(", ") : "—"
                }
              />
              <SummaryRow
                label="Flights"
                value={
                  flightPrefs.length
                    ? `${flightPrefs.join(", ")}${flightCompany ? ` (Airline: ${flightCompany})` : ""}`
                    : "—"
                }
              />
              <SummaryRow
                label="Accommodations"
                value={
                  accommodationPrefs.length
                    ? `${accommodationPrefs.join(", ")}${accommodationCompany ? ` (Hotel: ${accommodationCompany})` : ""}`
                    : "—"
                }
              />
              <SummaryRow label="Notes" value={otherDetails || "—"} />
            </div>
          </Field>

          {!isSignedIn && (
            <>
              <Field
                label={
                  <span className="flex items-center gap-1">
                    Your name <span className="text-red-500">*</span>
                  </span>
                }
              >
                <input
                  className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
                {showSubmitErrors && !trimmedContactName && (
                  <Error>Your name cannot be empty</Error>
                )}
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
                  className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                {showSubmitErrors && !trimmedContactEmail && (
                  <Error>Email cannot be empty</Error>
                )}
                {showSubmitErrors && trimmedContactEmail && !emailValid && (
                  <Error>Please enter a valid email</Error>
                )}
              </Field>

              <Field label="Phone">
                <input
                  className="w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
                {showSubmitErrors && contactPhone && !phoneValid && (
                  <Error>Enter a valid phone number</Error>
                )}
              </Field>
            </>
          )}

          {isSignedIn && (
            <div className="rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4 text-sm text-[#3d4a68]">
              We’ll use your account contact details on file. Sign in to update
              them if needed.
            </div>
          )}
        </div>
      )}

      <footer className="mt-10 flex items-center justify-between gap-3">
        <div className="flex-1">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              className="cursor-pointer text-sm font-semibold text-[#0b1930] hover:text-blue-600"
            >
              ← Back
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={next}
              variant="ghost"
              className="cursor-pointer text-sm font-semibold text-blue-500 hover:text-blue-600"
            >
              Continue →
            </Button>
          ) : (
            <Button
              type="submit"
              className="cursor-pointer rounded-full border border-blue-500 bg-blue-500 px-6 text-white shadow-md hover:bg-[#1e55d3]"
            >
              Get my custom trip plan
            </Button>
          )}
        </div>
      </footer>
    </>
  );

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
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/")}
                className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back to home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#0b1930]">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            Your dream escape
          </p>
          <h1 className="text-3xl font-bold text-[#0b1930]">
            Tell us your travel preferences
          </h1>
          <p className="text-base text-[#3d4a68]">
            Share your destination, dates, and the vibe you want. We will craft
            a custom proposal around you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {isFinalStep ? (
            <form
              onSubmit={submit}
              className="rounded-2xl bg-white px-6 py-10 shadow-xl h-full"
            >
              {cardContent}
            </form>
          ) : (
            <div className="rounded-2xl bg-white px-6 py-10 shadow-xl h-full">
              {cardContent}
            </div>
          )}
          <div className="rounded-2xl border border-[#e7eaf3] bg-white shadow-xl overflow-hidden h-full">
            <div className="relative h-full min-h-[620px]">
              <Image
                src={stepImage.src}
                alt={stepImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#3d4a68]">{label}</span>
      <span className="font-semibold text-[#0b1930] text-right">{value}</span>
    </div>
  );
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
    <div className="flex flex-col gap-3">
      <Counter label="Adults" value={adults} min={1} onChange={setAdults} />
      <Counter
        label="Children"
        value={childrenCount}
        min={0}
        onChange={setChildrenCount}
      />
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
        <p className="text-xs text-gray-500">
          {min > 0 ? "Required" : "Optional"}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-auto">
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
