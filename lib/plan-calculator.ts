import type { MonthlyPlan, CalculatedResults, Envelope } from '@/store';
import {
  calculateFixedTotal,
  recalculateEnvelopeAmounts,
  calculateFixedEnvelopesTotal,
  separateEnvelopesByType
} from './monthly-plan';

/**
 * Calcule tous les résultats d'un plan mensuel
 * Cette fonction centralise tous les calculs nécessaires
 * Ordre : Revenus - Dépenses fixes = Disponible brut
 *         Disponible brut - Enveloppes fixes = Disponible pour %
 *         Répartition du disponible pour % selon les enveloppes en %
 */
export function calculatePlanResults(plan: MonthlyPlan): CalculatedResults {
  // 1. Total des revenus
  const totalIncome = calculateFixedTotal(plan.fixedIncomes);

  // 2. Total des dépenses fixes
  const totalExpenses = calculateFixedTotal(plan.fixedExpenses);

  // 3. Reste disponible brut = Revenus - Dépenses fixes
  const availableAmount = totalIncome - totalExpenses;

  // 4. Séparer les enveloppes fixes et en pourcentage
  const { fixed, percentage } = separateEnvelopesByType(plan.envelopes);
  const fixedEnvelopesTotal = calculateFixedEnvelopesTotal(plan.envelopes);

  // 5. Montant disponible pour les enveloppes en pourcentage
  const availableForPercentage = availableAmount - fixedEnvelopesTotal;

  // 6. Recalculer les montants des enveloppes (fixes gardent leur montant, % sont recalculés)
  const updatedEnvelopes = recalculateEnvelopeAmounts(
    plan.envelopes,
    availableAmount
  );

  // 7. Total alloué dans toutes les enveloppes (fixes + pourcentage)
  const totalEnvelopes = updatedEnvelopes.reduce(
    (sum, env) => sum + env.amount,
    0
  );

  // 8. Solde final = Disponible brut - Total enveloppes
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
