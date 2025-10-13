## 1. Project Overview

- Project name: ODR (Online Dispute Resolution)
- Concise summary: This repository implements a cross-platform Online Dispute Resolution system with a React Native (Expo) mobile app, a Next.js webapp, and a Node/Express backend. The project includes AI-assisted features for case filing, document analysis, mediator matching, hearing transcription/analysis, and settlement suggestions.
- Main purpose and features:
  - Allow users to create and manage dispute cases (intake, documents, parties).
  - Provide AI-driven suggestions for filing, mediator matching, settlement options, and hearing analysis.
  - Support audio/video processing pipelines for hearings (transcription, speaker identification, judgment extraction).
  - Provide simple auth and user/case APIs (scaffolded in `backend/`).
  - Mobile-first UX with an Expo React Native app and a Next.js web frontend.
- Technologies used:
  - Backend: Node.js, Express, Mongoose (MongoDB), Helmet, cors, express-rate-limit, multer
  - AI: custom AI service layer (phase 1 & 2), prompt templates, PII redaction utilities
  - Mobile: Expo, React Native, TypeScript
  - Web: Next.js (TypeScript)
  - Dev tooling: nodemon, dotenv

---

## 2. File and Module Summary

Below are the major files/modules and a short description of each. Focus on files that implement core behavior.

1. `backend/server.js`
   - Purpose: Entry point for the backend API server.
   - Main functions: Sets up Express app, security middleware (helmet, cors), rate limiting, body parsers, dynamic route loading, and basic endpoints (`/api/health`, `/api/status`, `/api/test`). Starts the server.
   - Dependencies: `express`, `mongoose`, `helmet`, `cors`, `express-rate-limit`, `dotenv`.

2. `backend/routes/ai.js`
   - Purpose: Placeholder AI-related REST endpoints used by the backend.
   - Main routes: `/analyze-case`, `/analyze-document`, `/match-mediator`, `/analyze-hearing`, `/suggest-settlement`, `/file-assist`.
   - Key logic: Uses `multer` for file uploads (documents/audio), returns mocked AI analysis payloads. These act as hooks where actual AI provider integration should be plugged in.
   - Dependencies: `express`, `multer`, `path`.

3. `ai/services/ai-service.ts`
   - Purpose: Client-side (shared JS/TS) AI filing assistance service used by the mobile/web app and possibly by the backend to call a central AI microservice.
   - Main classes/functions: `AIFilingService` class, `getFilingSuggestions`, `prepareSafeInput`, `callAIProvider`, `makeAIRequest`, `validateAIResponse`, `useAIFilingSuggestions` hook.
   - Key patterns: PII redaction before sending to AI, prompt templating, retries with exponential backoff, timeout/abort handling, response validation.
   - Dependencies: `fetch` (global), local PII utilities (`pii-redaction`), and a set of typed interfaces in `ai-types`.

4. `ai/services/hearing-ai-service.ts`
   - Purpose: Longer-term service that models an end-to-end hearing processing pipeline (video -> audio -> transcript -> judgment extraction -> PDF -> calendar integration).
   - Main classes/functions: `HearingAIService`, `processHearingVideo`, `processVideoAsync`, pipeline stages (`extractAudio`, `transcribeAudio`, `identifySpeakers`, `extractJudgment`, `analyzeCaseProbability`, `generateJudgmentPDFs`, `scheduleNextHearing`).
   - Key patterns: Queued async processing with in-memory queue, stage updates, calls to external AI providers.

5. `ai/utils/pii-redaction.ts`
   - Purpose: Utility for redacting PII before sending data to AI providers.
   - Main functions/classes: `PIIRedactor`, `redactPIIFromText`, `validateTextSafety`.
   - Logic: Regex-based patterns for emails, phone numbers, PAN, Aadhaar, amounts, names, addresses; placeholders mapping and restoration.

6. `ai/config/ai-config.example.ts`
   - Purpose: Example configuration for AI provider integration. Contains base URL, API key, provider selection, model, timeouts, retries, and validation routines.

7. `backend/package.json` and `package.json` (root)
   - Purpose: Package metadata and scripts for backend and mobile app respectively. Useful to know scripts to start server/app and dependencies installed.

8. `backend/tests/api-test.js`
   - Purpose: A small test script (axios-based) created to exercise `/api/health`, `/api/status`, and `/api/ai/analyze-case` endpoints.

