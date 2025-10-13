"""
AI Engine Manager
Manages multiple AI providers and handles failover
"""

from typing import Dict, Any, Optional
from abc import ABC, abstractmethod
import asyncio
from loguru import logger

# Lazy imports to avoid circular dependencies
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
try:
    from config.settings import get_settings
except ImportError:
    # Fallback for when running from different directory
    sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
    from config.settings import get_settings

class BaseAIEngine(ABC):
    """Base class for AI engines"""
    
    @abstractmethod
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate AI response"""
        pass
    
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if engine is available"""
        pass

class AIEngineManager:
    """Manages AI engines and handles failover"""
    
    def __init__(self):
        self.engines: Dict[str, BaseAIEngine] = {}
        self.settings = get_settings()
        self._initialize_engines()
    
    def _initialize_engines(self):
        """Initialize available AI engines"""
        # Lazy imports to avoid circular dependencies
        if self.settings.OPENAI_API_KEY and self.settings.OPENAI_API_KEY != "your_openai_api_key_here":
            try:
                from .openai_engine import OpenAIEngine
                self.engines["openai"] = OpenAIEngine(self.settings.OPENAI_API_KEY)
            except ImportError:
                logger.warning("OpenAI engine not available - missing dependencies")
        
        if self.settings.GROQ_API_KEY and self.settings.GROQ_API_KEY != "your_groq_api_key_here":
            try:
                from .groq_engine import GroqEngine
                self.engines["groq"] = GroqEngine(self.settings.GROQ_API_KEY)
            except ImportError:
                logger.warning("Groq engine not available - missing dependencies")
        
        if self.settings.GEMINI_API_KEY and self.settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                from .gemini_engine import GeminiEngine
                self.engines["gemini"] = GeminiEngine(self.settings.GEMINI_API_KEY)
            except ImportError:
                logger.warning("Gemini engine not available - missing dependencies")
    
    async def initialize(self):
        """Initialize all engines"""
        for name, engine in self.engines.items():
            try:
                if await engine.is_available():
                    logger.info(f"AI Engine {name} initialized successfully")
                else:
                    logger.warning(f"AI Engine {name} is not available")
            except Exception as e:
                logger.error(f"Failed to initialize AI Engine {name}: {e}")
    
    async def generate_response(
        self, 
        prompt: str, 
        provider: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate response using specified or default provider"""
        
        # Use specified provider or default
        target_provider = provider or self.settings.DEFAULT_AI_PROVIDER
        
        # Try primary provider first
        if target_provider in self.engines:
            try:
                if await self.engines[target_provider].is_available():
                    return await self.engines[target_provider].generate_response(prompt, **kwargs)
            except Exception as e:
                logger.warning(f"Primary provider {target_provider} failed: {e}")
        
        # Try fallback providers
        for name, engine in self.engines.items():
            if name != target_provider:
                try:
                    if await engine.is_available():
                        logger.info(f"Using fallback provider: {name}")
                        return await engine.generate_response(prompt, **kwargs)
                except Exception as e:
                    logger.warning(f"Fallback provider {name} failed: {e}")
        
        raise Exception("All AI providers are unavailable")
    
    def get_status(self) -> Dict[str, Any]:
        """Get status of all engines"""
        status = {}
        for name, engine in self.engines.items():
            try:
                # Run availability check in event loop
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    # If loop is running, create a task
                    task = asyncio.create_task(engine.is_available())
                    status[name] = {"available": "checking"}
                else:
                    status[name] = {"available": loop.run_until_complete(engine.is_available())}
            except Exception as e:
                status[name] = {"available": False, "error": str(e)}
        
        return status
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up AI engines")
        # Add any cleanup logic here
