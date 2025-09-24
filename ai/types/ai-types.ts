// AI Types for ODR Filing Assistance - Phase 1

export type CaseType = 'Mediation' | 'Conciliation' | 'Negotiation' | 'Arbitration';

export type UrgencyLevel = 'Low' | 'Medium' | 'High';

export type DocumentType = 
  | 'Contract'
  | 'Invoice'
  | 'Email_Communication'
  | 'Legal_Notice'
  | 'Financial_Statement'
  | 'Identity_Proof'
  | 'Evidence_Photo'
  | 'Other';

export interface FilingAssistanceRequest {
  disputeTitle?: string;
  disputeDescription: string;
  selectedCaseType?: CaseType;
  parties?: Array<{
    name?: string;
    role: 'Complainant' | 'Respondent';
    type: 'Individual' | 'Organization';
  }>;
  uploadedDocuments?: Array<{
    filename: string;
    type: string; // mime type
    size: number;
  }>;
  estimatedAmount?: number;
  jurisdiction?: string;
}

export interface FilingAssistanceResponse {
  suggestions: {
    caseType: {
      recommended: CaseType;
      confidence: number; // 0-1
      rationale: string;
      alternatives?: Array<{
        type: CaseType;
        confidence: number;
        reason: string;
      }>;
    };
    requiredDocuments: Array<{
      type: DocumentType;
      description: string;
      priority: 'Required' | 'Recommended' | 'Optional';
      reason: string;
    }>;
    fieldHints: {
      title?: string;
      jurisdiction?: string;
      estimatedTimeline?: string;
      suggestedAmount?: number;
    };
    urgency: {
      level: UrgencyLevel;
      confidence: number;
      factors: string[];
    };
  };
  metadata: {
    modelVersion: string;
    timestamp: string;
    requestId: string;
    processingTimeMs: number;
  };
}

export interface AIServiceConfig {
  baseUrl: string;
  apiKey: string;
  provider: 'openai' | 'azure' | 'anthropic';
  model: string;
  timeout: number;
  retries: number;
}

export interface PIIRedactionResult {
  redactedText: string;
  redactionMap: Record<string, string>; // placeholder -> original
  containsPII: boolean;
}

export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public requestId?: string
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}
