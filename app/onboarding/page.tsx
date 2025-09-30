'use client';

import { useRouter } from 'next/navigation';
import { useAppStore, type FixedItem } from '@/store';
import LayoutWithNav from '@/app/layout-with-nav';
import IncomeExpenseForm from '@/components/IncomeExpenseForm';
import { formatCurrency } from '@/lib/financial';
import { calculateAvailableAmount } from '@/lib/monthly-plan';

export default function OnboardingPage() {
  const router = useRouter();
  const { monthlyPlans, currentMonthId, updateMonthlyPlan } = useAppStore();

  const currentPlan = monthlyPlans.find((p) => p.id === currentMonthId);

  if (!currentPlan) {
    return (
      <LayoutWithNav>
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Aucun plan sélectionné
            </h1>
            <p className="text-slate-600 mb-6">
              Veuillez créer ou sélectionner un plan depuis le dashboard
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </LayoutWithNav>
    );
  }

  const monthDate = new Date(currentPlan.month + '-01');
  const monthLabel = monthDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const availableAmount = calculateAvailableAmount(
    currentPlan.fixedIncomes,
    currentPlan.fixedExpenses
  );

  const handleIncomesChange = (items: FixedItem[]) => {
    updateMonthlyPlan(currentPlan.id, { fixedIncomes: items });
  };

  const handleExpensesChange = (items: FixedItem[]) => {
    updateMonthlyPlan(currentPlan.id, { fixedExpenses: items });
  };

  const handleNext = () => {
    if (currentPlan.fixedIncomes.length === 0 || currentPlan.fixedExpenses.length === 0) {
      alert('Veuillez ajouter au moins un revenu et une dépense');
      return;
    }

    if (availableAmount <= 0) {
      alert('Le reste disponible doit être positif pour continuer');
      return;
    }

    router.push('/repartition');
  };

  return (
    <LayoutWithNav>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 capitalize">
              Onboarding - {monthLabel}
            </h1>
            <p className="text-slate-600">
              Définissez vos revenus et dépenses fixes pour ce mois
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Formulaire Revenus */}
            <IncomeExpenseForm
              type="income"
              items={currentPlan.fixedIncomes}
              onChange={handleIncomesChange}
              title="Revenus fixes"
            />

            {/* Formulaire Dépenses */}
            <IncomeExpenseForm
              type="expense"
              items={currentPlan.fixedExpenses}
              onChange={handleExpensesChange}
              title="Dépenses fixes"
            />
          </div>

          {/* Résumé */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Résumé</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Total revenus</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(
                    currentPlan.fixedIncomes.reduce((sum, i) => sum + i.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">Total dépenses</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(
                    currentPlan.fixedExpenses.reduce((sum, i) => sum + i.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">Reste disponible</p>
                <p className="text-3xl font-bold">{formatCurrency(availableAmount)}</p>
              </div>
            </div>

            {availableAmount <= 0 && (
              <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-200 rounded p-3">
                <p className="text-sm">
                  ⚠️ Attention : Vos dépenses dépassent ou égalent vos revenus. Veuillez
                  ajuster vos montants.
                </p>
              </div>
            )}
          </div>

          {/* Boutons de navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              ← Retour
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentPlan.fixedIncomes.length === 0 ||
                currentPlan.fixedExpenses.length === 0 ||
                availableAmount <= 0
              }
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              Suivant : Répartition →
            </button>
          </div>
        </div>
      </div>
    </LayoutWithNav>
  );
}
