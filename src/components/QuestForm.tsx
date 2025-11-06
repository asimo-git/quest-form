import { useState } from "react";
import { Field, Input, VStack } from "@chakra-ui/react";
import type { PageContent } from "../interfaces";
import { FORM_MESSAGES } from "../constants";
import { GlowButton } from "./GlowButton";

interface QuestFormProps {
  stepData: PageContent;
  onNext: () => void;
}

export function QuestForm({ stepData, onNext }: QuestFormProps) {
  const [inputError, setInputError] = useState<string | null>(null);

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

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="4" align="stretch">
        <Field.Root invalid={!!inputError}>
          <Input
            size="lg"
            name="answer"
            onChange={() => inputError && setInputError(null)}
            placeholder={FORM_MESSAGES.inputPlaceholder}
          />
          <Field.ErrorText textStyle="lg">{inputError}</Field.ErrorText>
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
      </VStack>
    </form>
  );
}
