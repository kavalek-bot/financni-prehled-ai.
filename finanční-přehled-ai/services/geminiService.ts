
import { GoogleGenAI } from "@google/genai";
import { BudgetStatus, MonthlySummary, Transaction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateContentWithBackoff = async (prompt: string) => {
    let retries = 3;
    while (retries > 0) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("Gemini API call failed:", error);
            retries--;
            if (retries === 0) {
                throw error;
            }
            await new Promise(res => setTimeout(res, 1000 * (4 - retries))); // Exponential backoff
        }
    }
    return "Omlouvám se, při komunikaci s AI nastala chyba.";
};

export const getFinancialAdvice = async (budgetStatus: BudgetStatus[], monthlySummary: MonthlySummary) => {
    const prompt = `
        Jsi finanční poradce. Tvá odpověď musí být v češtině.
        Analyzuj následující finanční data za aktuální měsíc a poskytni stručné, srozumitelné a akční rady.
        Zaměř se na kategorie, kde dochází k překročení rozpočtu nebo se k němu blíží.
        Odpověď formátuj jako odrážkový seznam. Buď pozitivní a nápomocný.

        Měsíční shrnutí:
        - Příjmy: ${monthlySummary.income.toLocaleString('cs-CZ')} Kč
        - Výdaje: ${monthlySummary.expenses.toLocaleString('cs-CZ')} Kč
        - Zůstatek: ${monthlySummary.balance.toLocaleString('cs-CZ')} Kč

        Stav rozpočtu podle kategorií:
        ${budgetStatus.map(b => `- ${b.category}: Utraceno ${b.spent.toLocaleString('cs-CZ')} Kč z limitu ${b.limit.toLocaleString('cs-CZ')} Kč (${b.status})`).join('\n')}

        Tvoje doporučení:
    `;

    return generateContentWithBackoff(prompt);
};

export const answerUserQuery = async (query: string, transactions: Transaction[], budgets: BudgetStatus[]) => {
    const simplifiedTransactions = transactions.map(({ date, amount, description, category, type }) => 
        `${date}, ${type}, ${category}, ${amount} Kč, ${description}`
    ).join('\n');

    const prompt = `
        Jsi AI finanční asistent. Tvá odpověď musí být v češtině. Odpověz na dotaz uživatele na základě poskytnutých dat o transakcích a rozpočtech.
        Buď stručný a přesný. Pokud data neobsahují odpověď, řekni, že informaci nemáš.
        Neposkytuj rady, pouze odpovídej na otázku.

        Data o transakcích (Datum, Typ, Kategorie, Částka, Popis):
        ${simplifiedTransactions}

        Data o rozpočtech:
        ${budgets.map(b => `${b.category}: limit ${b.limit} Kč, utraceno ${b.spent} Kč`).join('\n')}

        Uživatelský dotaz: "${query}"

        Tvoje odpověď:
    `;

    return generateContentWithBackoff(prompt);
};
