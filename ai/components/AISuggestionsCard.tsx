// AI Suggestions Card Component - Phase 1

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FilingAssistanceResponse } from './ai-types';

interface AISuggestionsCardProps {
  suggestions: FilingAssistanceResponse | null;
  isLoading: boolean;
  error: string | null;
  onApplySuggestion: (type: 'caseType' | 'title' | 'jurisdiction' | 'amount', value: any) => void;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const AISuggestionsCard: React.FC<AISuggestionsCardProps> = ({
  suggestions,
  isLoading,
  error,
  onApplySuggestion,
  onRetry,
  onDismiss,
}) => {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Getting AI suggestions...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!suggestions) {
    return null;
  }

  const { suggestions: aiSuggestions, metadata } = suggestions;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Suggestions</Text>
        <Text style={styles.confidence}>
          {Math.round(aiSuggestions.caseType.confidence * 100)}% confident
        </Text>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Case Type Suggestion */}
        <View style={styles.suggestion}>
          <Text style={styles.suggestionTitle}>Recommended Case Type</Text>
          <View style={styles.suggestionContent}>
            <Text style={styles.recommendedValue}>
              {aiSuggestions.caseType.recommended}
            </Text>
            <Text style={styles.rationale}>
              {aiSuggestions.caseType.rationale}
            </Text>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => onApplySuggestion('caseType', aiSuggestions.caseType.recommended)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Field Hints */}
        {aiSuggestions.fieldHints.title && (
          <View style={styles.suggestion}>
            <Text style={styles.suggestionTitle}>Suggested Title</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.hintValue}>{aiSuggestions.fieldHints.title}</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => onApplySuggestion('title', aiSuggestions.fieldHints.title)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {aiSuggestions.fieldHints.jurisdiction && (
          <View style={styles.suggestion}>
            <Text style={styles.suggestionTitle}>Suggested Jurisdiction</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.hintValue}>{aiSuggestions.fieldHints.jurisdiction}</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => onApplySuggestion('jurisdiction', aiSuggestions.fieldHints.jurisdiction)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Urgency Assessment */}
        <View style={styles.suggestion}>
          <Text style={styles.suggestionTitle}>Urgency Level</Text>
          <View style={styles.suggestionContent}>
            <View style={styles.urgencyContainer}>
              <Text style={[styles.urgencyLevel, styles[`urgency${aiSuggestions.urgency.level}`]]}>
                {aiSuggestions.urgency.level}
              </Text>
              <Text style={styles.urgencyConfidence}>
                {Math.round(aiSuggestions.urgency.confidence * 100)}% confident
              </Text>
            </View>
            {aiSuggestions.urgency.factors.length > 0 && (
              <View style={styles.factorsContainer}>
                <Text style={styles.factorsTitle}>Factors:</Text>
                {aiSuggestions.urgency.factors.map((factor, index) => (
                  <Text key={index} style={styles.factor}>• {factor}</Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Required Documents */}
        {aiSuggestions.requiredDocuments.length > 0 && (
          <View style={styles.suggestion}>
            <Text style={styles.suggestionTitle}>Document Recommendations</Text>
            <View style={styles.suggestionContent}>
              {aiSuggestions.requiredDocuments.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <View style={styles.documentHeader}>
                    <Text style={styles.documentType}>{doc.type.replace('_', ' ')}</Text>
                    <Text style={[styles.priority, styles[`priority${doc.priority}`]]}>
                      {doc.priority}
                    </Text>
                  </View>
                  <Text style={styles.documentDescription}>{doc.description}</Text>
                  <Text style={styles.documentReason}>{doc.reason}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Alternatives */}
        {aiSuggestions.caseType.alternatives && aiSuggestions.caseType.alternatives.length > 0 && (
          <View style={styles.suggestion}>
            <Text style={styles.suggestionTitle}>Alternative Case Types</Text>
            <View style={styles.suggestionContent}>
              {aiSuggestions.caseType.alternatives.map((alt, index) => (
                <View key={index} style={styles.alternativeItem}>
                  <Text style={styles.alternativeType}>{alt.type}</Text>
                  <Text style={styles.alternativeConfidence}>
                    {Math.round(alt.confidence * 100)}%
                  </Text>
                  <Text style={styles.alternativeReason}>{alt.reason}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.metadata}>
          Generated in {metadata.processingTimeMs}ms • {metadata.modelVersion}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FEB2B2',
    borderWidth: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  confidence: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
  dismissButtonText: {
    fontSize: 18,
    color: '#999',
  },
  content: {
    maxHeight: 400,
  },
  suggestion: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  suggestionContent: {
    marginLeft: 8,
  },
  recommendedValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  rationale: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  hintValue: {
    fontSize: 14,
    color: '#2D3748',
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgencyLevel: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  urgencyHigh: {
    backgroundColor: '#FED7D7',
    color: '#C53030',
  },
  urgencyMedium: {
    backgroundColor: '#FEEBC8',
    color: '#DD6B20',
  },
  urgencyLow: {
    backgroundColor: '#C6F6D5',
    color: '#38A169',
  },
  urgencyConfidence: {
    fontSize: 12,
    color: '#666',
  },
  factorsContainer: {
    marginTop: 4,
  },
  factorsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 4,
  },
  factor: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  documentItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  priority: {
    fontSize: 10,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  priorityRequired: {
    backgroundColor: '#FED7D7',
    color: '#C53030',
  },
  priorityRecommended: {
    backgroundColor: '#FEEBC8',
    color: '#DD6B20',
  },
  priorityOptional: {
    backgroundColor: '#E2E8F0',
    color: '#4A5568',
  },
  documentDescription: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 2,
  },
  documentReason: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  alternativeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  alternativeType: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
  },
  alternativeConfidence: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
  alternativeReason: {
    fontSize: 11,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  metadata: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#C53030',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
