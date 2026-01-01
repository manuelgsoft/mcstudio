import type { Metadata } from "next";

import QuestionnairePage from "@/pages/QuestionnairePage";

export const metadata: Metadata = {
  title: "Questionnaire | MC Studio",
  description: "Answer a few quick questions to design your trip.",
};

export default function Questionnaire() {
  return <QuestionnairePage />;
}
