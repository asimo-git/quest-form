import { LS_KEY } from "./constants";
import type { PageContent } from "./interfaces";

export async function loadQuestJSON(): Promise<PageContent[]> {
    const res = await fetch("/quest.json");

    if (!res.ok) {
        throw new Error(`Loading error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
        throw new Error(
            "The JSON format is invalid: an array of objects was expected.",
        );
    }

    const isValid = data.every((item) => item.text != null);

    if (!isValid) {
        throw new Error(
            "The JSON format is invalid: required fields are missing.",
        );
    }

    return data;
}

export function getStepFromLS() {
    const savedStep = localStorage.getItem(LS_KEY);

    if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (!isNaN(parsedStep) && parsedStep >= 0) {
            return parsedStep;
        }
    }

    return 0;
}
