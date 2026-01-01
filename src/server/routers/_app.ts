import { questionnaireResponseRouter } from "./questionnaireResponse";
import { router } from "../trpc/trpc";

export const appRouter = router({
  questionnaireResponse: questionnaireResponseRouter,
});

export type AppRouter = typeof appRouter;
