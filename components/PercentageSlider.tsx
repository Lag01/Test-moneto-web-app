'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/financial';
import { validatePercentage } from '@/lib/validation';
import ValidationError from './ValidationError';

interface Props {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  onChange: (id: string, percentage: number) => void;
  onDelete: (id: string) => void;
  color?: string;
}

export default function PercentageSlider({
  id,
  name,
  percentage,
  amount,
  onChange,
  onDelete,
  color = '#3b82f6',
}: Props) {
  const [localPercentage, setLocalPercentage] = useState(percentage.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!isEditing) {
      setLocalPercentage(percentage.toFixed(1));
    }
  }, [percentage, isEditing]);

  const handleSliderChange = (value: string) => {
    const num = parseFloat(value);
    setLocalPercentage(value);
    setError(undefined);
    onChange(id, num);
  };

  const handleInputChange = (value: string) => {
    setLocalPercentage(value);

    // Validation
    const validation = validatePercentage(value);
    setError(validation.error);

    const num = parseFloat(value);
    if (validation.valid && !isNaN(num)) {
      onChange(id, num);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    let num = parseFloat(localPercentage);
    if (isNaN(num) || num < 0) {
      num = 0;
      setError('Le pourcentage ne peut pas être négatif');
    } else if (num > 100) {
      num = 100;
      setError('Le pourcentage ne peut pas dépasser 100%');
    } else {
      setError(undefined);
    }
    setLocalPercentage(num.toFixed(1));
    onChange(id, num);
  };

  return (
    <div className="space-y-1">
      <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 md:p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow ${
        error ? 'ring-2 ring-red-500' : ''
      }`}>
        {/* En-tête avec nom et bouton supprimer */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100">{name}</h3>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Supprimer cette enveloppe"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Slider */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={percentage}
            onChange={(e) => handleSliderChange(e.target.value)}
            className="w-full h-3 md:h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
            }}
          />
        </div>

        {/* Pourcentage et Montant */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          {/* Input pourcentage */}
          <div className="flex items-center gap-2 flex-1">
            <input
              type="number"
              value={localPercentage}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={handleInputBlur}
              min="0"
              max="100"
              step="0.5"
              className={`w-20 px-3 py-3 md:py-2 border border-slate-300 dark:border-slate-600 rounded text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 min-h-[44px] ${
                error ? 'border-red-500' : ''
              }`}
            />
            <span className="text-slate-600 dark:text-slate-400 font-medium">%</span>
          </div>

          {/* Montant calculé */}
          <div className="flex-1 sm:text-right">
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Montant</p>
            <p className="text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(amount)}</p>
          </div>
        </div>

        {/* Barre de progression visuelle */}
        <div className="mt-3">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Erreur de validation */}
      {error && <ValidationError error={error} />}
    </div>
  );
}
