import type { FixedItem, Envelope, MonthlyPlan } from '@/store';

/**
 * Calcule le total d'un tableau d'éléments fixes
 */
export function calculateFixedTotal(items: FixedItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Calcule le reste disponible après déduction des dépenses fixes
 */
export function calculateAvailableAmount(
  fixedIncomes: FixedItem[],
  fixedExpenses: FixedItem[]
): number {
  const totalIncome = calculateFixedTotal(fixedIncomes);
  const totalExpenses = calculateFixedTotal(fixedExpenses);
  return totalIncome - totalExpenses;
}

/**
 * Calcule les montants des enveloppes en fonction des pourcentages
 */
export function calculateEnvelopeAmounts(
  envelopes: Envelope[],
  availableAmount: number
): Envelope[] {
  return envelopes.map((envelope) => ({
    ...envelope,
    amount: (availableAmount * envelope.percentage) / 100,
  }));
}

/**
 * Valide que la somme des pourcentages des enveloppes = 100%
 */
export function validateEnvelopesPercentage(envelopes: Envelope[]): boolean {
  const total = envelopes.reduce((sum, env) => sum + env.percentage, 0);
  return Math.abs(total - 100) < 0.01; // Tolérance pour les erreurs d'arrondi
}

/**
 * Récupère le total des pourcentages actuels
 */
export function getTotalPercentage(envelopes: Envelope[]): number {
  return envelopes.reduce((sum, env) => sum + env.percentage, 0);
}

/**
 * Calcule le solde final après allocation de toutes les enveloppes
 */
export function calculateFinalBalance(plan: MonthlyPlan): number {
  const totalIncome = calculateFixedTotal(plan.fixedIncomes);
  const totalExpenses = calculateFixedTotal(plan.fixedExpenses);
  const totalEnvelopes = plan.envelopes.reduce((sum, env) => sum + env.amount, 0);

  return totalIncome - totalExpenses - totalEnvelopes;
}

/**
 * Génère un résumé du plan mensuel
 */
export interface PlanSummary {
  totalIncome: number;
  totalFixedExpenses: number;
  availableAmount: number;
  totalEnvelopes: number;
  finalBalance: number;
}

export function getPlanSummary(plan: MonthlyPlan): PlanSummary {
  const totalIncome = calculateFixedTotal(plan.fixedIncomes);
  const totalFixedExpenses = calculateFixedTotal(plan.fixedExpenses);
  const availableAmount = totalIncome - totalFixedExpenses;
  const totalEnvelopes = plan.envelopes.reduce((sum, env) => sum + env.amount, 0);
  const finalBalance = availableAmount - totalEnvelopes;

  return {
    totalIncome,
    totalFixedExpenses,
    availableAmount,
    totalEnvelopes,
    finalBalance,
  };
}

/**
 * Normalise les pourcentages des enveloppes pour qu'ils totalisent exactement 100%
 * Ajuste proportionnellement chaque pourcentage
 */
export function normalizeEnvelopePercentages(envelopes: Envelope[]): Envelope[] {
  if (envelopes.length === 0) return envelopes;

  const total = getTotalPercentage(envelopes);

  // Si déjà à 100% (avec tolérance), ne rien changer
  if (Math.abs(total - 100) < 0.01) {
    return envelopes;
  }

  // Si total = 0, répartir équitablement
  if (total === 0) {
    const equalPercentage = 100 / envelopes.length;
    return envelopes.map((env) => ({
      ...env,
      percentage: equalPercentage,
    }));
  }

  // Ajuster proportionnellement
  const factor = 100 / total;
  return envelopes.map((env) => ({
    ...env,
    percentage: env.percentage * factor,
  }));
}

/**
 * Ajuste les montants des enveloppes en fonction des pourcentages
 * Utilisé après modification des pourcentages ou du montant disponible
 */
export function recalculateEnvelopeAmounts(
  envelopes: Envelope[],
  availableAmount: number
): Envelope[] {
  return envelopes.map((env) => ({
    ...env,
    amount: (availableAmount * env.percentage) / 100,
  }));
}

/**
 * Valide qu'un plan mensuel est complet et cohérent
 */
export function validateMonthlyPlan(plan: MonthlyPlan): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (plan.fixedIncomes.length === 0) {
    errors.push('Aucun revenu fixe défini');
  }

  if (plan.fixedExpenses.length === 0) {
    errors.push('Aucune dépense fixe définie');
  }

  if (plan.envelopes.length === 0) {
    errors.push('Aucune enveloppe définie');
  }

  if (plan.envelopes.length > 0 && !validateEnvelopesPercentage(plan.envelopes)) {
    errors.push('La somme des pourcentages des enveloppes doit être égale à 100%');
  }

  const availableAmount = calculateAvailableAmount(
    plan.fixedIncomes,
    plan.fixedExpenses
  );

  if (availableAmount < 0) {
    errors.push('Les dépenses fixes dépassent les revenus fixes');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
