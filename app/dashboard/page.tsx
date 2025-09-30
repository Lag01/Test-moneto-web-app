'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useAppStore } from '@/store';
import LayoutWithNav from '@/app/layout-with-nav';
import { formatDate } from '@/lib/financial';
import { formatCurrency } from '@/lib/financial';
import { getPlanSummary } from '@/lib/monthly-plan';
import {
  exportMonthlyPlanToJSON,
  exportAllPlansToJSON,
  importMonthlyPlanFromJSON,
} from '@/lib/export-import';

export default function DashboardPage() {
  const router = useRouter();
  const {
    monthlyPlans,
    addMonthlyPlan,
    copyMonthlyPlan,
    setCurrentMonth,
    deleteMonthlyPlan,
    importMonthlyPlanFromData,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const handleCreateNew = () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const planId = addMonthlyPlan(month);
    router.push('/onboarding');
  };

  const handleCopyPlan = (sourceId: string) => {
    const now = new Date();
    const newMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const newPlanId = copyMonthlyPlan(sourceId, newMonth);
    setShowCopyModal(false);
    router.push('/onboarding');
  };

  const handleSelectPlan = (planId: string) => {
    setCurrentMonth(planId);
    router.push('/onboarding');
  };

  const handleViewPlan = (planId: string) => {
    setCurrentMonth(planId);
    router.push('/visualisation');
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      deleteMonthlyPlan(planId);
    }
  };

  const handleExportPlan = (planId: string) => {
    const plan = monthlyPlans.find((p) => p.id === planId);
    if (plan) {
      exportMonthlyPlanToJSON(plan);
    }
  };

  const handleExportAll = () => {
    if (monthlyPlans.length === 0) {
      alert('Aucun plan à exporter');
      return;
    }
    exportAllPlansToJSON(monthlyPlans);
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportSuccess(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    try {
      const result = await importMonthlyPlanFromJSON(file);

      if (result.success && result.plan) {
        // Vérifier si un plan existe déjà pour ce mois
        const existingPlan = monthlyPlans.find((p) => p.month === result.plan!.month);
        if (existingPlan) {
          const confirm = window.confirm(
            `Un plan existe déjà pour ${result.plan.month}. Voulez-vous importer quand même ?`
          );
          if (!confirm) {
            return;
          }
        }

        // Importer le plan
        const newPlanId = importMonthlyPlanFromData(result.plan);
        setImportSuccess(`Plan ${result.plan.month} importé avec succès !`);

        // Réinitialiser l'input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Rediriger après un court délai
        setTimeout(() => {
          setCurrentMonth(newPlanId);
          router.push('/onboarding');
        }, 1500);
      } else {
        setImportError(
          `Erreurs d'import : ${result.errors.join(', ')}`
        );
      }
    } catch (error) {
      setImportError('Erreur inattendue lors de l\'import');
      console.error('Import error:', error);
    }

    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sortedPlans = [...monthlyPlans].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <LayoutWithNav>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600 mb-8">
            Gérez vos plans mensuels et consultez votre historique financier
          </p>

          {/* Messages d'erreur/succès import */}
          {importError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-red-800">{importError}</p>
              </div>
            </div>
          )}

          {importSuccess && (
            <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-emerald-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-emerald-800">{importSuccess}</p>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Créer un nouveau plan
            </button>

            {monthlyPlans.length > 0 && (
              <>
                <button
                  onClick={() => setShowCopyModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copier un plan
                </button>

                <button
                  onClick={handleExportAll}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Exporter tous les plans
                </button>
              </>
            )}

            <button
              onClick={handleImportClick}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Importer un plan
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Liste des plans */}
          {monthlyPlans.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-slate-500 text-lg mb-2">
                Aucun plan mensuel créé pour le moment
              </p>
              <p className="text-slate-400 mb-6">
                Créez votre premier plan pour commencer à gérer vos finances
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Créer mon premier plan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Plans mensuels ({monthlyPlans.length})
              </h2>

              {sortedPlans.map((plan) => {
                const summary = getPlanSummary(plan);
                const monthDate = new Date(plan.month + '-01');
                const monthLabel = monthDate.toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-slate-800 capitalize mb-2">
                          {monthLabel}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-slate-500">Revenus</p>
                            <p className="text-lg font-semibold text-green-600">
                              {formatCurrency(summary.totalIncome)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Dépenses fixes</p>
                            <p className="text-lg font-semibold text-red-600">
                              {formatCurrency(summary.totalFixedExpenses)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Disponible</p>
                            <p className="text-lg font-semibold text-blue-600">
                              {formatCurrency(summary.availableAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Solde final</p>
                            <p
                              className={`text-lg font-semibold ${
                                summary.finalBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              {formatCurrency(summary.finalBalance)}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 mt-3">
                          Dernière modification :{' '}
                          {formatDate(plan.updatedAt, 'DD/MM/YYYY HH:mm')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleSelectPlan(plan.id)}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors text-sm font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleViewPlan(plan.id)}
                          className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-sm font-medium"
                        >
                          Visualiser
                        </button>
                        <button
                          onClick={() => handleExportPlan(plan.id)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          Exporter
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de copie de plan */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                Copier un plan existant
              </h2>
              <p className="text-slate-600 mt-1">
                Sélectionnez le plan que vous souhaitez copier
              </p>
            </div>

            <div className="p-6 space-y-3">
              {sortedPlans.map((plan) => {
                const monthDate = new Date(plan.month + '-01');
                const monthLabel = monthDate.toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                });
                const summary = getPlanSummary(plan);

                return (
                  <button
                    key={plan.id}
                    onClick={() => handleCopyPlan(plan.id)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 capitalize mb-2">
                      {monthLabel}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Revenus: </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(summary.totalIncome)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Dépenses: </span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(summary.totalFixedExpenses)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => setShowCopyModal(false)}
                className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWithNav>
  );
}
