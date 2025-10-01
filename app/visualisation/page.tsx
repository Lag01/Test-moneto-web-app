'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import LayoutWithNav from '@/app/layout-with-nav';
import SankeyChart from '@/components/SankeyChart';
import { getPlanSummary } from '@/lib/monthly-plan';
import { formatCurrency } from '@/lib/financial';

export default function VisualisationPage() {
  const router = useRouter();
  const { monthlyPlans, currentMonthId, setCurrentMonth } = useAppStore();

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

  const summary = getPlanSummary(currentPlan);

  const handleChangePlan = (planId: string) => {
    setCurrentMonth(planId);
  };

  return (
    <LayoutWithNav>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 capitalize">
              Visualisation - {monthLabel}
            </h1>
            <p className="text-slate-600 mb-4">
              Analysez votre plan financier avec des graphiques détaillés
            </p>

            {/* Sélecteur de mois */}
            {monthlyPlans.length > 1 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                  Sélectionner un autre mois :
                </label>
                <select
                  value={currentMonthId || ''}
                  onChange={(e) => handleChangePlan(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {monthlyPlans.map((plan) => {
                    const date = new Date(plan.month + '-01');
                    const label = date.toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    });
                    return (
                      <option key={plan.id} value={plan.id} className="capitalize">
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {/* Résumé financier */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-slate-500 mb-1">Revenus totaux</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-slate-500 mb-1">Dépenses fixes</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(summary.totalFixedExpenses)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-slate-500 mb-1">Disponible</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(summary.availableAmount)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-slate-500 mb-1">Enveloppes</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(summary.totalEnvelopes)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-slate-500 mb-1">Solde final</p>
              <p
                className={`text-xl font-bold ${
                  summary.finalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(summary.finalBalance)}
              </p>
            </div>
          </div>

          {/* Détails des revenus */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Revenus fixes</h3>
              <div className="space-y-2">
                {currentPlan.fixedIncomes.map((income) => (
                  <div key={income.id} className="flex justify-between items-center">
                    <span className="text-slate-700">{income.name}</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(income.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-4">Dépenses fixes</h3>
              <div className="space-y-2">
                {currentPlan.fixedExpenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center">
                    <span className="text-slate-700">{expense.name}</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enveloppes */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">
              Répartition des enveloppes
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentPlan.envelopes.map((envelope) => (
                <div key={envelope.id} className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">{envelope.name}</p>
                  <p className="text-xl font-bold text-purple-700">
                    {formatCurrency(envelope.amount)}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{envelope.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique Sankey */}
          <div className="space-y-8">
            <SankeyChart plan={currentPlan} />
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => router.push('/repartition')}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300"
            >
              ← Modifier le plan
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    </LayoutWithNav>
  );
}
