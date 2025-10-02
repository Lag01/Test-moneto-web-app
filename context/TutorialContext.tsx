'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { tutorialSteps, TutorialStepData } from '@/lib/tutorial-data';

interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TutorialStepData | null;
  totalSteps: number;
  showWelcomeModal: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  setShowWelcomeModal: (show: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const currentStep = isActive && currentStepIndex < tutorialSteps.length
    ? tutorialSteps[currentStepIndex]
    : null;

  const startTutorial = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
    setShowWelcomeModal(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Dernière étape, terminer le tutoriel
      completeTutorial();
    }
  }, [currentStepIndex]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setShowWelcomeModal(false);
  }, []);

  const completeTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setShowWelcomeModal(false);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: tutorialSteps.length,
        showWelcomeModal,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        completeTutorial,
        setShowWelcomeModal,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorialContext() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorialContext must be used within a TutorialProvider');
  }
  return context;
}