9. Other important directories (summary):
   - `ai/components/` — UI components for AI suggestions used in the app (React Native components).
   - `ai/hooks/` — Example hooks such as `useAISuggestions.ts` to connect UI to AI services.
   - `backend/models/` — Mongoose model scaffolds (Case, Mediator, User) — data schemas for persistence.
   - `webapp/` — Next.js frontend with pages for login, signup, dashboard, AI filing page.
   - `src/screens/` — Mobile screens (Dashboard, Login, SignUp) for the Expo app.

---

## 3. Architecture and Data Flow

High-level architecture:

- Clients:
  - Expo React Native mobile app (root `App.tsx`, `src/screens/*`) — primary mobile interface
  - Next.js webapp (`webapp/src/*`) — web access for certain workflows

- Backend API:
  - `backend/server.js` which mounts REST endpoints and optionally connects to MongoDB via Mongoose
  - Routes live in `backend/routes/*` (auth, users, cases, mediators, ai)

- AI Services:
  - `ai/services/*` contains client and server-side logic for calling an AI microservice or provider
  - The project expects either an internal AI service at `EXPO_PUBLIC_AI_SERVICE_URL` or direct provider integration

- Storage & infrastructure:
  - MongoDB (optional) for persistence (models in `backend/models/`)
  - File uploads handled locally by `multer` or expected to be offloaded to S3 (hearing video storage config in `hearing-ai-service.ts`)

Data flow (example: filing suggestion flow):

1. User fills out dispute intake on mobile/web and submits a filing request (title, description, parties, documents, amount).
2. Client calls backend API (`POST /api/ai/file-assist`) or directly calls AI service endpoint (depending on front-end wiring).
3. Backend route (or client library `AIFilingService`) prepares input: it redacts PII using `pii-redaction`, sanitizes filenames, and formats a JSON prompt according to the `PROMPT_TEMPLATES`.
4. The AI client sends the prompt to the configured AI provider endpoint (internal microservice or external API) with authentication headers and request metadata.
5. Provider returns structured JSON. The client validates the structure (`validateAIResponse`) and returns suggestions to the caller.
6. UI displays structured suggestions (case type, required documents, field hints, urgency) and metadata (confidence, model version).

For long-running hearing processing the pipeline is asynchronous:

1. Client uploads a hearing video to a backend endpoint.
2. The hearing AI service enqueues the job and returns a session id.
3. Worker pipeline processes the video step-by-step (extraction → transcription → speaker ID → judgment extraction → analysis → PDF generation → calendar scheduling), updating stage state in an in-memory queue (or DB in production).
4. Client polls a status endpoint to retrieve current progress and final results.

---

## 4. Key Concepts and Logic

1. PII Redaction
   - What: Identify and replace personally identifiable information before sending it to external AI services.
   - Why: Privacy, legal compliance, and preventing sensitive data leakage to third-party models.
   - How: Regex-based patterns, placeholders, optional restoration.

2. Prompt Templating and Strict JSON Responses
   - What: Templates that instruct LLMs to return only structured JSON to ease parsing.
   - Why: Reduce hallucination and parsing errors; make AI output machine-readable.

3. Retry and Backoff
   - What: When calling external AI providers, requests are retried with exponential backoff.
   - Why: Improve resiliency against transient network or provider hiccups.

4. Streaming / Timeout Control
   - What: AbortController with a configured timeout is used to avoid hanging requests.
   - Why: Prevent resource exhaustion and give predictable latencies.

5. File Upload Handling
   - What: `multer` stores uploaded files locally (for dev) and limits file size.
   - Why: Accept documents, audio, and video for AI analysis; must be replaced by cloud storage for production.

6. Async Processing Pipeline for Hearings
   - What: In-memory queue + staged processing (video conversion, transcription, speaker diarization, NLP extraction).
   - Why: Long-running media processing cannot be handled synchronously in a request-response cycle.

7. Dynamic Route Loading
   - What: `server.js` checks for route files and conditionally mounts them.
   - Why: Allow modularity and run the server even if certain routes are missing during early dev/testing.

8. Response Validation
   - What: After receiving AI responses, the service asserts required fields and valid enumerations (case types).
   - Why: Prevent invalid downstream data and provide clear error messages.

9. Configuration-driven Provider Selection
   - What: `ai-config` supports `openai`, `azure`, `anthropic` and environment-driven configuration.
   - Why: Make the system portable across AI providers and environments.

