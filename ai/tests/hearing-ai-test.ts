// Court Hearing AI System Test - Phase 2

import { hearingAIService } from './hearing-ai-service';

async function testHearingAISystem() {
  console.log('🎥 Testing Court Hearing AI System...\n');

  try {
    // Test 1: Process a mock hearing video
    console.log('1. Starting hearing video processing...');
    const processingRequest = {
      videoUrl: 'https://example.com/court-hearing-sample.mp4',
      caseId: 'CASE_2024_001',
      hearingDate: new Date().toISOString(),
      participants: [
        { id: 'judge_1', name: 'Hon. Judge Smith', role: 'judge' },
        { id: 'lawyer_p', name: 'Attorney Johnson', role: 'lawyer_plaintiff' },
        { id: 'lawyer_d', name: 'Attorney Williams', role: 'lawyer_defendant' },
        { id: 'plaintiff', name: 'John Doe', role: 'plaintiff' },
        { id: 'defendant', name: 'XYZ Corp', role: 'defendant' }
      ],
      language: 'en-US'
    };

    const processingResponse = await fetch('http://localhost:3001/ai/hearing/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processingRequest)
    });

    if (!processingResponse.ok) {
      throw new Error('Failed to start processing');
    }

    const processingData = await processingResponse.json();
    console.log('✅ Processing started:', {
      sessionId: processingData.sessionId,
      status: processingData.status,
      stages: processingData.stages.length
    });

    // Test 2: Monitor processing status
    console.log('\n2. Monitoring processing status...');
    let attempts = 0;
    const maxAttempts = 30; // 1 minute max wait

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`http://localhost:3001/ai/hearing/status/${processingData.sessionId}`);
      if (!statusResponse.ok) break;

      const status = await statusResponse.json();
      console.log(`   Progress: ${status.progress}% (${status.status})`);

      if (status.status === 'completed') {
        console.log('✅ Processing completed!');
        
        // Test 3: Get transcript
        console.log('\n3. Retrieving hearing transcript...');
        const transcriptResponse = await fetch(`http://localhost:3001/ai/hearing/transcript/${processingData.sessionId}`);
        if (transcriptResponse.ok) {
          const transcript = await transcriptResponse.json();
          console.log('✅ Transcript retrieved:', {
            segments: transcript.segments.length,
            confidence: transcript.confidence,
            judgmentPoints: transcript.segments.filter((s: any) => s.isJudgmentPoint).length
          });

          // Show sample transcript segments
          console.log('\n   Sample transcript segments:');
          transcript.segments.slice(0, 3).forEach((segment: any, index: number) => {
            console.log(`   ${index + 1}. [${segment.speakerRole.toUpperCase()}] ${segment.text.substring(0, 80)}...`);
          });
        }

        // Test 4: Get probability analysis
        console.log('\n4. Retrieving probability analysis...');
        const probabilityResponse = await fetch(`http://localhost:3001/ai/hearing/probability/${processingData.sessionId}`);
        if (probabilityResponse.ok) {
          const analysis = await probabilityResponse.json();
          console.log('✅ Probability analysis:', {
            plaintiff: analysis.overallProbability.plaintiff + '%',
            defendant: analysis.overallProbability.defendant + '%',
            confidence: Math.round(analysis.confidence * 100) + '%',
            keyFactors: analysis.keyFactors.length
          });

          console.log('\n   Key factors affecting the case:');
          analysis.keyFactors.forEach((factor: any, index: number) => {
            const impact = factor.impact === 'positive' ? '✅' : factor.impact === 'negative' ? '❌' : '⚪';
            console.log(`   ${impact} ${factor.factor} (${factor.party}, ${Math.round(factor.strength * 100)}%)`);
          });
        }

        break;
      } else if (status.status === 'failed') {
        console.log('❌ Processing failed');
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    if (attempts >= maxAttempts) {
      console.log('⏱️ Processing timeout - check status later');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test backend health with new endpoints
async function testBackendHealth() {
  console.log('\n🏥 Testing backend health...');
  
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      const health = await response.json();
      console.log('✅ Backend health:', {
        status: health.status,
        activeProvider: health.activeProvider,
        configured: health.configured
      });
    }

    // Test root endpoint for new features
    const rootResponse = await fetch('http://localhost:3001/');
    if (rootResponse.ok) {
      const root = await rootResponse.json();
      console.log('✅ Available endpoints:', root.endpoints.length);
      root.endpoints.forEach((endpoint: string) => {
        console.log(`   • ${endpoint}`);
      });
    }
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
  }
}

// Main test runner
async function main() {
  console.log('🚀 ODR AI System - Phase 2 Testing\n');
  console.log('Features being tested:');
  console.log('• Video & Audio Processing Pipeline');
  console.log('• Speech-to-Text with Speaker ID');
  console.log('• Judgment Extraction');
  console.log('• Case Probability Analysis');
  console.log('• Real-time Processing Status');
  console.log('• Transcript Generation\n');

  await testBackendHealth();
  await testHearingAISystem();

  console.log('\n🎉 Phase 2 testing completed!');
  console.log('\nNext steps for full implementation:');
  console.log('• Integrate FFmpeg for real video processing');
  console.log('• Add Whisper/Google Speech API');
  console.log('• Implement PDF generation');
  console.log('• Connect Google Calendar API');
  console.log('• Add secure video storage');
  console.log('• Build admin dashboard');
}

main().catch(console.error);
