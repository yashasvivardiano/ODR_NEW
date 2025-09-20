// React Native Hook for AI Suggestions - Phase 1

import { useState, useCallback } from 'react';
import { FilingAssistanceRequest, FilingAssistanceResponse, AIServiceError } from './ai-types';
import { aiFilingService } from './ai-service';

export interface AIState {
  isLoading: boolean;
  suggestions: FilingAssistanceResponse | null;
  error: string | null;
  lastRequestId: string | null;
}

export interface AIActions {
  getSuggestions: (request: FilingAssistanceRequest) => Promise<void>;
  clearSuggestions: () => void;
  clearError: () => void;
  applySuggestion: (type: 'caseType' | 'title' | 'jurisdiction' | 'amount') => any;
}

export function useAISuggestions(): AIState & AIActions {
  const [state, setState] = useState<AIState>({
    isLoading: false,
    suggestions: null,
    error: null,
    lastRequestId: null,
  });

  const getSuggestions = useCallback(async (request: FilingAssistanceRequest) => {
    // Don't make request if already loading
    if (state.isLoading) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await aiFilingService.getFilingSuggestions(request);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        suggestions: response,
        lastRequestId: response.metadata.requestId,
      }));
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      
      let errorMessage = 'Failed to get AI suggestions';
      
      if (error instanceof AIServiceError) {
        switch (error.code) {
          case 'TIMEOUT_ERROR':
            errorMessage = 'Request timed out. Please try again.';
            break;
          case 'PII_VALIDATION_ERROR':
            errorMessage = 'Please check your input for sensitive information.';
            break;
          case 'AI_PROVIDER_ERROR':
            errorMessage = 'AI service is temporarily unavailable.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [state.isLoading]);

  const clearSuggestions = useCallback(() => {
    setState(prev => ({
      ...prev,
      suggestions: null,
      error: null,
      lastRequestId: null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const applySuggestion = useCallback((type: 'caseType' | 'title' | 'jurisdiction' | 'amount') => {
    if (!state.suggestions) return null;

    switch (type) {
      case 'caseType':
        return state.suggestions.suggestions.caseType.recommended;
      case 'title':
        return state.suggestions.suggestions.fieldHints.title;
      case 'jurisdiction':
        return state.suggestions.suggestions.fieldHints.jurisdiction;
      case 'amount':
        return state.suggestions.suggestions.fieldHints.suggestedAmount;
      default:
        return null;
    }
  }, [state.suggestions]);

  return {
    ...state,
    getSuggestions,
    clearSuggestions,
    clearError,
    applySuggestion,
  };
}

// Utility hook for debounced suggestions
export function useDebouncedAISuggestions(delay: number = 1500) {
  const aiSuggestions = useAISuggestions();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const getDebouncedSuggestions = useCallback((request: FilingAssistanceRequest) => {
    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      aiSuggestions.getSuggestions(request);
    }, delay);

    setDebounceTimeout(timeout);
  }, [aiSuggestions, delay, debounceTimeout]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }
  }, [debounceTimeout]);

  return {
    ...aiSuggestions,
    getDebouncedSuggestions,
    cleanup,
  };
}
