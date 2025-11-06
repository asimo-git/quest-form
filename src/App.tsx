import { useEffect, useState } from "react";
import "./App.css";
import { Center, Heading, Text, VStack, Spinner } from "@chakra-ui/react";
import { SlideFade } from "@chakra-ui/transition";
import type { PageContent } from "./interfaces";
import { getStepFromLS, loadQuestJSON } from "./utils";
import { GlowButton } from "./components/GlowButton";
import { QuestForm } from "./components/QuestForm";

function App() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [step, setStep] = useState(getStepFromLS());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuest = async () => {
      try {
        const data = await loadQuestJSON();
        setContent(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error while loading data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, []);

  useEffect(() => {
    localStorage.setItem("questStep", String(step));
  }, [step]);

  const goNext = () =>
    setStep((prev) => (prev < content.length - 1 ? prev + 1 : 0));

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" animationDuration="0.8s" />
      </Center>
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const stepData = content[step];

  return (
    <SlideFade key={step} in reverse transition={{ enter: { duration: 1 } }}>
      <VStack gap="3" align="stretch" maxW="600px">
        <Heading size="2xl">{stepData.title}</Heading>
        <Text textStyle="2xl">{stepData.text}</Text>

        {stepData.solution ? (
          <QuestForm stepData={stepData} onNext={goNext} />
        ) : (
          stepData.buttonText && (
            <Center>
              <GlowButton type="button" onClick={goNext}>
                {stepData.buttonText}
              </GlowButton>
            </Center>
          )
        )}
      </VStack>
    </SlideFade>
  );
}

export default App;
