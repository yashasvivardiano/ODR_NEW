// Real Audio Upload Component - Whisper Integration Test

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useHistoryStore } from './HistoryStore';

interface UploadResponse {
  sessionId: string;
  status: string;
  progress: number;
  file: {
    originalName: string;
    size: number;
    type: string;
  };
}

export const RealAudioUpload: React.FC = () => {
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addItem } = useHistoryStore();
  const [processingStatus, setProcessingStatus] = useState<any>(null);
  const [transcript, setTranscript] = useState<any>(null);

  // Simulate file upload (in real app, use document picker)
  const handleFileUpload = async () => {
    setIsUploading(true);
    
    try {
      // Create a mock file for testing
      // In real implementation, use react-native-document-picker
      const formData = new FormData();
      
      // Mock audio file (you would get this from document picker)
      const mockFile = {
        uri: 'file://path/to/audio.mp3',
        type: 'audio/mp3',
        name: 'court-hearing-sample.mp3'
      };
      
      // For testing, we'll send a request without actual file
      // but with proper structure
      const testData = {
        caseId: 'CASE_2024_001',
        participants: JSON.stringify([
          { id: 'judge_1', name: 'Judge Smith', role: 'judge' },
          { id: 'lawyer_p', name: 'Attorney Johnson', role: 'lawyer_plaintiff' },
          { id: 'lawyer_d', name: 'Attorney Williams', role: 'lawyer_defendant' }
        ])
      };

      // Since we can't upload real files in this demo, 
      // let's use the mock endpoint instead
      Alert.alert(
        'Real Audio Upload Ready',
        'The Whisper AI integration is implemented! To test:\n\n' +
        '1. Use a tool like Postman\n' +
        '2. POST to http://localhost:3001/ai/hearing/upload\n' +
        '3. Upload an audio/video file\n' +
        '4. Include caseId and participants in form data\n\n' +
        'For now, let\'s test with mock data.',
        [
          { text: 'OK', onPress: () => testMockProcessing() }
        ]
      );

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const testMockProcessing = async () => {
    try {
      setIsUploading(true);
      
      // Use the mock endpoint for demonstration
      const response = await fetch('http://localhost:3001/ai/hearing/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: 'mock-audio-file.mp3',
          caseId: 'CASE_2024_001',
          hearingDate: new Date().toISOString(),
          participants: [
            { id: 'judge_1', name: 'Judge Smith', role: 'judge' },
            { id: 'lawyer_p', name: 'Attorney Johnson', role: 'lawyer_plaintiff' },
            { id: 'lawyer_d', name: 'Attorney Williams', role: 'lawyer_defendant' }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Processing request failed');
      }

      const data = await response.json();
      setUploadResponse(data);
      
      // Start polling for status
      pollProcessingStatus(data.sessionId);
      
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Error', 'Failed to start processing');
    } finally {
      setIsUploading(false);
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
            // Load transcript
            loadTranscript(sessionId);
          } else if (status.status === 'processing') {
            setTimeout(poll, 2000);
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    };

    poll();
  };

  const loadTranscript = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/ai/hearing/transcript/${sessionId}`);
      if (response.ok) {
        const transcriptData = await response.json();
        setTranscript(transcriptData);
      }
    } catch (error) {
      console.error('Transcript loading error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🎤 Real Audio Processing</Text>
      <Text style={styles.subtitle}>Whisper AI Integration Test</Text>

      {/* Upload Button */}
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={handleFileUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.uploadButtonText}>
            📁 Upload Audio/Video File
          </Text>
        )}
      </TouchableOpacity>

      {/* API Information */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔧 Real Implementation Features:</Text>
        <Text style={styles.infoText}>• FFmpeg video → audio conversion</Text>
        <Text style={styles.infoText}>• OpenAI Whisper speech-to-text</Text>
        <Text style={styles.infoText}>• Automatic audio chunking (25MB limit)</Text>
        <Text style={styles.infoText}>• Speaker diarization</Text>
        <Text style={styles.infoText}>• Real-time progress tracking</Text>
        <Text style={styles.infoText}>• Judgment extraction with Groq AI</Text>
      </View>

      {/* Upload Response */}
      {uploadResponse && (
        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>📤 Upload Response</Text>
          <Text style={styles.responseText}>Session: {uploadResponse.sessionId}</Text>
          <Text style={styles.responseText}>Status: {uploadResponse.status}</Text>
          {uploadResponse.file && (
            <>
              <Text style={styles.responseText}>File: {uploadResponse.file.originalName}</Text>
              <Text style={styles.responseText}>Size: {Math.round(uploadResponse.file.size / 1024)}KB</Text>
            </>
          )}
        </View>
      )}

      {/* Processing Status */}
      {processingStatus && (
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>⚡ Processing Status</Text>
          <Text style={styles.statusText}>
            {processingStatus.status.toUpperCase()} - {processingStatus.progress}%
          </Text>
          
          <View style={styles.stagesContainer}>
            {processingStatus.stages?.map((stage: any, index: number) => (
              <View key={index} style={styles.stageRow}>
                <Text style={styles.stageIcon}>
                  {stage.status === 'completed' ? '✅' : 
                   stage.status === 'in_progress' ? '⏳' : 
                   stage.status === 'failed' ? '❌' : '⏸️'}
                </Text>
                <Text style={styles.stageName}>
                  {stage.stage.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Real Transcript Results */}
      {transcript && (
        <View style={styles.transcriptCard}>
          <Text style={styles.transcriptTitle}>📝 Whisper Transcript</Text>
          
          {transcript.metadata && (
            <View style={styles.metadataContainer}>
              <Text style={styles.metadataText}>
                📊 Confidence: {Math.round(transcript.confidence * 100)}%
              </Text>
              <Text style={styles.metadataText}>
                ⏱️ Duration: {Math.round(transcript.metadata.duration)}s
              </Text>
              <Text style={styles.metadataText}>
                📁 Chunks: {transcript.metadata.chunksProcessed}
              </Text>
              <Text style={styles.metadataText}>
                💾 Size: {transcript.metadata.fileSize?.toFixed(1)}MB
              </Text>
            </View>
          )}

          <ScrollView style={styles.transcriptScroll} nestedScrollEnabled>
            {transcript.segments?.slice(0, 5).map((segment: any, index: number) => (
              <View key={index} style={styles.transcriptSegment}>
                <View style={styles.segmentHeader}>
                  <Text style={styles.speakerRole}>
                    {segment.speakerRole?.replace('_', ' ').toUpperCase() || 'SPEAKER'}
                  </Text>
                  <Text style={styles.timestamp}>
                    {Math.floor(segment.startTime / 60)}:{String(Math.floor(segment.startTime % 60)).padStart(2, '0')}
                  </Text>
                  <Text style={styles.confidence}>
                    {Math.round(segment.confidence * 100)}%
                  </Text>
                </View>
                <Text style={styles.segmentText}>{segment.text}</Text>
              </View>
            ))}
            
            {transcript.segments?.length > 5 && (
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
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3182CE',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#2D3748',
    marginBottom: 4,
    paddingLeft: 8,
  },
  responseCard: {
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
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
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
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 12,
  },
  stagesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
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
    fontSize: 14,
    color: '#4A5568',
  },
  transcriptCard: {
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
  transcriptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 12,
  },
  metadataContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transcriptScroll: {
    maxHeight: 300,
  },
  transcriptSegment: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  speakerRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginRight: 8,
  },
  confidence: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  segmentText: {
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

export default RealAudioUpload;
