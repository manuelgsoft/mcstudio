import { z } from "zod";

import { publicProcedure, router } from "../trpc/trpc";

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
      return ctx.db.questionnaireResponse.create({
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
    }),
});
