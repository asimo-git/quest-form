import { useEffect, useState } from "react";
import "./App.css";
import {
  Button,
  Center,
  Field,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { PageContent } from "./interfaces";
import { loadQuestJSON } from "./utils";
import { FORM_MESSAGES } from "./constants";

function App() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [step, setStep] = useState(0);
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
      setStep((prev) => (prev < content.length - 1 ? prev + 1 : prev));
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

  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <>
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
                <Button type="submit" rounded="full" variant="subtle" size="lg">
                  {content[step].buttonText}
                </Button>
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
              <Button
                rounded="full"
                variant="subtle"
                size="lg"
                maxW="300px"
                onClick={() =>
                  setStep((prev) =>
                    prev < content.length - 1 ? prev + 1 : prev
                  )
                }
              >
                {content[step].buttonText}
              </Button>
            </Center>
          )
        )}
      </VStack>
    </>
  );
}

export default App;
