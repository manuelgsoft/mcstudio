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
      z.object({
        location: z.string().trim().min(1),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.questionnaireResponse.create({
        data: {
          location: input.location,
          startDate: input.startDate,
          endDate: input.endDate,
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
