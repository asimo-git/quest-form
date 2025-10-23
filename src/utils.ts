import type { PageContent } from "./interfaces";

export async function loadQuestJSON(): Promise<PageContent[]> {
  const res = await fetch("/quest.json");

  if (!res.ok) {
    throw new Error(`Ошибка загрузки: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Формат JSON неверный: ожидался массив объектов.");
  }

  const isValid = data.every((item) => item.title != null && item.text != null);

  if (!isValid) {
    throw new Error("Формат JSON неверный: не хватает обязательных полей");
  }

  return data;
}
