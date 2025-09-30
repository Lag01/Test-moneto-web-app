'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import LayoutWithNav from '@/app/layout-with-nav';
import EnvelopeAllocator from '@/components/EnvelopeAllocator';
import { calculateAvailableAmount, getTotalPercentage } from '@/lib/monthly-plan';

export default function RepartitionPage() {
  const router = useRouter();
  const { monthlyPlans, currentMonthId, updateMonthlyPlan, normalizeEnvelopesForPlan } =
    useAppStore();

  const currentPlan = monthlyPlans.find((p) => p.id === currentMonthId);

  useEffect(() => {
    if (currentPlan && currentPlan.envelopes.length === 0) {
      // Initialiser avec des enveloppes par défaut
      const defaultEnvelopes = [
        {
          id: `env-${Date.now()}-1`,
          name: 'Épargne',
          percentage: 30,
          amount: 0,
        },
        {
          id: `env-${Date.now()}-2`,
          name: 'Loisirs',
          percentage: 20,
          amount: 0,
        },
        {
          id: `env-${Date.now()}-3`,
          name: 'Livret A',
          percentage: 25,
          amount: 0,
        },
        {
          id: `env-${Date.now()}-4`,
          name: 'Crypto',
          percentage: 25,
          amount: 0,
        },
      ];

      const availableAmount = calculateAvailableAmount(
        currentPlan.fixedIncomes,
        currentPlan.fixedExpenses
      );

      const withAmounts = defaultEnvelopes.map((env) => ({
        ...env,
        amount: (availableAmount * env.percentage) / 100,
      }));

      updateMonthlyPlan(currentPlan.id, { envelopes: withAmounts });
    }
  }, [currentPlan?.id]);

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

  const totalPercentage = getTotalPercentage(currentPlan.envelopes);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  const handleEnvelopesChange = (envelopes: typeof currentPlan.envelopes) => {
    updateMonthlyPlan(currentPlan.id, { envelopes });
  };

  const handleNext = () => {
    if (!isValid) {
      alert('La somme des pourcentages doit être égale à 100%');
      return;
    }

    if (currentPlan.envelopes.length === 0) {
      alert('Veuillez ajouter au moins une enveloppe');
      return;
    }

    router.push('/visualisation');
  };

  return (
    <LayoutWithNav>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 capitalize">
              Répartition - {monthLabel}
            </h1>
            <p className="text-slate-600">
              Définissez comment allouer votre reste disponible dans différentes enveloppes
            </p>
          </div>

          {availableAmount <= 0 ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Aucun montant disponible à répartir
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Vos dépenses dépassent ou égalent vos revenus. Retournez à l&apos;onboarding
                    pour ajuster vos montants.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/onboarding')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                ← Retour à l&apos;onboarding
              </button>
            </div>
          ) : (
            <>
              {/* Composant principal de répartition */}
              <div className="mb-8">
                <EnvelopeAllocator
                  envelopes={currentPlan.envelopes}
                  availableAmount={availableAmount}
                  onChange={handleEnvelopesChange}
                  onAutoAdjust={() => normalizeEnvelopesForPlan(currentPlan.id)}
                />
              </div>

              {/* Boutons de navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => router.push('/onboarding')}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isValid || currentPlan.envelopes.length === 0}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant : Visualisation →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutWithNav>
  );
}
