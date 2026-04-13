## Простая квест-форма с пошаговым переходом

Есть возможность добавлять изображения и подсказки.
Все необходимое закинуть в папку public: 
- основные данные в файле quest.json
- необходимые изображения
- можно заменить фон bg.jpg

Каждый шаг квеста состоит из: 
{
    title?: string;
    text: string;
    image?: string;
    solution?: string[];
    buttonText?: string;
    errorMessages?: string[];
    hints?: string[];
}
