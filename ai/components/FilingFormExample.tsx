// Example: Filing Form with AI Suggestions - Phase 1
// This demonstrates how to integrate AI suggestions into a case filing form

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDebouncedAISuggestions } from './useAISuggestions';
import { AISuggestionsCard } from './AISuggestionsCard';
import { FilingAssistanceRequest, CaseType } from './ai-types';
import { useHistoryStore } from './HistoryStore';

interface FilingFormState {
  title: string;
  description: string;
  caseType: CaseType | '';
  jurisdiction: string;
  estimatedAmount: string;
  parties: Array<{
    name: string;
    role: 'Complainant' | 'Respondent';
    type: 'Individual' | 'Organization';
  }>;
}

export const FilingFormExample: React.FC = () => {
  const [form, setForm] = useState<FilingFormState>({
    title: '',
    description: '',
    caseType: '',
    jurisdiction: '',
    estimatedAmount: '',
    parties: [
      { name: '', role: 'Complainant', type: 'Individual' },
      { name: '', role: 'Respondent', type: 'Individual' },
    ],
  });

  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const aiSuggestions = useDebouncedAISuggestions(2000); // 2 second debounce
  const { addItem } = useHistoryStore();

  // Trigger AI suggestions when description changes
  useEffect(() => {
    if (form.description.trim().length > 50) {
      const request: FilingAssistanceRequest = {
        disputeTitle: form.title || undefined,
        disputeDescription: form.description,
        selectedCaseType: form.caseType || undefined,
        parties: form.parties.filter(p => p.name.trim()),
        estimatedAmount: form.estimatedAmount ? parseFloat(form.estimatedAmount) : undefined,
        jurisdiction: form.jurisdiction || undefined,
      };

      aiSuggestions.getDebouncedSuggestions(request);
      setShowAISuggestions(true);
    }
  }, [form.description, form.title, form.caseType, form.jurisdiction, form.estimatedAmount]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => aiSuggestions.cleanup();
  }, []);

  const handleApplySuggestion = (type: 'caseType' | 'title' | 'jurisdiction' | 'amount', value: any) => {
    switch (type) {
      case 'caseType':
        setForm(prev => ({ ...prev, caseType: value }));
        Alert.alert('Applied', `Case type set to: ${value}`);
        break;
      case 'title':
        setForm(prev => ({ ...prev, title: value }));
        Alert.alert('Applied', 'Title updated with AI suggestion');
        break;
      case 'jurisdiction':
        setForm(prev => ({ ...prev, jurisdiction: value }));
        Alert.alert('Applied', `Jurisdiction set to: ${value}`);
        break;
      case 'amount':
        setForm(prev => ({ ...prev, estimatedAmount: value?.toString() || '' }));
        Alert.alert('Applied', `Amount set to: ₹${value}`);
        break;
    }
  };

  const handleGetAISuggestions = () => {
    if (form.description.trim().length < 10) {
      Alert.alert('Error', 'Please provide more details in the description to get AI suggestions.');
      return;
    }

    const request: FilingAssistanceRequest = {
      disputeTitle: form.title || undefined,
      disputeDescription: form.description,
      selectedCaseType: form.caseType || undefined,
      parties: form.parties.filter(p => p.name.trim()),
      estimatedAmount: form.estimatedAmount ? parseFloat(form.estimatedAmount) : undefined,
      jurisdiction: form.jurisdiction || undefined,
    };

    aiSuggestions.getSuggestions(request);
    setShowAISuggestions(true);
  };

  const handleRetryAI = () => {
    aiSuggestions.clearError();
    handleGetAISuggestions();
  };

  const handleSubmitCase = async () => {
    // Validate required fields
    if (!form.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a case title');
      return;
    }
    
    if (!form.description.trim()) {
      Alert.alert('Validation Error', 'Please enter a case description');
      return;
    }
    
    if (!form.caseType) {
      Alert.alert('Validation Error', 'Please select a case type');
      return;
    }

    const validParties = form.parties.filter(p => p.name.trim());
    if (validParties.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one party');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate case reference ID
      const caseId = `ODR-${Date.now().toString(36).toUpperCase()}`;
      
      // Save to history
      const historyId = addItem({
        type: 'filing',
        title: form.title,
        description: `${form.caseType} case with ${validParties.length} parties`,
        status: 'completed',
        data: {
          caseId,
          ...form,
          parties: validParties,
          submittedAt: new Date().toISOString()
        }
      });

      // Show success message
      Alert.alert(
        'Case Filed Successfully!',
        `Your case has been filed with reference ID: ${caseId}\n\nYou can view it in your history.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setForm({
                title: '',
                description: '',
                caseType: '',
                jurisdiction: '',
                estimatedAmount: '',
                parties: [
                  { name: '', role: 'Complainant', type: 'Individual' },
                  { name: '', role: 'Respondent', type: 'Individual' },
                ],
              });
              setShowAISuggestions(false);
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Submission Error', 'Failed to submit case. Please try again.');
      console.error('Case submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>File New Case</Text>
      
      {/* Case Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Case Title</Text>
        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
          placeholder="Brief title of your dispute"
        />
      </View>

      {/* Case Type */}
      <View style={styles.field}>
        <Text style={styles.label}>Case Type</Text>
        <View style={styles.radioGroup}>
          {(['Mediation', 'Conciliation', 'Negotiation', 'Arbitration'] as CaseType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.radioOption, form.caseType === type && styles.radioSelected]}
              onPress={() => setForm(prev => ({ ...prev, caseType: type }))}
            >
              <Text style={[styles.radioText, form.caseType === type && styles.radioTextSelected]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Dispute Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
          placeholder="Describe your dispute in detail. Include key facts, timeline, and what you're seeking..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.hint}>
          💡 Provide detailed information to get better AI suggestions
        </Text>
      </View>

      {/* Jurisdiction */}
      <View style={styles.field}>
        <Text style={styles.label}>Jurisdiction</Text>
        <TextInput
          style={styles.input}
          value={form.jurisdiction}
          onChangeText={(text) => setForm(prev => ({ ...prev, jurisdiction: text }))}
          placeholder="e.g., Mumbai, Delhi, Bangalore"
        />
      </View>

      {/* Estimated Amount */}
      <View style={styles.field}>
        <Text style={styles.label}>Estimated Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={form.estimatedAmount}
          onChangeText={(text) => setForm(prev => ({ ...prev, estimatedAmount: text }))}
          placeholder="Amount in dispute"
          keyboardType="numeric"
        />
      </View>

      {/* AI Suggestions Button */}
      <TouchableOpacity style={styles.aiButton} onPress={handleGetAISuggestions}>
        <Text style={styles.aiButtonText}>🤖 Get AI Suggestions</Text>
      </TouchableOpacity>

      {/* AI Suggestions Card */}
      {showAISuggestions && (
        <AISuggestionsCard
          suggestions={aiSuggestions.suggestions}
          isLoading={aiSuggestions.isLoading}
          error={aiSuggestions.error}
          onApplySuggestion={handleApplySuggestion}
          onRetry={handleRetryAI}
          onDismiss={() => setShowAISuggestions(false)}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmitCase}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Case'}
        </Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginVertical: 20,
  },
  field: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  radioSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioText: {
    fontSize: 14,
    color: '#4A5568',
  },
  radioTextSelected: {
    color: 'white',
  },
  aiButton: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  aiButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});

export default FilingFormExample;
