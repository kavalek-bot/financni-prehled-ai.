import { Transaction, CategoryBudget } from '../types';

// --- NASTAVENÍ PRO GOOGLE SHEETS ---
// Zde vložte ID vaší tabulky z URL adresy.
const SPREADSHEET_ID = 'VASE_ID_TABULKY'; 
// Zde vložte svůj API klíč z Google Cloud Console.
const API_KEY = 'VAS_API_KLIC'; 
// Název listu s transakcemi a rozsah dat. Předpokládá sloupce A-E.
const RANGE = 'Transakce!A2:E'; 

// Ponecháváme mockovací data pro rozpočty. 
// V budoucnu by se i toto dalo načítat z dalšího listu v Google Sheets.
const MOCK_BUDGETS: CategoryBudget[] = [
  { category: 'Bydlení', limit: 18000 },
  { category: 'Jídlo', limit: 8000 },
  { category: 'Doprava', limit: 5000 },
  { category: 'Zábava', limit: 4000 },
  { category: 'Oblečení', limit: 2500 },
  { category: 'Zdraví', limit: 1500 },
];

/**
 * Načítá transakce z Google Sheets API.
 * Ujistěte se, že vaše tabulka je nasdílená pro "každého s odkazem" jako "čtenář".
 */
export const getTransactions = async (): Promise<Transaction[]> => {
    if (SPREADSHEET_ID === 'VASE_ID_TABULKY' || API_KEY === 'VAS_API_KLIC') {
        console.warn("Prosím, nastavte SPREADSHEET_ID a API_KEY v souboru services/financeService.ts");
        // Vracíme prázdné pole, aby aplikace nespadla, ale zobrazila varování.
        return [];
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Chyba při volání Google Sheets API: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Google Sheets API vrací pole polí (řádky a sloupce).
        // Musíme ho transformovat do pole objektů, které naše aplikace očekává.
        const transactions: Transaction[] = (data.values || []).map((row: string[], index: number) => {
            // Očekávané pořadí sloupců: Datum, Částka, Popis, Kategorie, Typ
            const [date, amountStr, description, category, type] = row;

            // Zpracování částky - odstranění mezer a převod na číslo
            const amount = parseFloat(amountStr?.replace(/\s/g, '').replace(',', '.') || '0');

            return {
                id: `gsheet-${index}`, // Generujeme unikátní ID
                date: new Date(date).toISOString(),
                amount: isNaN(amount) ? 0 : amount,
                description: description || '',
                category: category || 'Nekategorizováno',
                type: (type === 'Příjem' || type === 'Výdaj') ? type : 'Výdaj',
            };
        }).filter(t => t.date && t.amount > 0); // Filtrujeme neplatné záznamy

        return transactions;
    } catch (error) {
        console.error("Nepodařilo se načíst data z Google Sheets:", error);
        // V případě chyby vrátíme prázdné pole, aby aplikace nespadla.
        return [];
    }
};

export const getBudgets = async (): Promise<CategoryBudget[]> => {
  // Prozatím vracíme statická data.
  await new Promise(resolve => setTimeout(resolve, 100)); // Krátká simulace API volání
  return MOCK_BUDGETS;
};
