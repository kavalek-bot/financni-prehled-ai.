
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getFinancialAdvice, answerUserQuery } from '../services/geminiService';
import { BudgetStatus, MonthlySummary, Transaction } from '../types';

interface AiAssistantProps {
    budgetStatus: BudgetStatus[];
    monthlySummary: MonthlySummary;
    transactions: Transaction[];
}

const AiAssistant: React.FC<AiAssistantProps> = ({ budgetStatus, monthlySummary, transactions }) => {
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [chatHistory]);
    
    const handleGetAdvice = useCallback(async () => {
        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: 'Dej mi finanční radu.' }]);
        try {
            const advice = await getFinancialAdvice(budgetStatus, monthlySummary);
            setChatHistory(prev => [...prev, { role: 'ai', content: advice }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Omlouvám se, nepodařilo se mi získat radu.' }]);
        } finally {
            setIsLoading(false);
        }
    }, [budgetStatus, monthlySummary]);

    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;
        
        const query = userInput;
        setUserInput('');
        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: query }]);

        try {
            const answer = await answerUserQuery(query, transactions, budgetStatus);
            setChatHistory(prev => [...prev, { role: 'ai', content: answer }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Omlouvám se, na tuto otázku nemohu odpovědět.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold">Váš AI finanční asistent</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto space-y-4">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                         <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800">
                             <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                             </div>
                         </div>
                     </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <form onSubmit={handleQuerySubmit} className="flex-grow flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Na co se chcete zeptat? (např. 'Kolik jsem utratil za jídlo?')"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isLoading}
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center" disabled={isLoading || !userInput.trim()}>
                        Odeslat
                    </button>
                </form>
                <button
                    onClick={handleGetAdvice}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center"
                    disabled={isLoading}
                >
                    Získat radu
                </button>
            </div>
        </div>
    );
};

export default AiAssistant;
