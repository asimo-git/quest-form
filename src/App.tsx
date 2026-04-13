import { useEffect, useState } from "react";
import "./App.css";
import {
    Center,
    Heading,
    Text,
    VStack,
    Spinner,
    Image,
    Box,
} from "@chakra-ui/react";
import { SlideFade } from "@chakra-ui/transition";
import type { PageContent } from "./interfaces";
import { getStepFromLS, loadQuestJSON } from "./utils";
import { GlowButton } from "./components/GlowButton";
import { QuestForm } from "./components/QuestForm";
import { LS_KEY } from "./constants";

function App() {
    const [content, setContent] = useState<PageContent[]>([]);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadQuest = async () => {
            try {
                const data = await loadQuestJSON();
                setContent(data);

                const saved = getStepFromLS();
                setStep(saved < data.length ? saved : 0);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Unknown error while loading data",
                );
            } finally {
                setLoading(false);
            }
        };

        loadQuest();
    }, []);

    const goNext = () => {
        const next = step < content.length - 1 ? step + 1 : 0;
        localStorage.setItem(LS_KEY, String(next));
        setStep(next);
    };

    if (loading)
        return (
            <Center h="100vh">
                <Spinner size="xl" animationDuration="0.8s" />
            </Center>
        );

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const stepData = content[step];

    return (
        <SlideFade
            key={step}
            in
            reverse
            transition={{ enter: { duration: 1 } }}
        >
            <VStack gap="3" align="stretch" maxW="600px">
                {stepData.title && (
                    <Heading size="2xl">{stepData.title}</Heading>
                )}
                <Text textStyle="2xl">{stepData.text}</Text>
                {stepData.image && (
                    <Box width="100%" display="flex" justifyContent="center">
                        <Image
                            src={stepData.image}
                            maxWidth={{ base: "calc(100% - 32px)", md: "100%" }}
                            maxHeight="50vh"
                            width={{ base: "calc(100% - 32px)", md: "auto" }}
                            height="auto"
                            objectFit="contain"
                            borderRadius="md"
                        />
                    </Box>
                )}

                {stepData.solution ? (
                    <QuestForm key={step} stepData={stepData} onNext={goNext} />
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
