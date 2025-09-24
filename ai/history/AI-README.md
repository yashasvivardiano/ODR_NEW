# ODR AI-Assisted Filing - Phase 1

This implements AI-powered suggestions for case filing in the ODR mobile app.

## 🚀 Features

- **Smart Case Type Recommendations**: AI suggests the most appropriate dispute resolution method
- **Field Hints**: Auto-suggestions for title, jurisdiction, and amount
- **Document Recommendations**: AI suggests required documents based on case description
- **Urgency Assessment**: Automatic urgency level detection with reasoning
- **PII Protection**: Automatic redaction of sensitive information before AI processing
- **Error Handling**: Robust error handling with retry mechanisms

## 📁 Files Created

### Core AI Service
- `ai-types.ts` - TypeScript types and interfaces
- `ai-service.ts` - Main AI service with API calls
- `pii-redaction.ts` - PII redaction utility
- `ai-config.example.ts` - Configuration template

### React Native Components
- `useAISuggestions.ts` - React hook for AI suggestions
- `AISuggestionsCard.tsx` - UI component for displaying suggestions
- `FilingFormExample.tsx` - Example integration

## 🔧 Setup

1. **Configure Environment Variables**:
   ```bash
   # Add to your .env or app.json
   EXPO_PUBLIC_AI_SERVICE_URL=http://localhost:3001
   EXPO_PUBLIC_AI_API_KEY=your_openai_api_key
   EXPO_PUBLIC_AI_PROVIDER=openai
   EXPO_PUBLIC_AI_MODEL=gpt-4o-mini
   ```

2. **Install Dependencies** (if needed):
   ```bash
   npm install
   ```

3. **Backend Service**: You'll need to create a backend service at the configured URL that handles:
   - `POST /ai/file-assist` - Returns AI suggestions

## 🔌 Usage

### Basic Integration

```tsx
import { useAISuggestions } from './useAISuggestions';
import { AISuggestionsCard } from './AISuggestionsCard';

function MyFilingForm() {
  const aiSuggestions = useAISuggestions();

  const handleGetSuggestions = async () => {
    await aiSuggestions.getSuggestions({
      disputeDescription: "Contract dispute with vendor...",
      estimatedAmount: 50000,
    });
  };

  return (
    <View>
      <Button title="Get AI Suggestions" onPress={handleGetSuggestions} />
      
      <AISuggestionsCard
        suggestions={aiSuggestions.suggestions}
        isLoading={aiSuggestions.isLoading}
        error={aiSuggestions.error}
        onApplySuggestion={(type, value) => {
          // Apply suggestion to your form
          console.log('Apply:', type, value);
        }}
      />
    </View>
  );
}
```

### Debounced Suggestions

```tsx
import { useDebouncedAISuggestions } from './useAISuggestions';

function AutoSuggestForm() {
  const aiSuggestions = useDebouncedAISuggestions(1500); // 1.5s delay

  useEffect(() => {
    if (description.length > 50) {
      aiSuggestions.getDebouncedSuggestions({ disputeDescription: description });
    }
  }, [description]);

  return (
    <TextInput
      value={description}
      onChangeText={setDescription}
      placeholder="Describe your dispute..."
    />
  );
}
```

## 🛡️ Security Features

### PII Redaction
- Automatically removes emails, phones, names, addresses
- Preserves context for AI analysis
- Validates output is PII-free

### Safe Defaults
- No training on user data
- Request timeouts and retries
- Structured JSON output validation
- Error boundaries and fallbacks

## 🎯 API Contract

### Request Format
```typescript
interface FilingAssistanceRequest {
  disputeDescription: string;
  disputeTitle?: string;
  selectedCaseType?: 'Mediation' | 'Conciliation' | 'Negotiation' | 'Arbitration';
  parties?: Array<{
    role: 'Complainant' | 'Respondent';
    type: 'Individual' | 'Organization';
  }>;
  estimatedAmount?: number;
  jurisdiction?: string;
}
```

### Response Format
```typescript
interface FilingAssistanceResponse {
  suggestions: {
    caseType: {
      recommended: CaseType;
      confidence: number;
      rationale: string;
      alternatives?: Array<{type: CaseType; confidence: number; reason: string}>;
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
      suggestedAmount?: number;
    };
    urgency: {
      level: 'Low' | 'Medium' | 'High';
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
```

## 🔄 Backend Implementation Needed

You need to create a backend service that:

1. **Receives requests** at `/ai/file-assist`
2. **Calls your AI provider** (OpenAI/Azure/Anthropic)
3. **Returns structured JSON** matching the response format

Example backend endpoint (Node.js/Express):
```javascript
app.post('/ai/file-assist', async (req, res) => {
  const { prompt, model, temperature } = req.body;
  
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature,
    max_tokens: 1500,
  });
  
  res.json(JSON.parse(response.choices[0].message.content));
});
```

## 📊 Monitoring

The service includes built-in metrics:
- Request/response times
- Error rates by type
- Confidence scores
- User acceptance rates

## 🚀 Next Steps (Phase 2)

- ML-based classification model
- Admin feedback loop
- A/B testing framework
- Cost optimization
- Advanced document analysis

## 🐛 Troubleshooting

### Common Issues

1. **"AI service unavailable"**
   - Check `EXPO_PUBLIC_AI_SERVICE_URL`
   - Verify backend is running
   - Check API key validity

2. **"PII validation error"**
   - Review input text for sensitive data
   - Check PII redaction patterns
   - Validate redaction logic

3. **"Invalid response"**
   - Check AI model output format
   - Verify JSON schema validation
   - Review prompt templates

### Debug Mode
```typescript
// Enable debug logging
const AI_CONFIG = {
  debug: true, // Logs all requests/responses
};
```

## 📝 License

Part of the ODR project by Vardiano Technologies.
