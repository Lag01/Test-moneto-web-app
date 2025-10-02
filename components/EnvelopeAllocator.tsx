'use client';

import { useState } from 'react';
import type { Envelope } from '@/store';
import PercentageSlider from './PercentageSlider';
import { formatCurrency } from '@/lib/financial';
import { getTotalPercentage, normalizeEnvelopePercentages } from '@/lib/monthly-plan';

interface Props {
  envelopes: Envelope[];
  availableAmount: number;
  onChange: (envelopes: Envelope[]) => void;
  onAutoAdjust?: () => void;
}

const ENVELOPE_COLORS = [
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#f97316', // Orange
  '#14b8a6', // Teal
];

export default function EnvelopeAllocator({
  envelopes,
  availableAmount,
  onChange,
  onAutoAdjust,
}: Props) {
  const [newEnvelopeName, setNewEnvelopeName] = useState('');

  const totalPercentage = getTotalPercentage(envelopes);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;
  const remainingPercentage = 100 - totalPercentage;

  const handlePercentageChange = (id: string, newPercentage: number) => {
    const updated = envelopes.map((env) => {
      if (env.id === id) {
        const amount = (availableAmount * newPercentage) / 100;
        return { ...env, percentage: newPercentage, amount };
      }
      return env;
    });
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    onChange(envelopes.filter((env) => env.id !== id));
  };

  const handleAddEnvelope = () => {
    if (!newEnvelopeName.trim()) return;

    const newEnvelope: Envelope = {
      id: `env-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newEnvelopeName.trim(),
      percentage: Math.max(0, remainingPercentage),
      amount: (availableAmount * Math.max(0, remainingPercentage)) / 100,
    };

    onChange([...envelopes, newEnvelope]);
    setNewEnvelopeName('');
  };

  const handleAutoNormalize = () => {
    const normalized = normalizeEnvelopePercentages(envelopes);
    const updated = normalized.map((env) => ({
      ...env,
      amount: (availableAmount * env.percentage) / 100,
    }));
    onChange(updated);
    if (onAutoAdjust) onAutoAdjust();
  };

  const getValidationColor = () => {
    if (isValid) return 'bg-emerald-500';
    if (Math.abs(remainingPercentage) < 5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getValidationText = () => {
    if (isValid) return '✓ Validé : 100%';
    if (remainingPercentage > 0) return `Reste : +${remainingPercentage.toFixed(1)}%`;
    return `Dépassement : ${remainingPercentage.toFixed(1)}%`;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête avec montant disponible */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold mb-2">Montant disponible à répartir</h2>
        <p className="text-3xl md:text-4xl font-bold">{formatCurrency(availableAmount)}</p>
      </div>

      {/* Barre de validation */}
      <div
        className={`rounded-lg p-3 md:p-4 text-white transition-all duration-300 ${getValidationColor()}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              {isValid ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-base md:text-lg font-bold">{getValidationText()}</p>
              <p className="text-xs md:text-sm opacity-90">
                Total alloué : {totalPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {!isValid && (
            <button
              onClick={handleAutoNormalize}
              className="px-4 py-3 md:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium transition-colors min-h-[44px] w-full sm:w-auto"
            >
              Ajuster à 100%
            </button>
          )}
        </div>

        {/* Barre de progression */}
        <div className="mt-3 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Liste des enveloppes */}
      <div className="grid gap-3 md:gap-4">
        {envelopes.length === 0 ? (
          <div className="text-center py-8 md:py-12 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mb-2">Aucune enveloppe créée</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Ajoutez votre première enveloppe ci-dessous
            </p>
          </div>
        ) : (
          envelopes.map((envelope, index) => (
            <PercentageSlider
              key={envelope.id}
              id={envelope.id}
              name={envelope.name}
              percentage={envelope.percentage}
              amount={envelope.amount}
              onChange={handlePercentageChange}
              onDelete={handleDelete}
              color={ENVELOPE_COLORS[index % ENVELOPE_COLORS.length]}
            />
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 md:p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
          Ajouter une enveloppe personnalisée
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <input
            type="text"
            value={newEnvelopeName}
            onChange={(e) => setNewEnvelopeName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddEnvelope()}
            placeholder="Ex: Vacances, Projet, etc."
            className="flex-1 px-4 py-3 md:py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
          <button
            onClick={handleAddEnvelope}
            disabled={!newEnvelopeName.trim()}
            className="px-6 py-3 md:py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>

        {/* Info sur le pourcentage restant */}
        {!isValid && remainingPercentage > 0 && (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            💡 La nouvelle enveloppe sera initialisée à{' '}
            <span className="font-semibold">{remainingPercentage.toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Résumé */}
      {envelopes.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Nombre d&apos;enveloppes</p>
              <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{envelopes.length}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Montant total alloué</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency((availableAmount * totalPercentage) / 100)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
