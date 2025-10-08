"""
Logging setup configuration
"""

import os
from loguru import logger
from config.settings import get_settings

def setup_logging():
    """Setup application logging"""
    settings = get_settings()
    
    # Remove default handler
    logger.remove()
    
    # Add console handler
    logger.add(
        sink=lambda msg: print(msg, end=""),
        level=settings.LOG_LEVEL,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        colorize=True
    )
    
    # Add file handler
    os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)
    logger.add(
        sink=settings.LOG_FILE,
        level=settings.LOG_LEVEL,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        rotation="10 MB",
        retention="7 days",
        compression="zip"
    )
    
    logger.info("Logging setup completed")
