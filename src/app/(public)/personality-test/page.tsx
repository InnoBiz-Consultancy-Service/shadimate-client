import { fetchQuestions } from "@/actions/public/personality-test/personality-test";
import PersonalityTest from "@/components/public/personality-test/PersonalityTest";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personality Test – primehalf",
  description:
    "Take the primehalf personality test and discover your relationship style.",
};

export default async function PersonalityTestPage() {
  const res = await fetchQuestions();

  return (
    <PersonalityTest
      questions={res.success && res.data ? res.data : []}
      fetchError={!res.success ? res.message : undefined}
    />
  );
}

// Comment added
