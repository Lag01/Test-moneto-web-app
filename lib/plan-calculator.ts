import type { MonthlyPlan, CalculatedResults, Envelope } from '@/store';
import { calculateFixedTotal, recalculateEnvelopeAmounts } from './monthly-plan';

/**
 * Calcule tous les résultats d'un plan mensuel
 * Cette fonction centralise tous les calculs nécessaires
 */
export function calculatePlanResults(plan: MonthlyPlan): CalculatedResults {
  // 1. Total des revenus
  const totalIncome = calculateFixedTotal(plan.fixedIncomes);

  // 2. Total des dépenses fixes
  const totalExpenses = calculateFixedTotal(plan.fixedExpenses);

  // 3. Reste disponible = Revenus - Dépenses fixes
  const availableAmount = totalIncome - totalExpenses;

  // 4. Recalculer les montants des enveloppes selon les pourcentages
  const updatedEnvelopes = recalculateEnvelopeAmounts(
    plan.envelopes,
    availableAmount
  );

  // 5. Total alloué dans les enveloppes
  const totalEnvelopes = updatedEnvelopes.reduce(
    (sum, env) => sum + env.amount,
    0
  );

  // 6. Solde final = Disponible - Total enveloppes
  const finalBalance = availableAmount - totalEnvelopes;

  return {
    totalIncome,
    totalExpenses,
    availableAmount,
    totalEnvelopes,
    finalBalance,
    lastCalculated: new Date().toISOString(),
  };
}

/**
 * Crée un plan avec les résultats calculés initiaux
 */
export function createCalculatedPlan(
  month: string,
  id: string
): MonthlyPlan {
  const emptyResults: CalculatedResults = {
    totalIncome: 0,
    totalExpenses: 0,
    availableAmount: 0,
    totalEnvelopes: 0,
    finalBalance: 0,
    lastCalculated: new Date().toISOString(),
  };

  return {
    id,
    month,
    fixedIncomes: [],
    fixedExpenses: [],
    envelopes: [],
    calculatedResults: emptyResults,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
