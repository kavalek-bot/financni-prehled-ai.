import { GoogleGenAI } from "@google/genai";
import { BudgetStatus, MonthlySummary, Transaction } from '../types';

// --- NASTAVENÍ PRO GEMINI API ---
// Zde vložte svůj API klíč z Google AI Studia.
// Použití process.env zde nefunguje, protože kód běží přímo v prohlížeči.
const API_KEY = ''; 

/**
 * Generuje obsah pomocí Gemini API s logikou pro opakování v případě selhání.
 * Inicializace AI je přesunuta sem, aby chyba v API klíči neshodila celou aplikaci při startu.
 * @param prompt Textový prompt pro AI.
 * @returns Odpověď od AI nebo chybová zpráva.
 */
const generateContentWithBackoff = async (prompt: string): Promise<string> => {
    if (!API_KEY || API_KEY === '') {
        console.warn("Prosím, nastavte API_KEY v souboru services/geminiService.ts");
        return "AI Asistent není správně nakonfigurován. Zkontrolujte prosím API klíč v `services/geminiService.ts`.";
    }

    try {
        // Inicializace AI až zde, těsně před použitím.
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        let retries = 3;
        while (retries > 0) {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                return response.text;
            } catch (error) {
                console.error(`Gemini API call failed (pokus ${4 - retries}):`, error);
                retries--;
                if (retries === 0) {
                    throw error; // Vyhodíme chybu po posledním neúspěšném pokusu
                }
                await new Promise(res => setTimeout(res, 1000 * (4 - retries))); // Exponential backoff
            }
        }
    } catch (error) {
        console.error("Nepodařilo se získat odpověď od Gemini API po všech opakováních:", error);
        return "Omlouvám se, při komunikaci s AI nastala chyba. Zkontrolujte konzoli pro více detailů.";
    }

    // Tento kód by se neměl nikdy vykonat, ale je tu pro jistotu.
    return "Omlouvám se, při komunikaci s AI nastala neočekávaná chyba.";
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
        `${new Date(date).toLocaleDateString('cs-CZ')}, ${type}, ${category}, ${amount} Kč, ${description}`
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
