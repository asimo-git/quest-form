import { useState } from "react";
import { Field, Input, Text, VStack } from "@chakra-ui/react";
import type { PageContent } from "../interfaces";
import { FORM_MESSAGES } from "../constants";
import { GlowButton } from "./GlowButton";
import { QuestionIcon } from "./QuestionIcon";
import { ScaleFade } from "@chakra-ui/transition";

interface QuestFormProps {
  stepData: PageContent;
  onNext: () => void;
}

export function QuestForm({ stepData, onNext }: QuestFormProps) {
  const [inputError, setInputError] = useState<string | null>(null);
  const [hintStep, setHintStep] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const normalizedAnswer =
      formData.get("answer")?.toString().trim().toLowerCase() ?? "";

    if (!normalizedAnswer) {
      setInputError(FORM_MESSAGES.emptyInput);
      return;
    }

    const isCorrect = stepData.solution?.some(
      (s) => s.trim().toLowerCase() === normalizedAnswer
    );

    if (isCorrect) {
      e.currentTarget.reset();
      setInputError(null);
      onNext();
    } else {
      if (stepData.errorMessages && stepData.errorMessages.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * stepData.errorMessages.length
        );
        setInputError(stepData.errorMessages[randomIndex]);
      } else {
        setInputError(FORM_MESSAGES.defaultIncorrectAnswer);
      }
    }
  };

  const handleHintClick = () => {
    setHintStep((prev) => (prev === null ? 0 : prev + 1));
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="4" align="center">
        <Field.Root invalid={!!inputError} width="400px" maxWidth="95vw">
          <Input
            size="lg"
            name="answer"
            onChange={() => inputError && setInputError(null)}
            placeholder={FORM_MESSAGES.inputPlaceholder}
          />
          <Field.ErrorText textStyle="lg" mx="auto">
            {inputError}
          </Field.ErrorText>
        </Field.Root>

        {stepData.buttonText ? (
          <GlowButton type="submit">{stepData.buttonText}</GlowButton>
        ) : (
          <button
            type="submit"
            style={{ display: "none" }}
            aria-hidden="true"
          />
        )}

        {stepData.hints && (
          <>
            <VStack gap="px" align="center" color="var(--hint-color)">
              <GlowButton
                p="0"
                onClick={handleHintClick}
                disabled={hintStep === stepData.hints.length - 1}
              >
                <QuestionIcon />
              </GlowButton>
              {hintStep !== null &&
                stepData.hints.slice(0, hintStep + 1).map((hint, index) => (
                  <ScaleFade
                    initialScale={0.9}
                    key={index}
                    in
                    transition={{ enter: { duration: 0.8 } }}
                  >
                    <Text textStyle="xl">{hint}</Text>
                  </ScaleFade>
                ))}
            </VStack>
          </>
        )}
      </VStack>
    </form>
  );
}
