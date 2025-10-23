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

function App() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answer, setAnswer] = useState("");
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
            : "Неизвестная ошибка при загрузке данных"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuest();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = content[step];

    if (!current.solution) {
      setStep((prev) => (prev < content.length - 1 ? prev + 1 : prev));
    } else {
      const normalizedAnswer = answer.trim().toLowerCase();
      const isCorrect = current.solution.some(
        (s) => s.trim().toLowerCase() === normalizedAnswer
      );

      if (isCorrect) {
        setStep((prev) => (prev < content.length - 1 ? prev + 1 : prev));
        setAnswer("");
        setInputError(null);
      } else {
        if (current.errorMessages && current.errorMessages.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * current.errorMessages.length
          );
          setInputError(current.errorMessages[randomIndex]);
        } else {
          setInputError("Неверный ответ");
        }
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
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder="Ваша догадка"
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
                onClick={(e) => handleSubmit(e)}
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
