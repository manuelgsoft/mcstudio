import { z } from "zod";
import { sendMail } from "@/utils/email";
import { publicProcedure, router } from "../trpc/trpc";
import { TRIP_TYPE_LABELS, TripType } from "@/utils/data";

const optionalTrimmedString = z
  .string()
  .trim()
  .nullish()
  .transform((value) => (value ? value : null));

export const questionnaireResponseRouter = router({
  create: publicProcedure
    .input(
      z
        .object({
          location: z.string().trim().min(1),
          knowsExactDates: z.coerce.boolean(),
          startDate: z.coerce.date().optional().nullable(),
          endDate: z.coerce.date().optional().nullable(),
          estimatedDepartureDate: z.coerce.date().optional().nullable(),
          estimatedDurationDays: z.coerce
            .number()
            .int()
            .min(1)
            .optional()
            .nullable(),
          tripType: z.string().trim().min(1),
          adults: z.coerce.number().int().min(1),
          children: z.coerce.number().int().min(0),
          infants: z.coerce.number().int().min(0),
          budgetAmount: z.coerce.number().int().min(0),
          experiences: z.array(z.string()),
          flightPrefs: z.array(z.string()),
          flightCompany: optionalTrimmedString,
          accommodationPrefs: z.array(z.string()),
          accommodationCompany: optionalTrimmedString,
          otherDetails: optionalTrimmedString,
          contactName: z.string().trim().min(1),
          contactEmail: z.string().trim().email(),
          contactPhone: optionalTrimmedString,
          userId: z.coerce.number().int().optional(),
        })
        .superRefine((data, ctx) => {
          if (data.knowsExactDates) {
            if (!data.startDate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["startDate"],
                message: "Start date is required when you know your dates.",
              });
            }
            if (!data.endDate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "End date is required when you know your dates.",
              });
            }
          } else {
            if (!data.estimatedDepartureDate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["estimatedDepartureDate"],
                message:
                  "Estimated departure date is required when dates are flexible.",
              });
            }
            if (!data.estimatedDurationDays) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["estimatedDurationDays"],
                message:
                  "Estimated duration is required when dates are flexible.",
              });
            }
          }
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.questionnaireResponse.create({
        data: {
          location: input.location,
          knowsExactDates: input.knowsExactDates,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          estimatedDepartureDate: input.estimatedDepartureDate ?? null,
          estimatedDurationDays: input.estimatedDurationDays ?? null,
          tripType: input.tripType,
          adults: input.adults,
          children: input.children,
          infants: input.infants,
          budgetAmount: input.budgetAmount,
          experiences: input.experiences,
          flightPrefs: input.flightPrefs,
          flightCompany: input.flightCompany,
          accommodationPrefs: input.accommodationPrefs,
          accommodationCompany: input.accommodationCompany,
          otherDetails: input.otherDetails,
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          userId: input.userId ?? null,
        },
      });

      const summaryText = [
        `Location: ${input.location}`,
        `Exact Dates: ${input.knowsExactDates ? "Yes" : "No"}`,
        input.startDate ? `Start: ${input.startDate}` : null,
        input.endDate ? `End: ${input.endDate}` : null,
        input.estimatedDepartureDate
          ? `Estimated Departure: ${input.estimatedDepartureDate}`
          : null,
        input.estimatedDurationDays
          ? `Estimated Duration (days): ${input.estimatedDurationDays}`
          : null,
        `Trip type: ${TRIP_TYPE_LABELS[input.tripType as TripType]}`,
        `Adults: ${input.adults}`,
        `Children: ${input.children}`,
        `Infants: ${input.infants}`,
        `Budget: ${input.budgetAmount}€`,
        `Experiences: ${input.experiences.join(", ")}`,
        `Flight Preferences: ${input.flightPrefs.join(", ")}`,
        input.flightCompany ? `Flight Company: ${input.flightCompany}` : null,
        `Accommodation Preferences: ${input.accommodationPrefs.join(", ")}`,
        input.accommodationCompany
          ? `Accommodation Company: ${input.accommodationCompany}`
          : null,
        input.otherDetails ? `Other Details: ${input.otherDetails}` : null,
        `Contact Name: ${input.contactName}`,
        `Contact Email: ${input.contactEmail}`,
        input.contactPhone ? `Contact Phone: ${input.contactPhone}` : null,
        input.userId ? `User ID: ${input.userId}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await sendMail({
        to: process.env.EMAIL_ADDRESS as string,
        subject: `Trip Planning Request from ${input.contactName}: ${TRIP_TYPE_LABELS[input.tripType as TripType]} to ${input.location}`,
        text: summaryText,
      });

      await sendMail({
        to: input.contactEmail,
        subject: `Your Booking Confirmation & Trip Details For Your ${TRIP_TYPE_LABELS[input.tripType as TripType]} to ${input.location}`,
        text: `Thank you for placing your trust in us. We are pleased to confirm that your booking has been successfully completed. Below is a summary of your trip details for your reference:\n${summaryText}`,
      });

      return response;
    }),
});
