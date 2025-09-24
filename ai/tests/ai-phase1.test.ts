import { aiFilingService } from './ai-service';
import { FilingAssistanceRequest } from './ai-types';
import { piiRedactor } from './pii-redaction';

// Simple mock server bypass: monkey-patch fetch to simulate /ai/file-assist
// without changing app files.
(global as any).fetch = async (_url: string, _options: any) => {
  // Return a static, valid response to verify the client pipeline without parsing the prompt
  const response = {
    suggestions: {
      caseType: {
        recommended: 'Mediation',
        confidence: 0.82,
        rationale: 'Description indicates potential for amicable settlement.',
        alternatives: [
          { type: 'Conciliation', confidence: 0.6, reason: 'Informal settlement may work.' },
        ],
      },
      requiredDocuments: [
        {
          type: 'Contract',
          description: 'Signed contract or agreement between parties.',
          priority: 'Required',
          reason: 'Establishes legal obligations and context.',
        },
        {
          type: 'Email_Communication',
          description: 'Relevant email threads or messages with the respondent.',
          priority: 'Recommended',
          reason: 'Shows attempts to resolve and timeline of events.',
        },
      ],
      fieldHints: {
        title: 'Service agreement dispute',
        jurisdiction: 'Delhi',
        estimatedTimeline: '4-6 weeks',
        suggestedAmount: 25000,
      },
      urgency: {
        level: 'Medium',
        confidence: 0.7,
        factors: ['Ongoing impact', 'Contractual breach indicated'],
      },
    },
  };

  return {
    ok: true,
    status: 200,
    json: async () => response,
    text: async () => JSON.stringify(response),
  } as Response;
};

async function main() {
  // 1) Verify PII redaction works
  const sample =
    'Mr. Rahul Sharma, email rahul@example.com, phone +91 9876543210, at 12 MG Road, Mumbai. Claim amount ₹50,000.';
  const redacted = piiRedactor.redactPII(sample, true);
  console.log('PII redacted:', redacted.redactedText);

  // 2) Call the AI filing service with a sample request
  const request: FilingAssistanceRequest = {
    disputeTitle: 'Service agreement breach',
    disputeDescription:
      'Vendor failed to deliver services per contract despite multiple reminders. Payments made, no delivery for 6 weeks.',
    selectedCaseType: 'Mediation',
    estimatedAmount: 50000,
    jurisdiction: 'Delhi',
    parties: [
      { role: 'Complainant', type: 'Individual' },
      { role: 'Respondent', type: 'Organization' },
    ],
  };

  const result = await aiFilingService.getFilingSuggestions(request);
  console.log('AI suggestions (summary):', {
    caseType: result.suggestions.caseType.recommended,
    confidence: result.suggestions.caseType.confidence,
    urgency: result.suggestions.urgency.level,
    docs: result.suggestions.requiredDocuments.map((d) => `${d.type}:${d.priority}`),
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


