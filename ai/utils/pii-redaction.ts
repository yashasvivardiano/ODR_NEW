// PII Redaction Utility for AI Processing - Phase 1

import { PIIRedactionResult } from './ai-types';

// Regex patterns for common PII
const PII_PATTERNS = {
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Phone numbers (Indian and international formats)
  phone: /(?:\+91[-.\s]?)?(?:\d{2,4}[-.\s]?)?(?:\d{3,4}[-.\s]?\d{3,4}|\d{10})\b/g,
  
  // Indian PAN numbers
  pan: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g,
  
  // Aadhaar numbers
  aadhaar: /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
  
  // Credit card numbers (basic pattern)
  creditCard: /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g,
  
  // Bank account numbers (8-18 digits)
  bankAccount: /\b\d{8,18}\b/g,
  
  // Names (common Indian names - basic patterns)
  // This is simplified - in production, use NER models
  commonNames: /\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
  
  // Addresses (simplified - looks for patterns like "123 Street Name")
  address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Colony|Nagar)\b/gi,
  
  // Amounts in INR
  amounts: /(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?/gi,
};

export class PIIRedactor {
  private redactionCounter = 0;
  
  /**
   * Redact PII from text while preserving context for AI processing
   */
  redactPII(text: string, preserveAmounts = true): PIIRedactionResult {
    let redactedText = text;
    const redactionMap: Record<string, string> = {};
    let containsPII = false;
    
    // Reset counter for each new redaction
    this.redactionCounter = 0;
    
    // Process each PII type
    Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
      // Skip amounts if preserveAmounts is true (for dispute amount context)
      if (type === 'amounts' && preserveAmounts) return;
      
      redactedText = redactedText.replace(pattern, (match) => {
        containsPII = true;
        const placeholder = this.generatePlaceholder(type);
        redactionMap[placeholder] = match;
        return placeholder;
      });
    });
    
    return {
      redactedText,
      redactionMap,
      containsPII,
    };
  }
  
  /**
   * Restore original PII from redacted text
   */
  restorePII(redactedText: string, redactionMap: Record<string, string>): string {
    let restoredText = redactedText;
    
    Object.entries(redactionMap).forEach(([placeholder, original]) => {
      restoredText = restoredText.replace(new RegExp(placeholder, 'g'), original);
    });
    
    return restoredText;
  }
  
  /**
   * Generate a contextual placeholder for redacted PII
   */
  private generatePlaceholder(type: string): string {
    this.redactionCounter++;
    
    const placeholders: Record<string, string> = {
      email: `[EMAIL_${this.redactionCounter}]`,
      phone: `[PHONE_${this.redactionCounter}]`,
      pan: `[PAN_${this.redactionCounter}]`,
      aadhaar: `[AADHAAR_${this.redactionCounter}]`,
      creditCard: `[CARD_${this.redactionCounter}]`,
      bankAccount: `[ACCOUNT_${this.redactionCounter}]`,
      commonNames: `[PERSON_${this.redactionCounter}]`,
      address: `[ADDRESS_${this.redactionCounter}]`,
      amounts: `[AMOUNT_${this.redactionCounter}]`,
    };
    
    return placeholders[type] || `[${type.toUpperCase()}_${this.redactionCounter}]`;
  }
  
  /**
   * Validate that text is safe for AI processing (no PII leaked)
   */
  validateSafeText(text: string): { isSafe: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for common PII patterns that might have been missed
    Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        issues.push(`Potential ${type} found: ${matches.length} instances`);
      }
    });
    
    return {
      isSafe: issues.length === 0,
      issues,
    };
  }
}

// Export singleton instance
export const piiRedactor = new PIIRedactor();

// Utility function for quick redaction
export function redactPIIFromText(text: string, preserveAmounts = true): PIIRedactionResult {
  return piiRedactor.redactPII(text, preserveAmounts);
}

// Validation helper
export function validateTextSafety(text: string): boolean {
  return piiRedactor.validateSafeText(text).isSafe;
}
