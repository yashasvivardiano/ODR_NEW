"""
PII Redaction Utility
Handles redaction of personally identifiable information
"""

import re
from typing import Dict, List, Tuple
from loguru import logger

class PIIRedactor:
    """Redacts PII from text while preserving context"""
    
    def __init__(self):
        self.redaction_counter = 0
        self.patterns = {
            "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
            "phone": re.compile(r'(?:\+91[-.\s]?)?(?:\d{2,4}[-.\s]?)?(?:\d{3,4}[-.\s]?\d{3,4}|\d{10})\b'),
            "pan": re.compile(r'[A-Z]{5}[0-9]{4}[A-Z]{1}'),
            "aadhaar": re.compile(r'\b\d{4}\s?\d{4}\s?\d{4}\b'),
            "credit_card": re.compile(r'\b(?:\d{4}[-.\s]?){3}\d{4}\b'),
            "bank_account": re.compile(r'\b\d{8,18}\b'),
            "common_names": re.compile(r'\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b'),
            "address": re.compile(r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Colony|Nagar)\b', re.IGNORECASE),
            "amounts": re.compile(r'(?:Rs\.?|INR|₹)\s*[\d,]+(?:\.\d{2})?', re.IGNORECASE)
        }
    
    def redact_text(self, text: str, preserve_amounts: bool = True) -> str:
        """Redact PII from text"""
        self.redaction_counter = 0
        redacted_text = text
        
        for pii_type, pattern in self.patterns.items():
            if pii_type == "amounts" and preserve_amounts:
                continue
                
            redacted_text = pattern.sub(
                lambda match: self._generate_placeholder(pii_type),
                redacted_text
            )
        
        return redacted_text
    
    def _generate_placeholder(self, pii_type: str) -> str:
        """Generate contextual placeholder for redacted PII"""
        self.redaction_counter += 1
        
        placeholders = {
            "email": f"[EMAIL_{self.redaction_counter}]",
            "phone": f"[PHONE_{self.redaction_counter}]",
            "pan": f"[PAN_{self.redaction_counter}]",
            "aadhaar": f"[AADHAAR_{self.redaction_counter}]",
            "credit_card": f"[CARD_{self.redaction_counter}]",
            "bank_account": f"[ACCOUNT_{self.redaction_counter}]",
            "common_names": f"[PERSON_{self.redaction_counter}]",
            "address": f"[ADDRESS_{self.redaction_counter}]",
            "amounts": f"[AMOUNT_{self.redaction_counter}]"
        }
        
        return placeholders.get(pii_type, f"[{pii_type.upper()}_{self.redaction_counter}]")
    
    def validate_safe_text(self, text: str) -> Tuple[bool, List[str]]:
        """Validate that text is safe for AI processing"""
        issues = []
        
        for pii_type, pattern in self.patterns.items():
            matches = pattern.findall(text)
            if matches:
                issues.append(f"Potential {pii_type} found: {len(matches)} instances")
        
        return len(issues) == 0, issues
