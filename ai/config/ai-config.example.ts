// AI Configuration Example - Phase 1
// Copy this file to ai-config.ts and update with your values

export const AI_CONFIG = {
  // AI Service Backend URL
  baseUrl: process.env.EXPO_PUBLIC_AI_SERVICE_URL || 'http://localhost:3001',
  
  // AI API Key (from your provider)
  apiKey: process.env.EXPO_PUBLIC_AI_API_KEY || '',
  
  // AI Provider Configuration
  provider: (process.env.EXPO_PUBLIC_AI_PROVIDER as 'openai' | 'azure' | 'anthropic') || 'openai',
  model: process.env.EXPO_PUBLIC_AI_MODEL || 'gpt-4o-mini',
  
  // Service Settings
  timeout: parseInt(process.env.EXPO_PUBLIC_AI_TIMEOUT || '10000'),
  retries: parseInt(process.env.EXPO_PUBLIC_AI_RETRIES || '2'),
  
  // Feature Flags
  enabled: process.env.EXPO_PUBLIC_AI_ENABLED !== 'false',
  debug: process.env.EXPO_PUBLIC_AI_DEBUG === 'true',
};

// Validation
export function validateAIConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!AI_CONFIG.apiKey) {
    errors.push('AI_API_KEY is required');
  }
  
  if (!AI_CONFIG.baseUrl) {
    errors.push('AI_SERVICE_URL is required');
  }
  
  if (!['openai', 'azure', 'anthropic'].includes(AI_CONFIG.provider)) {
    errors.push('AI_PROVIDER must be one of: openai, azure, anthropic');
  }
  
  if (AI_CONFIG.timeout < 1000 || AI_CONFIG.timeout > 30000) {
    errors.push('AI_TIMEOUT must be between 1000 and 30000 ms');
  }
  
  if (AI_CONFIG.retries < 0 || AI_CONFIG.retries > 5) {
    errors.push('AI_RETRIES must be between 0 and 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
