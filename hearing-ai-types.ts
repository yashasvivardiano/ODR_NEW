// Court Hearing AI System Types - Phase 2

export interface HearingSession {
  id: string;
  caseId: string;
  hearingDate: Date;
  duration: number; // in minutes
  videoUrl: string;
  audioUrl?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participants: HearingParticipant[];
  transcript?: HearingTranscript;
  judgment?: HearingJudgment;
  probabilityAnalysis?: CaseProbabilityAnalysis;
  nextHearingDate?: Date;
  calendarEventId?: string;
}

export interface HearingParticipant {
  id: string;
  name: string;
  role: 'judge' | 'plaintiff' | 'defendant' | 'lawyer_plaintiff' | 'lawyer_defendant' | 'witness';
  speakerId?: string; // For voice identification
}

export interface HearingTranscript {
  id: string;
  hearingId: string;
  segments: TranscriptSegment[];
  confidence: number;
  language: string;
  processingTime: number;
  createdAt: Date;
}

export interface TranscriptSegment {
  id: string;
  startTime: number; // seconds
  endTime: number;
  speakerId: string;
  speakerRole: HearingParticipant['role'];
  text: string;
  confidence: number;
  isJudgmentPoint?: boolean;
  isOrder?: boolean;
  keywords?: string[];
}

export interface HearingJudgment {
  id: string;
  hearingId: string;
  judgmentPoints: JudgmentPoint[];
  finalDecision?: FinalDecision;
  orders: JudgmentOrder[];
  nextHearingDate?: Date;
  pdfUrl?: string;
  createdAt: Date;
}

export interface JudgmentPoint {
  id: string;
  sequence: number;
  text: string;
  category: 'observation' | 'ruling' | 'direction' | 'question' | 'clarification';
  timestamp: number;
  confidence: number;
  relatedLaw?: string[];
}

export interface FinalDecision {
  decision: 'favor_plaintiff' | 'favor_defendant' | 'partial' | 'dismissed' | 'adjourned';
  reasoning: string;
  timestamp: number;
  confidence: number;
}

export interface JudgmentOrder {
  id: string;
  type: 'monetary' | 'injunction' | 'directive' | 'procedural' | 'next_hearing';
  description: string;
  amount?: number;
  dueDate?: Date;
  parties: string[]; // participant IDs
}

export interface CaseProbabilityAnalysis {
  id: string;
  hearingId: string;
  overallProbability: {
    plaintiff: number; // 0-100
    defendant: number; // 0-100
  };
  timelineAnalysis: ProbabilityTimePoint[];
  keyFactors: AnalysisFactor[];
  confidence: number;
  modelVersion: string;
  analyzedAt: Date;
}

export interface ProbabilityTimePoint {
  timestamp: number; // seconds into hearing
  plaintiffProbability: number;
  defendantProbability: number;
  triggerEvent: string; // what caused the change
}

export interface AnalysisFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  strength: number; // 0-1
  party: 'plaintiff' | 'defendant';
  evidence: string[]; // transcript segments
}

// API Request/Response Types

export interface VideoProcessingRequest {
  videoUrl: string;
  caseId: string;
  hearingDate: string;
  participants: HearingParticipant[];
  language?: string;
}

export interface VideoProcessingResponse {
  sessionId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  estimatedCompletion?: Date;
  stages: ProcessingStage[];
}

export interface ProcessingStage {
  stage: 'video_conversion' | 'audio_extraction' | 'transcription' | 'speaker_identification' | 'judgment_extraction' | 'probability_analysis' | 'pdf_generation' | 'calendar_integration';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface TranscriptionRequest {
  audioUrl: string;
  language: string;
  speakerCount?: number;
  enableSpeakerDiarization: boolean;
}

export interface JudgmentExtractionRequest {
  transcriptId: string;
  caseContext?: {
    caseType: string;
    jurisdiction: string;
    laws: string[];
  };
}

export interface ProbabilityAnalysisRequest {
  transcriptId: string;
  caseType: string;
  historicalData?: boolean;
}

export interface CalendarIntegrationRequest {
  hearingDate: Date;
  caseId: string;
  participants: string[];
  location?: string;
  description?: string;
}

// Configuration Types

export interface HearingAIConfig {
  // Video Processing
  videoStorage: {
    provider: 'aws_s3' | 'google_cloud' | 'azure_blob';
    bucket: string;
    region: string;
  };
  
  // Speech-to-Text
  speechToText: {
    provider: 'google_speech' | 'whisper' | 'azure_speech';
    model: string;
    language: string;
    enableDiarization: boolean;
  };
  
  // AI Analysis
  nlpProvider: {
    provider: 'openai' | 'gemini' | 'groq';
    model: string;
    temperature: number;
  };
  
  // Integrations
  googleCalendar: {
    clientId: string;
    clientSecret: string;
    calendarId: string;
  };
  
  // PDF Generation
  pdfGeneration: {
    template: string;
    fonts: string[];
    watermark?: string;
  };
  
  // Security
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotation: number; // days
  };
}

export interface HearingAIError extends Error {
  code: string;
  stage?: ProcessingStage['stage'];
  hearingId?: string;
  recoverable: boolean;
}

// Database Models

export interface HearingSessionModel {
  id: string;
  case_id: string;
  hearing_date: Date;
  duration_minutes: number;
  video_url: string;
  audio_url?: string;
  status: HearingSession['status'];
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface TranscriptModel {
  id: string;
  hearing_id: string;
  content: HearingTranscript;
  search_vector: string; // For full-text search
  created_at: Date;
}

export interface JudgmentModel {
  id: string;
  hearing_id: string;
  judgment_data: HearingJudgment;
  pdf_path?: string;
  created_at: Date;
}

export interface AnalysisModel {
  id: string;
  hearing_id: string;
  analysis_data: CaseProbabilityAnalysis;
  model_version: string;
  created_at: Date;
}
