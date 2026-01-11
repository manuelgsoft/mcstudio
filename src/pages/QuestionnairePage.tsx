"use client";

import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
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
import { ALL_COUNTRIES } from "@/utils/data";
import { trpc } from "@/utils/trpc";
import { DateRange } from "react-day-picker";

type TripType = "individual" | "couple" | "family" | "group";

const TRIP_TYPE_LABELS: Record<TripType, string> = {
  individual: "Individual travel",
  couple: "Couple's trip",
  family: "Family trip",
  group: "Group trip",
};

const STEP_DETAILS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Itinerary" },
  { id: 3, label: "Budget" },
  { id: 4, label: "Preferences" },
  { id: 5, label: "Contact" },
  { id: 6, label: "Submit" },
];

const STEP_IMAGES: Record<number, { src: string; alt: string }> = {
  1: {
    src: "https://images.unsplash.com/photo-1553697388-94e804e2f0f6?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Traveler overlooking mountains at sunrise",
  },
  2: {
    src: "https://images.unsplash.com/photo-1504598318550-17eba1008a68?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Couple enjoying a scenic sunset over the sea",
  },
  3: {
    src: "https://images.unsplash.com/photo-1637169797848-12431f1d355c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Airplane wing flying above the clouds",
  },
  4: {
    src: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Cozy hotel lobby with warm lighting",
  },
  5: {
    src: "https://images.unsplash.com/photo-1616422403639-282145aa3e73?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Traveler checking messages by the window",
  },
  6: {
    src: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=775&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Traveler using a phone with a map",
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

  const locationFromSearch = searchParams?.get("location") ?? "";
  const tripTypeFromSearch = isTripType(searchParams?.get("tripType") ?? "")
    ? (searchParams?.get("tripType") as TripType)
    : undefined;

  const initialStep = locationFromSearch && tripTypeFromSearch ? 2 : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const TOTAL_STEPS = STEP_DETAILS.length;

  const datesFromSearch = useMemo(() => {
    const startRaw = searchParams?.get("startDate");
    const endRaw = searchParams?.get("endDate");

    const parseDate = (raw: string | null) => {
      if (!raw) return undefined;
      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    };

    const start = parseDate(startRaw as string);
    const end = parseDate(endRaw as string);
    if (!start && !end) return undefined;
    return { from: start, to: end };
  }, [searchParams]);

  const [location, setLocation] = useState(locationFromSearch);
  const [travelDates, setTravelDates] = useState<DateRange | undefined>(
    datesFromSearch,
  );
  const [knowsExactDates, setKnowsExactDates] = useState(true);
  const [estimatedDepartureDate, setEstimatedDepartureDate] = useState<
    Date | undefined
  >(undefined);
  const [estimatedDurationDays, setEstimatedDurationDays] = useState(7);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState(locationFromSearch);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [estimatedDateOpen, setEstimatedDateOpen] = useState(false);

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [showSubmitErrors, setShowSubmitErrors] = useState(false);

  const createResponse = trpc.questionnaireResponse.create.useMutation({
    onSuccess: () => {
      setSubmitError(null);
      setSubmitted(true);
    },
    onError: () => {
      setSubmitError("We couldn't submit your request. Please try again.");
    },
  });

  const isSignedIn = false; // TODO: replace with real auth state
  const trimmedContactName = contactName.trim();
  const trimmedContactEmail = contactEmail.trim();
  const trimmedContactPhone = contactPhone.trim();
  const emailValid = trimmedContactEmail
    ? EMAIL_REGEX.test(trimmedContactEmail)
    : false;
  const phoneValid =
    !trimmedContactPhone || /^\+?[0-9 ()-]{7,20}$/.test(trimmedContactPhone);
  const tripDescriptor = tripType
    ? TRIP_TYPE_LABELS[tripType].toLowerCase()
    : "custom trip";
  const dynamicTitle = location
    ? `Your ${tripDescriptor} to ${location}`
    : `Plan your ${tripDescriptor}`;
  const stepImage = STEP_IMAGES[currentStep] ?? STEP_IMAGES[1];
  const isFinalStep = currentStep === TOTAL_STEPS;

  const filteredDestinations = useMemo(() => {
    if (!locationQuery.trim()) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((d) =>
      d.toLowerCase().includes(locationQuery.toLowerCase()),
    );
  }, [locationQuery]);
  const datesOutOfOrder = !!(
    knowsExactDates &&
    travelDates?.from &&
    travelDates?.to &&
    travelDates.to <= travelDates.from
  );

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

    if (step === 1) return location.trim() && tripType;
    if (step === 2) {
      const hasExactDates =
        knowsExactDates && travelDates?.from && travelDates?.to;
      const hasEstimatedDates =
        !knowsExactDates &&
        estimatedDepartureDate &&
        estimatedDurationDays >= 1;
      return (
        (hasExactDates || hasEstimatedDates) && adults >= 1 && !datesOutOfOrder
      );
    }
    if (step === 4) return !needsFlightCompany && !needsAccommodationCompany;
    if (step === 5) {
      if (isSignedIn) return true;
      return emailValid && trimmedContactName && phoneValid;
    }
    return true;
  }

  function next() {
    setShowErrors(false);
    setShowSubmitErrors(false);
    if (!validateStep(currentStep)) {
      if (currentStep === 5) setShowSubmitErrors(true);
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
    setSubmitError(null);
    if (!validateStep(currentStep)) {
      if (currentStep === TOTAL_STEPS) setShowSubmitErrors(true);
      setShowErrors(true);
      return;
    }
    const hasExactDates =
      knowsExactDates && travelDates?.from && travelDates?.to;
    const hasEstimatedDates =
      !knowsExactDates && estimatedDepartureDate && estimatedDurationDays >= 1;

    if (
      (!hasExactDates && !hasEstimatedDates) ||
      !tripType ||
      datesOutOfOrder
    ) {
      setShowSubmitErrors(true);
      setShowErrors(true);
      return;
    }

    const payload = {
      location,
      knowsExactDates,
      startDate: hasExactDates ? (travelDates?.from ?? null) : null,
      endDate: hasExactDates ? (travelDates?.to ?? null) : null,
      estimatedDepartureDate: hasEstimatedDates
        ? (estimatedDepartureDate ?? null)
        : null,
      estimatedDurationDays: hasEstimatedDates ? estimatedDurationDays : null,
      tripType,
      adults,
      children: childrenCount,
      infants,
      budgetAmount,
      experiences: experiencePrefs,
      flightPrefs,
      flightCompany: flightCompany.trim() || null,
      accommodationPrefs,
      accommodationCompany: accommodationCompany.trim() || null,
      otherDetails: otherDetails.trim() || null,
      contactName: trimmedContactName,
      contactEmail: trimmedContactEmail,
      contactPhone: trimmedContactPhone || null,
    };

    createResponse.mutate(payload);
  }

  const cardContent = (
    <div className="flex h-[640px] flex-col">
      <header className="mb-8 space-y-5">
        <Stepper
          currentStep={currentStep}
          onStepClick={(step) => {
            setShowErrors(false);
            setShowSubmitErrors(false);
            setCurrentStep(step);
          }}
        />
        <h1 className="text-center text-3xl font-bold">
          {STEP_DETAILS[currentStep - 1]?.label ?? "Details"}
        </h1>
      </header>

      <div className="flex-1 space-y-8 overflow-y-auto pr-1">
        {currentStep === 1 && (
          <div className="space-y-8">
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
                    className="h-10 w-full justify-start gap-3 cursor-pointer text-sm"
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
                  Type of trip <span className="text-red-500">*</span>
                </span>
              }
            >
              <RadioGroup
                options={TRIP_TYPE_LABELS}
                value={tripType}
                onChange={(v) => setTripType(v as TripType)}
              />
              {showErrors && !tripType && (
                <Error>Please select a trip type</Error>
              )}
            </Field>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <Field label="Do you know your travel dates?">
              <RadioGroup
                options={{
                  yes: "Yes, I know the dates",
                  no: "Not exactly / flexible",
                }}
                value={knowsExactDates ? "yes" : "no"}
                onChange={(v) => setKnowsExactDates(v === "yes")}
              />
            </Field>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                {knowsExactDates ? (
                  <div className="space-y-6">
                    <Field
                      label={
                        <span className="flex items-center gap-1">
                          Start date <span className="text-red-500">*</span>
                        </span>
                      }
                    >
                      <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-start gap-3 cursor-pointer text-sm"
                          >
                            <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                            {travelDates?.from
                              ? format(travelDates.from, "PPP")
                              : "Select start"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            defaultMonth={travelDates?.from}
                            selected={travelDates?.from}
                            onSelect={(date) => {
                              setTravelDates((prev) => ({
                                from: date ?? undefined,
                                to: prev?.to,
                              }));
                              if (date) setStartDateOpen(false);
                            }}
                            showOutsideDays={false}
                            className="bg-blue-500"
                            components={{
                              DayButton: (props) => (
                                <CalendarDayButton {...props} />
                              ),
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {showErrors && !travelDates?.from && (
                        <Error>Please select a start date</Error>
                      )}
                    </Field>

                    <Field
                      label={
                        <span className="flex items-center gap-1">
                          End date <span className="text-red-500">*</span>
                        </span>
                      }
                    >
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-start gap-3 cursor-pointer text-sm"
                          >
                            <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                            {travelDates?.to
                              ? format(travelDates.to, "PPP")
                              : "Select end"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            defaultMonth={travelDates?.to ?? travelDates?.from}
                            selected={travelDates?.to}
                            onSelect={(date) => {
                              setTravelDates((prev) => ({
                                from: prev?.from,
                                to: date ?? undefined,
                              }));
                              if (date) setEndDateOpen(false);
                            }}
                            showOutsideDays={false}
                            className="bg-blue-500"
                            components={{
                              DayButton: (props) => (
                                <CalendarDayButton {...props} />
                              ),
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {showErrors && !travelDates?.to && (
                        <Error>Please select an end date</Error>
                      )}
                      {showErrors && datesOutOfOrder && travelDates?.to && (
                        <Error>End date must be after the start date</Error>
                      )}
                    </Field>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    <Field
                      label={
                        <span className="flex items-center gap-1">
                          Estimated departure date{" "}
                          <span className="text-red-500">*</span>
                        </span>
                      }
                    >
                      <Popover
                        open={estimatedDateOpen}
                        onOpenChange={setEstimatedDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-start gap-3 cursor-pointer text-sm"
                          >
                            <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                            {estimatedDepartureDate
                              ? format(estimatedDepartureDate, "PPP")
                              : "Select a departure"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            defaultMonth={estimatedDepartureDate}
                            selected={estimatedDepartureDate}
                            onSelect={(date) => {
                              setEstimatedDepartureDate(date ?? undefined);
                              if (date) setEstimatedDateOpen(false);
                            }}
                            showOutsideDays={false}
                            className="bg-blue-500"
                            components={{
                              DayButton: (props) => (
                                <CalendarDayButton {...props} />
                              ),
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {showErrors && !estimatedDepartureDate && (
                        <Error>Please select an estimated departure</Error>
                      )}
                    </Field>

                    <Field
                      label={
                        <span className="flex items-center gap-1">
                          Estimated duration (days){" "}
                          <span className="text-red-500">*</span>
                        </span>
                      }
                    >
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={estimatedDurationDays}
                        onChange={(e) =>
                          setEstimatedDurationDays(() => {
                            const parsed = Number(e.target.value);
                            return Number.isNaN(parsed) ? 0 : parsed;
                          })
                        }
                      />
                      {showErrors && estimatedDurationDays < 1 && (
                        <Error>Please enter a duration of at least 1 day</Error>
                      )}
                    </Field>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Field label="Who's traveling?">
                  <PeopleCounters
                    adults={adults}
                    childrenCount={childrenCount}
                    infants={infants}
                    setAdults={setAdults}
                    setChildrenCount={setChildrenCount}
                    setInfants={setInfants}
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Field label="Estimated budget">
              <div className="space-y-2">
                <div className="rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-3 py-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-[#0b1930]">
                      Suggested
                    </span>
                    <span className="text-lg font-bold text-[#0b1930]">
                      €{budgetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <input
                      type="range"
                      min={100}
                      max={10000}
                      step={100}
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(Number(e.target.value))}
                      className="h-[2px] w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-[#3d4a68]">
                      <span>€100</span>
                      <span>€5050</span>
                      <span>+€10,000</span>
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

        {currentStep === 4 && (
          <div className="grid gap-5 lg:grid-cols-2">
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
                <div className="space-y-2">
                  <input
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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

            <Field
              label="Other useful requests or details"
              className="lg:col-span-2"
            >
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows={3}
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                placeholder="Share any additional context for your trip"
              />
            </Field>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-5">
            {!isSignedIn && (
              <>
                <div className="flex items-start justify-between gap-3 rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#0b1930]">
                      Prefer to use your account?
                    </p>
                    <p className="text-xs text-[#3d4a68]">
                      Sign in to sync details and track your request. You can
                      also continue with email.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/signin")}
                    className="cursor-pointer border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    Sign in
                  </Button>
                </div>

                <Field
                  label={
                    <span className="flex items-center gap-1">
                      Your name <span className="text-red-500">*</span>
                    </span>
                  }
                >
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  {showSubmitErrors && !trimmedContactName && (
                    <Error>Your name is required</Error>
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
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                  {showSubmitErrors && !trimmedContactEmail && (
                    <Error>Email is required</Error>
                  )}
                  {showSubmitErrors && trimmedContactEmail && !emailValid && (
                    <Error>Please enter a valid email</Error>
                  )}
                </Field>

                <Field label="Phone">
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                  {showSubmitErrors && trimmedContactPhone && !phoneValid && (
                    <Error>Please enter a valid phone number</Error>
                  )}
                </Field>
              </>
            )}

            {isSignedIn && (
              <div className="rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4 text-sm text-[#3d4a68]">
                We’ll use your account contact details on file. Sign in to
                update them if needed.
              </div>
            )}
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-5">
            <Field label="Summary">
              <div className="rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] px-4 py-4 text-sm text-[#0b1930]">
                <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1">
                  <SummaryRow label="Destination" value={location || "—"} />
                  <SummaryRow
                    label="Dates"
                    value={
                      knowsExactDates && travelDates?.from && travelDates?.to
                        ? `${format(travelDates.from, "PPP")} – ${format(travelDates.to, "PPP")}`
                        : !knowsExactDates && estimatedDepartureDate
                          ? `Around ${format(estimatedDepartureDate, "PPP")} for ~${estimatedDurationDays >= 1 ? `${estimatedDurationDays} day${estimatedDurationDays === 1 ? "" : "s"}` : "—"}`
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
                  <SummaryRow
                    label="Contact email"
                    value={trimmedContactEmail || "—"}
                  />
                </div>
              </div>
            </Field>
          </div>
        )}
      </div>

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
              disabled={createResponse.isPending}
              className="cursor-pointer rounded-full border border-blue-500 bg-blue-500 px-6 text-white shadow-md hover:bg-[#1e55d3]"
            >
              {createResponse.isPending
                ? "Submitting..."
                : "Get my custom trip plan"}
            </Button>
          )}
        </div>
      </footer>
      {submitError && (
        <div className="mt-4">
          <Error>{submitError}</Error>
        </div>
      )}
    </div>
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
            Let’s plan!
          </p>
          <h1 className="text-3xl font-bold text-[#0b1930]">{dynamicTitle}</h1>
          <p className="text-base text-[#3d4a68]">
            Share your destination, timing, and preferences so we can craft a
            custom proposal around you.
          </p>
        </div>

        <div className="grid gap-8 items-stretch lg:grid-cols-[1.2fr_0.8fr]">
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

function Stepper({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="relative flex items-start justify-between gap-4">
      <div className="absolute left-0 right-0 top-5 border-t border-dashed border-[#cdd9f7]" />
      {STEP_DETAILS.map((step) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;
        const isClickable = isComplete;
        const content = (
          <>
            <span
              className={`mb-2 text-sm font-semibold ${
                isComplete
                  ? "text-blue-700"
                  : isActive
                    ? "text-[#0b1930]"
                    : "text-[#3d4a68]"
              }`}
            >
              {step.label}
            </span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                isComplete
                  ? "border-blue-500 bg-blue-500 text-white"
                  : isActive
                    ? "border-blue-500 bg-white text-blue-500"
                    : "border-[#d2d7e2] bg-white text-[#3d4a68]"
              }`}
            >
              {isComplete ? "✓" : step.id}
            </div>
          </>
        );
        return (
          <div
            key={step.id}
            className="relative z-10 flex flex-1 flex-col items-center text-center"
          >
            {isClickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className="flex flex-col items-center text-center focus:outline-none cursor-pointer"
                aria-label={`Go to ${step.label}`}
              >
                {content}
              </button>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
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
          className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer text-sm ${
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
          className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer text-sm ${
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
    <div className="grid grid-cols-1 gap-2">
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
    <div className="flex items-center gap-2 rounded-xl border border-[#e7eaf3] bg-white px-2 py-2">
      <div className="leading-tight">
        <p className="text-sm font-semibold text-[#0b1930]">{label}</p>
        <p className="text-[11px] text-gray-500">
          {min > 0 ? "Required" : "Optional"}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={() => value > min && onChange(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7eaf3] text-base font-bold text-[#0b1930] transition hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer"
          aria-label={`Decrease ${label}`}
        >
          –
        </button>
        <span className="w-7 text-center text-sm font-semibold text-[#0b1930]">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7eaf3] text-base font-bold text-[#0b1930] transition hover:-translate-y-0.5 hover:border-blue-300 cursor-pointer"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
