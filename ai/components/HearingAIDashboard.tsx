// Court Hearing AI Dashboard - Phase 2

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ProgressBarAndroid,
  Platform,
} from 'react-native';

interface HearingProcessingStatus {
  sessionId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  stages: ProcessingStage[];
  estimatedCompletion?: string;
}

interface ProcessingStage {
  stage: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startTime?: string;
  endTime?: string;
}

interface ProbabilityAnalysis {
  overallProbability: {
    plaintiff: number;
    defendant: number;
  };
  keyFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    strength: number;
    party: 'plaintiff' | 'defendant';
  }>;
  confidence: number;
}

export const HearingAIDashboard: React.FC = () => {
  const [processingStatus, setProcessingStatus] = useState<HearingProcessingStatus | null>(null);
  const [probabilityAnalysis, setProbabilityAnalysis] = useState<ProbabilityAnalysis | null>(null);
  const [transcript, setTranscript] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startHearingProcessing = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/ai/hearing/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: 'https://example.com/hearing-video.mp4',
          caseId: 'CASE_2024_001',
          hearingDate: new Date().toISOString(),
          participants: [
            { id: '1', name: 'Judge Smith', role: 'judge' },
            { id: '2', name: 'Attorney Johnson', role: 'lawyer_plaintiff' },
            { id: '3', name: 'Attorney Williams', role: 'lawyer_defendant' }
          ],
          language: 'en-US'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start processing');
      }

      const data = await response.json();
      setProcessingStatus(data);
      
      // Start polling for status updates
      pollProcessingStatus(data.sessionId);
      
    } catch (error) {
      console.error('Error starting processing:', error);
      Alert.alert('Error', 'Failed to start hearing processing');
    } finally {
      setIsLoading(false);
    }
  };

  const pollProcessingStatus = async (sessionId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`http://localhost:3001/ai/hearing/status/${sessionId}`);
        if (response.ok) {
          const status = await response.json();
          setProcessingStatus(status);
          
          if (status.status === 'completed') {
            // Load transcript and analysis
            loadTranscriptAndAnalysis(sessionId);
          } else if (status.status === 'processing') {
            setTimeout(poll, 2000); // Poll every 2 seconds
          }
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };

    poll();
  };

  const loadTranscriptAndAnalysis = async (sessionId: string) => {
    try {
      // Load transcript
      const transcriptResponse = await fetch(`http://localhost:3001/ai/hearing/transcript/${sessionId}`);
      if (transcriptResponse.ok) {
        const transcriptData = await transcriptResponse.json();
        setTranscript(transcriptData);
      }

      // Load probability analysis
      const analysisResponse = await fetch(`http://localhost:3001/ai/hearing/probability/${sessionId}`);
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setProbabilityAnalysis(analysisData);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const getStageIcon = (status: ProcessingStage['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '⏳';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };

  const getStageDisplayName = (stage: string) => {
    const names: Record<string, string> = {
      video_conversion: 'Video Processing',
      audio_extraction: 'Audio Extraction',
      transcription: 'Speech-to-Text',
      speaker_identification: 'Speaker ID',
      judgment_extraction: 'Judgment Analysis',
      probability_analysis: 'Probability Calculation',
      pdf_generation: 'PDF Generation',
      calendar_integration: 'Calendar Scheduling'
    };
    return names[stage] || stage;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Court Hearing AI Dashboard</Text>

      {/* Start Processing Button */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={startHearingProcessing}
        disabled={isLoading || (processingStatus?.status === 'processing')}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.startButtonText}>
            🎥 Process Court Hearing Video
          </Text>
        )}
      </TouchableOpacity>

      {/* Processing Status */}
      {processingStatus && (
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Processing Status</Text>
          <Text style={styles.sessionId}>Session: {processingStatus.sessionId}</Text>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {processingStatus.status.toUpperCase()} - {processingStatus.progress}%
            </Text>
            {Platform.OS === 'android' ? (
              <ProgressBarAndroid
                styleAttr="Horizontal"
                progress={processingStatus.progress / 100}
                color="#007AFF"
              />
            ) : (
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${processingStatus.progress}%` }
                  ]} 
                />
              </View>
            )}
          </View>

          {/* Processing Stages */}
          <View style={styles.stagesContainer}>
            <Text style={styles.stagesTitle}>Processing Stages:</Text>
            {processingStatus.stages.map((stage, index) => (
              <View key={index} style={styles.stageRow}>
                <Text style={styles.stageIcon}>{getStageIcon(stage.status)}</Text>
                <Text style={styles.stageName}>{getStageDisplayName(stage.stage)}</Text>
                <Text style={styles.stageStatus}>{stage.status}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Case Probability Analysis */}
      {probabilityAnalysis && (
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>📊 Case Probability Analysis</Text>
          
          <View style={styles.probabilityContainer}>
            <View style={styles.probabilityRow}>
              <Text style={styles.partyLabel}>Plaintiff:</Text>
              <View style={styles.probabilityBarContainer}>
                <View 
                  style={[
                    styles.probabilityBar,
                    styles.plaintiffBar,
                    { width: `${probabilityAnalysis.overallProbability.plaintiff}%` }
                  ]}
                />
              </View>
              <Text style={styles.probabilityText}>
                {probabilityAnalysis.overallProbability.plaintiff}%
              </Text>
            </View>

            <View style={styles.probabilityRow}>
              <Text style={styles.partyLabel}>Defendant:</Text>
              <View style={styles.probabilityBarContainer}>
                <View 
                  style={[
                    styles.probabilityBar,
                    styles.defendantBar,
                    { width: `${probabilityAnalysis.overallProbability.defendant}%` }
                  ]}
                />
              </View>
              <Text style={styles.probabilityText}>
                {probabilityAnalysis.overallProbability.defendant}%
              </Text>
            </View>
          </View>

          <Text style={styles.confidenceText}>
            Confidence: {Math.round(probabilityAnalysis.confidence * 100)}%
          </Text>

          {/* Key Factors */}
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsTitle}>Key Factors:</Text>
            {probabilityAnalysis.keyFactors.map((factor, index) => (
              <View key={index} style={styles.factorRow}>
                <Text style={styles.factorIcon}>
                  {factor.impact === 'positive' ? '✅' : factor.impact === 'negative' ? '❌' : '⚪'}
                </Text>
                <View style={styles.factorContent}>
                  <Text style={styles.factorName}>{factor.factor}</Text>
                  <Text style={styles.factorParty}>
                    {factor.party} • Strength: {Math.round(factor.strength * 100)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Transcript Preview */}
      {transcript && (
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>📝 Hearing Transcript</Text>
          <Text style={styles.transcriptInfo}>
            Confidence: {Math.round(transcript.confidence * 100)}% • 
            Language: {transcript.language} • 
            Segments: {transcript.segments.length}
          </Text>
          
          <ScrollView style={styles.transcriptContainer} nestedScrollEnabled>
            {transcript.segments.slice(0, 5).map((segment: any, index: number) => (
              <View key={index} style={styles.transcriptSegment}>
                <View style={styles.transcriptHeader}>
                  <Text style={styles.speakerRole}>
                    {segment.speakerRole.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.timestamp}>
                    {Math.floor(segment.startTime / 60)}:{String(segment.startTime % 60).padStart(2, '0')}
                  </Text>
                  {segment.isJudgmentPoint && (
                    <Text style={styles.judgmentBadge}>JUDGMENT</Text>
                  )}
                </View>
                <Text style={styles.transcriptText}>{segment.text}</Text>
              </View>
            ))}
            {transcript.segments.length > 5 && (
              <Text style={styles.moreSegments}>
                ... and {transcript.segments.length - 5} more segments
              </Text>
            )}
          </ScrollView>
        </View>
      )}

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
  startButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  sessionId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  stagesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  stagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  stageName: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
  },
  stageStatus: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  probabilityContainer: {
    marginBottom: 16,
  },
  probabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  partyLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
  probabilityBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  probabilityBar: {
    height: '100%',
  },
  plaintiffBar: {
    backgroundColor: '#48BB78',
  },
  defendantBar: {
    backgroundColor: '#F56565',
  },
  probabilityText: {
    width: 50,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'right',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  factorsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  factorRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  factorIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  factorContent: {
    flex: 1,
  },
  factorName: {
    fontSize: 14,
    color: '#2D3748',
    marginBottom: 2,
  },
  factorParty: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  transcriptInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  transcriptContainer: {
    maxHeight: 300,
  },
  transcriptSegment: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  speakerRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginRight: 8,
  },
  judgmentBadge: {
    fontSize: 10,
    color: '#E53E3E',
    backgroundColor: '#FED7D7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transcriptText: {
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20,
  },
  moreSegments: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  spacer: {
    height: 20,
  },
});

export default HearingAIDashboard;
