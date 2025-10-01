
import React from 'react';

interface HeaderProps {
    currentDate: Date;
    onMonthChange: (direction: 'prev' | 'next') => void;
    onYearChange: (year: number) => void;
    allYears: number[];
}

const Header: React.FC<HeaderProps> = ({ currentDate, onMonthChange, onYearChange, allYears }) => {
    const monthName = currentDate.toLocaleString('cs-CZ', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                <button
                    onClick={() => onMonthChange('prev')}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Předchozí měsíc"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-xl font-bold text-gray-700 w-40 text-center capitalize">{monthName} {year}</span>
                <button
                    onClick={() => onMonthChange('next')}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Následující měsíc"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <label htmlFor="year-select" className="text-sm font-medium text-gray-600">Rok:</label>
                <select
                    id="year-select"
                    value={year}
                    onChange={(e) => onYearChange(parseInt(e.target.value))}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {allYears.sort((a,b) => b-a).map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Header;