10. Health & Observability Endpoints
   - What: `/api/health`, `/api/status`, `/api/test` for simple checks.
   - Why: Useful for deployment health checks, readiness/liveness probes, and local debugging.

---

## 5. Student Evaluation Questions

Section A — Conceptual (purpose & features)
1. What is the primary goal of the ODR project and which core user problems does it aim to solve?
2. Why is PII redaction important when integrating AI models into legal workflows?
3. Explain the difference between synchronous REST endpoints and the asynchronous hearing processing pipeline in this project.
4. Describe how the project balances local file uploads and cloud storage for media—what are the trade-offs?
5. What is prompt templating and why does the code require LLMs to return strict JSON?

Section B — Code comprehension
1. In `backend/server.js`, explain how dynamic route loading works and why it is useful during development.
2. Walk through `AIFilingService.getFilingSuggestions` — what steps does it perform from input to returned suggestions?
3. In `pii-redaction.ts`, how does the redaction placeholder mechanism allow later restoration of PII?
4. Explain the retry logic in `ai-service.ts` — how are retries scheduled and how are timeouts handled?
5. In `hearing-ai-service.ts`, what stages are executed by `processVideoAsync` and how is progress updated?

Section C — Debugging / reasoning
1. If the AI provider returns a 200 OK but the JSON misses `suggestions.caseType.recommended`, what will happen in `validateAIResponse`? How should the system handle this gracefully?
2. Predict the output of calling `POST /api/ai/analyze-case` with an empty payload against the current `backend/routes/ai.js` implementation.
3. Suppose `redactPIIFromText` fails to remove an Aadhaar number due to formatting differences; how could you detect and fix this problem?
4. If the `makeAIRequest` call always times out, what parts of the flow would you inspect first? List at least three checks.
5. The hearing processing queue stores jobs in memory. Explain a scenario where this design will fail and propose a fix.

Section D — Design / architecture
1. Discuss pros and cons of calling the AI provider directly from the frontend vs. routing requests via the backend.
2. The project uses regex for PII redaction. What are the limitations of regex-based approaches and what would you propose instead for production?
3. How would you redesign the hearing processing pipeline to be horizontally scalable and resilient to server restarts?

Section E — Practical exercises
1. Implement a new endpoint `POST /api/ai/benchmark` that accepts a list of prompts and returns response time and token usage for each prompt (mock token usage if unavailable).
2. Replace the in-memory hearing processing queue with a Redis-backed queue (e.g., BullMQ). Provide code changes for queue enqueue/dequeue and a worker script.
3. Improve `pii-redaction.ts` by adding a Named Entity Recognition (NER) step using a small open-source model (or an external API) to reduce false positives/negatives. Document how you would evaluate accuracy.
4. Add end-to-end tests for the AI filing flow: create a test that posts a filing request and asserts the returned suggestions JSON shape.
5. Add role-based access control to `backend/server.js` routes so that only authenticated mediator users can call `/api/ai/match-mediator`.

---

## 6. References (files to study first)

- `backend/server.js` — central server wiring, middleware, and route loading (start here).
- `backend/routes/ai.js` — shows all AI endpoints and their expected payloads and current mock implementations.
- `ai/services/ai-service.ts` — client-side AI service with prompt templates, PII handling, retries, and response validation.
- `ai/utils/pii-redaction.ts` — PII redaction strategy and patterns (important for privacy/security).
- `ai/services/hearing-ai-service.ts` — advanced pipeline for media processing; good to understand staged async processing.
- `ai/config/ai-config.example.ts` — how provider selection and timeouts/retries are configured.
- `backend/models/` — data models for storage and domain concepts (cases, users, mediators).
- `webapp/src/app/ai-filing/page.tsx` and `ai/components/*` — front-end code that shows how AI suggestions are presented to users.

---

## Final Notes

- The repository is scaffolded with clear AI-focused components and placeholder implementations. Key next steps for a student or developer are:
  1. Wire `ai-service` to a real AI provider or an internal AI microservice.
  2. Harden PII redaction (NER + more tests) before sending production data to third-party LLMs.
  3. Replace local file storage and in-memory queues with durable services (S3/MinIO, Redis queues).
  4. Add comprehensive unit/integration tests for AI flows and the hearing pipeline.

This document is intended to be a concise, shareable briefing for interviewers, students, or new contributors to get productive quickly.
