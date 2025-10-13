"""
Google Gemini Engine Implementation
"""

from typing import Dict, Any, Optional
import google.generativeai as genai
from loguru import logger

from .manager import BaseAIEngine

class GeminiEngine(BaseAIEngine):
    """Google Gemini API engine"""
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.api_key = api_key
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using Gemini API"""
        try:
            temperature = kwargs.get("temperature", 0.1)
            max_tokens = kwargs.get("max_tokens", 1500)
            
            # Configure generation parameters
            generation_config = genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens
            )
            
            # Create system prompt
            system_prompt = "You are a legal intake assistant for an Online Dispute Resolution platform in India. Return ONLY valid JSON responses."
            full_prompt = f"{system_prompt}\n\nUser: {prompt}"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config
            )
            
            return {
                "content": response.text,
                "provider": "gemini",
                "model": "gemini-2.0-flash",
                "usage": {
                    "prompt_tokens": len(full_prompt.split()),
                    "completion_tokens": len(response.text.split()) if response.text else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise
    
    async def is_available(self) -> bool:
        """Check if Gemini API is available"""
        try:
            # Simple test request
            response = self.model.generate_content("test")
            return True
        except Exception as e:
            logger.warning(f"Gemini API not available: {e}")
            return False
