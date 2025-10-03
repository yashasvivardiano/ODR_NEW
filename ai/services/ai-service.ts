// AI Service for Filing Assistance - Phase 1

import { 
  FilingAssistanceRequest, 
  FilingAssistanceResponse, 
  AIServiceConfig, 
  AIServiceError,
  CaseType,
  UrgencyLevel,
  DocumentType 
} from './ai-types';
import { redactPIIFromText, validateTextSafety } from './pii-redaction';

// Default configuration - should be overridden with environment variables
const DEFAULT_CONFIG: AIServiceConfig = {
  baseUrl: process.env.EXPO_PUBLIC_AI_SERVICE_URL || 'http://localhost:3001',
  apiKey: process.env.EXPO_PUBLIC_AI_API_KEY || '',
  provider: 'openai', // Default to OpenAI
  model: 'gpt-4o-mini', // Cost-effective model for suggestions
  timeout: 10000, // 10 seconds
  retries: 2,
};

// Prompt templates for different providers
const PROMPT_TEMPLATES = {
  filing_assistance: `You are a legal intake assistant for an Online Dispute Resolution (ODR) platform in India. 
Your task is to analyze dispute information and provide structured suggestions for case filing.

IMPORTANT: Return ONLY valid JSON. No additional text, explanations, or markdown.

Given the dispute information, provide suggestions for:
1. Most appropriate case type (Mediation, Conciliation, Negotiation, or Arbitration)
2. Required and recommended documents
3. Field hints and improvements
4. Urgency assessment

Input: {input}

Return JSON in this exact format:
{
  "suggestions": {
    "caseType": {
      "recommended": "Mediation|Conciliation|Negotiation|Arbitration",
      "confidence": 0.85,
      "rationale": "Clear explanation for recommendation",
      "alternatives": [
        {"type": "Arbitration", "confidence": 0.65, "reason": "Alternative reasoning"}
      ]
    },
    "requiredDocuments": [
      {
        "type": "Contract|Invoice|Email_Communication|Legal_Notice|Financial_Statement|Identity_Proof|Evidence_Photo|Other",
        "description": "Clear description of document needed",
        "priority": "Required|Recommended|Optional",
        "reason": "Why this document is important"
      }
    ],
    "fieldHints": {
      "title": "Suggested improved title",
      "jurisdiction": "Suggested jurisdiction",
      "estimatedTimeline": "Expected resolution timeframe",
      "suggestedAmount": 50000
    },
    "urgency": {
      "level": "Low|Medium|High",
      "confidence": 0.75,
      "factors": ["List of factors determining urgency"]
    }
  }
}`,
};

export class AIFilingService {
  private config: AIServiceConfig;
  
  constructor(config?: Partial<AIServiceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Get AI suggestions for case filing
   */
  async getFilingSuggestions(request: FilingAssistanceRequest): Promise<FilingAssistanceResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    try {
      // Validate and redact PII from input
      const safeInput = this.prepareSafeInput(request);
      
      // Call AI service
      const aiResponse = await this.callAIProvider(safeInput, requestId);
      
      // Validate and structure response
      const suggestions = this.validateAIResponse(aiResponse);
      
      return {
        suggestions,
        metadata: {
          modelVersion: this.config.model,
          timestamp: new Date().toISOString(),
          requestId,
          processingTimeMs: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error('AI Filing Service Error:', error);
      
      if (error instanceof AIServiceError) {
        throw error;
      }
      
      throw new AIServiceError(
        'Failed to get filing suggestions',
        'AI_SERVICE_ERROR',
        500,
        requestId
      );
    }
  }
  
  /**
   * Prepare input by redacting PII and formatting for AI
   */
  private prepareSafeInput(request: FilingAssistanceRequest): string {
    // Redact PII from description (preserve amounts for context)
    const { redactedText, containsPII } = redactPIIFromText(
      request.disputeDescription, 
      true // preserve amounts
    );
    
    // Create structured input for AI
    const safeRequest = {
      title: request.disputeTitle,
      description: redactedText,
      selectedType: request.selectedCaseType,
      parties: request.parties?.map(party => ({
        role: party.role,
        type: party.type,
        // Don't include names - they're PII
      })),
      documents: request.uploadedDocuments?.map(doc => ({
        filename: doc.filename.replace(/[^a-zA-Z0-9._-]/g, '_'), // Sanitize filename
        type: doc.type,
        size: doc.size,
      })),
      amount: request.estimatedAmount,
      jurisdiction: request.jurisdiction,
    };
    
    // Validate final input is PII-free
    const inputJson = JSON.stringify(safeRequest, null, 2);
    if (!validateTextSafety(inputJson)) {
      throw new AIServiceError(
        'Input contains unsafe content after redaction',
        'PII_VALIDATION_ERROR',
        400
      );
    }
    
    return inputJson;
  }
  
  /**
   * Call the AI provider with retry logic
   */
  private async callAIProvider(input: string, requestId: string): Promise<any> {
    const prompt = PROMPT_TEMPLATES.filing_assistance.replace('{input}', input);
    
    for (let attempt = 1; attempt <= this.config.retries + 1; attempt++) {
      try {
        const response = await this.makeAIRequest(prompt, requestId, attempt);
        return response;
      } catch (error) {
        console.warn(`AI request attempt ${attempt} failed:`, error);
        
        if (attempt === this.config.retries + 1) {
          throw error;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      }
    }
  }
  
  /**
   * Make actual HTTP request to AI provider
   */
  private async makeAIRequest(prompt: string, requestId: string, attempt: number): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(`${this.config.baseUrl}/ai/file-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Request-ID': requestId,
          'X-Attempt': attempt.toString(),
        },
        body: JSON.stringify({
          prompt,
          provider: this.config.provider,
          model: this.config.model,
          temperature: 0.1, // Low temperature for consistent structured output
          max_tokens: 1500,
        }),
        signal: controller.signal,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new AIServiceError(
          `AI provider error: ${response.status} ${response.statusText}`,
          'AI_PROVIDER_ERROR',
          response.status,
          requestId
        );
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new AIServiceError(
          'Request timeout',
          'TIMEOUT_ERROR',
          408,
          requestId
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  /**
   * Validate AI response structure
   */
  private validateAIResponse(response: any): FilingAssistanceResponse['suggestions'] {
    if (!response || !response.suggestions) {
      throw new AIServiceError(
        'Invalid AI response structure',
        'INVALID_RESPONSE',
        500
      );
    }
    
    const { suggestions } = response;
    
    // Validate required fields
    if (!suggestions.caseType?.recommended || 
        !suggestions.requiredDocuments || 
        !Array.isArray(suggestions.requiredDocuments)) {
      throw new AIServiceError(
        'Missing required fields in AI response',
        'INVALID_RESPONSE',
        500
      );
    }
    
    // Validate case type
    const validCaseTypes: CaseType[] = ['Mediation', 'Conciliation', 'Negotiation', 'Arbitration'];
    if (!validCaseTypes.includes(suggestions.caseType.recommended)) {
      throw new AIServiceError(
        'Invalid case type in AI response',
        'INVALID_RESPONSE',
        500
      );
    }
    
    return suggestions;
  }
  
  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Delay utility for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const aiFilingService = new AIFilingService();

// Export hook for React Native components
export function useAIFilingSuggestions() {
  const getSuggestions = async (request: FilingAssistanceRequest): Promise<FilingAssistanceResponse> => {
    return aiFilingService.getFilingSuggestions(request);
  };
  
  return { getSuggestions };
}
