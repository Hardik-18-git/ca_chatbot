<!--
Sync Impact Report
Version change: none (template only) → 1.0.0 (initial constitution)
Modified principles: none; established five initial principles
Added sections: Product and Security Boundaries; Delivery and Quality Gates
Removed sections: none
Follow-up TODO: confirm the original ratification date; it is not recorded in project materials.
-->

# CA Assist Constitution

## Core Principles

### I. Indian CA Domain and Responsible Guidance
CA Assist MUST focus on general Indian income tax, GST, TDS, ITR filing, and accounting.
It MUST politely redirect unrelated questions to these subjects and MUST NOT present its
responses as personalized professional advice. The persistent disclaimer MUST read:
“For general information only. Consult a qualified CA for advice.” These boundaries
reduce the risk of users mistaking a general assistant for a retained professional.

### II. Fixed Model and Typed Integration
The application MUST use only `gemma-4-26b-a4b-it` through the Gemini
`generateContent` REST endpoint. The model identifier MUST be defined once, the fixed
CA-focused system prompt MUST be sent as `systemInstruction`, and requests MUST include
the conversation history. Model and API request/response handling MUST remain in a
dedicated, strictly typed client module; TypeScript `any` MUST NOT be used. This keeps
behavior consistent and the external contract reviewable.

### III. Static-First, Minimal Architecture
The product MUST remain a Vite, React, and TypeScript single-page application hosted on
GitHub Pages. It MUST NOT add a backend, database, serverless function, login, stored
chat history, uploads, streaming, or another model/provider. Styling MUST use plain CSS
and Markdown replies MUST use `react-markdown`; new dependencies MUST remain within the
approved product scope. A static architecture supports zero-touch deployment without
operated infrastructure.

### IV. User Safety, Privacy, and Accessibility
The client MUST read its API key from `import.meta.env.VITE_GEMINI_API_KEY`; the key
MUST NOT be hard-coded, committed, printed, or logged. `.env.local` MUST be ignored and
the production value MUST be injected from the GitHub Actions `GEMINI_API_KEY` secret.
Because a `VITE_` value is observable in downloadable client JavaScript, documentation
MUST state that build-time injection does not make the key confidential and MUST
recommend API/referrer restrictions and quotas. The UI MUST support keyboard operation,
visible focus, responsive layouts, and an ARIA live region for new replies. It MUST show
a thinking state, enforce a 30-second request timeout, provide a retry path for failures,
and explain HTTP 429 as a rate limit. These controls protect user understanding, access,
and responsible API use.

### V. Verifiable Quality and Simple Change
Changes MUST preserve strict TypeScript and ESLint checks and MUST include or update
appropriate checks when behavior changes. Contributors MUST verify lint, type-check,
and a production build where available. The production bundle MUST target under 300 KB
gzipped, and first-load performance MUST target under two seconds on 4G. Implementations
MUST prefer the simplest design satisfying the product requirements and MUST justify
complexity or exceptions. Observable quality gates make regressions detectable before
release.

## Product and Security Boundaries

The product requirements in `prd.md` are the acceptance-criteria source of truth, subject
to this constitution. The approved scope is a general-information assistant for
individuals and small businesses in India. Responses MUST remain appropriately qualified
and MUST NOT imply certainty where tax or accounting circumstances require professional
review. The app MUST NOT retain chat history between sessions.

The API key is necessarily exposed to site visitors when embedded in a browser build.
No contributor or deployment process may claim that a static frontend keeps this key
secret. Repository secrets prevent committing the key but do not replace provider-side
restrictions, quota controls, and monitoring.

## Delivery and Quality Gates

GitHub Actions MUST deploy to GitHub Pages on pushes to `main` and on
`workflow_dispatch`. The workflow MUST run lint and type-check before build/deployment,
use the Pages permission and artifact/deploy flow, and inject the API key only through
the build environment. Vite MUST use the repository-specific Pages base path so deployed
assets resolve correctly. A failed lint or type-check MUST stop deployment.

Feature changes MUST be reviewed against the relevant functional, security, accessibility,
and performance requirements in `prd.md`. Exceptions to a MUST in this constitution
require an explicit constitution amendment rather than an undocumented implementation
deviation.

## Governance

This constitution governs product and engineering decisions for CA Assist. Amendments
MUST be made in `.specify/memory/constitution.md`, include a rationale and a version/date
update, and be reviewed with their impact on the PRD and implementation guidance before
adoption. A change that removes or redefines a principle requires a MAJOR version bump;
a new principle or materially expanded guidance requires a MINOR bump; clarifications
and non-semantic wording changes require a PATCH version bump. The original ratification date
MUST be preserved once confirmed; the last-amended date MUST reflect the date of the
latest adopted amendment.

Every change and release MUST be checked for compliance with the principles above.
Reviewers MUST identify any conflict, missing verification, or justified exception before
approval; CI MUST enforce the automated quality gates specified here. The PRD defines
product acceptance criteria, while this constitution defines non-negotiable governance.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date is not recorded in project materials | **Last Amended**: 2026-09-25
