import { useEffect, useState } from "react";
import "./App.css";
import {
  Center,
  Field,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { PageContent } from "./interfaces";
import { getStepFromLS, loadQuestJSON } from "./utils";
import { FORM_MESSAGES } from "./constants";
import { SlideFade } from "@chakra-ui/transition";
import { GlowButton } from "./components/GlowButton";

function App() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [step, setStep] = useState(getStepFromLS());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inputError, setInputError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const current = content[step];
    const formData = new FormData(e.currentTarget);
    const normalizedAnswer =
      formData.get("answer")?.toString().trim().toLowerCase() ?? "";

    if (!normalizedAnswer) {
      setInputError(FORM_MESSAGES.emptyInput);
      return;
    }

    const isCorrect = current?.solution?.some(
      (s) => s.trim().toLowerCase() === normalizedAnswer
    );

    if (isCorrect) {
      setStep((prev) => (prev < content.length - 1 ? prev + 1 : 0));
      e.currentTarget.reset();
      setInputError(null);
    } else {
      if (current.errorMessages && current.errorMessages.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * current.errorMessages.length
        );
        setInputError(current.errorMessages[randomIndex]);
      } else {
        setInputError(FORM_MESSAGES.defaultIncorrectAnswer);
      }
    }
  };

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" animationDuration="0.8s" />
      </Center>
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <SlideFade key={step} in reverse transition={{ enter: { duration: 1 } }}>
        <VStack gap="3" align="stretch" maxW="600px">
          <Heading size="2xl">{content[step].title}</Heading>
          <Text textStyle="2xl">{content[step].text}</Text>
          {content[step].solution ? (
            <form onSubmit={handleSubmit}>
              <VStack gap="4" align="stretch">
                <Field.Root invalid={!!inputError}>
                  <Input
                    size="lg"
                    name="answer"
                    onChange={() => {
                      if (inputError) setInputError(null);
                    }}
                    placeholder={FORM_MESSAGES.inputPlaceholder}
                  />
                  <Field.ErrorText textStyle="lg">{inputError}</Field.ErrorText>
                </Field.Root>

                {content[step].buttonText ? (
                  <GlowButton type="submit">
                    {content[step].buttonText}
                  </GlowButton>
                ) : (
                  <button
                    type="submit"
                    style={{ display: "none" }}
                    aria-hidden="true"
                  />
                )}
              </VStack>
            </form>
          ) : (
            content[step].buttonText && (
              <Center>
                <GlowButton
                  type="submit"
                  onClick={() =>
                    setStep((prev) =>
                      prev < content.length - 1 ? prev + 1 : 0
                    )
                  }
                >
                  {content[step].buttonText}
                </GlowButton>
              </Center>
            )
          )}
        </VStack>
      </SlideFade>
    </>
  );
}

export default App;
