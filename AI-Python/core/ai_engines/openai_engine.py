"""
OpenAI Engine Implementation
"""

from typing import Dict, Any, Optional
import openai
from loguru import logger

from .manager import BaseAIEngine

class OpenAIEngine(BaseAIEngine):
    """OpenAI API engine"""
    
    def __init__(self, api_key: str):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.api_key = api_key
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using OpenAI API"""
        try:
            model = kwargs.get("model", "gpt-4o-mini")
            temperature = kwargs.get("temperature", 0.1)
            max_tokens = kwargs.get("max_tokens", 1500)
            
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a legal intake assistant for an Online Dispute Resolution platform in India. Return ONLY valid JSON responses."},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return {
                "content": response.choices[0].message.content,
                "provider": "openai",
                "model": model,
                "usage": response.usage.dict() if response.usage else None
            }
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise
    
    async def is_available(self) -> bool:
        """Check if OpenAI API is available"""
        try:
            # Simple test request
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "test"}],
                max_tokens=1
            )
            return True
        except Exception as e:
            logger.warning(f"OpenAI API not available: {e}")
            return False
