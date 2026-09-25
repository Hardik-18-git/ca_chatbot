# Feature Specification: CA Assist Chatbot

**Feature Branch**: `001-ca-assist-chatbot`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "Create the CA Assist feature specification from the project PRD."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Get Indian Tax and Accounting Guidance (Priority: P1)

An individual or small business owner in India asks a question about income tax, GST,
TDS, ITR filing, or accounting and receives a clear, professional answer for general
information. If the user asks about an unrelated subject, the assistant politely declines
and points them back to supported topics. Answers are not presented as personalized
professional advice.

**Why this priority**: Providing useful and appropriately scoped CA guidance is the
product's primary purpose.

**Independent Test**: Submit representative questions from each supported topic and an
unrelated question. Verify useful topic-appropriate answers, a polite redirect for the
unrelated question, and the general-information qualification.

**Acceptance Scenarios**:

1. **Given** a user is viewing a new conversation, **When** they submit a question about
   an Indian tax or accounting topic, **Then** the assistant returns a relevant,
   professional general-information response.
2. **Given** a user submits a question unrelated to Indian CA topics, **When** the
   assistant responds, **Then** it politely declines that request and redirects the user
   to income tax, GST, TDS, ITR filing, or accounting.
3. **Given** the assistant provides any response, **When** the user reads it, **Then** the
   response does not claim to be personalized professional advice and the persistent
   disclaimer remains visible.
4. **Given** a user has already asked a question, **When** they ask a related follow-up,
  **Then** the answer reflects the earlier conversation rather than treating the
  follow-up as an unrelated first question.
5. **Given** a user opens the conversation, **When** they use the product, **Then** they
  are not offered a choice of assistant model or service.

---

### User Story 2 - Understand Waiting and Recover from Errors (Priority: P2)

A user can tell when an answer is being prepared. If a request fails, takes too long, or
is rate limited, the user receives an understandable explanation and can retry without
having to re-enter the question.

**Why this priority**: Clear waiting and recovery states prevent uncertainty and make
transient service problems recoverable.

**Independent Test**: Simulate a delayed response, a request failure, a timeout, and a
rate-limit response. Verify the waiting state, appropriate error message, and successful
retry path.

**Acceptance Scenarios**:

1. **Given** a submitted question is awaiting a response, **When** the request is pending,
   **Then** the interface visibly indicates that the assistant is thinking.
2. **Given** a request fails or has not completed within 30 seconds, **When** the failure
   is shown, **Then** the user sees a safe explanation and a retry action that preserves
   the question.
3. **Given** the service rejects a request because of a rate limit, **When** the error
   is displayed, **Then** it clearly explains that requests are temporarily limited and
   offers a retry path.

---

### User Story 3 - Manage and Access a Conversation (Priority: P3)

A user can send questions using the keyboard or on-screen controls, read formatted
responses on desktop or mobile, and start over when they want a clean conversation.
Conversation content is temporary and is not retained between sessions.

**Why this priority**: Accessible conversation controls and responsive presentation make
core guidance usable across devices and interaction preferences.

**Independent Test**: Use keyboard-only navigation and a mobile-sized viewport to ask a
question, read its answer, and start a new conversation. Verify controls, readability,
focus visibility, and that the prior conversation is cleared.

**Acceptance Scenarios**:

1. **Given** a user has entered a question, **When** they press Enter or activate Send,
   **Then** the question is submitted and appears in the conversation.
2. **Given** a conversation contains messages, **When** the user starts a new chat,
   **Then** the visible conversation is cleared and a late response from the previous
   conversation does not reappear.
3. **Given** a new assistant response is added, **When** a user relies on assistive
   technology, **Then** the response is announced through a live region and all controls
   remain keyboard-operable with visible focus.
4. **Given** a user views the application on a mobile or desktop screen, **When** the
   conversation is displayed, **Then** the controls and persistent disclaimer remain
   visible and usable without horizontal overflow.
5. **Given** an assistant response includes lists, emphasis, or a table, **When** it is
  displayed, **Then** its formatting remains readable on desktop and narrow screens.
6. **Given** a user starts a later session, **When** the application opens, **Then** the
  previous session's conversation is not restored.

### Edge Cases

- Submitting an empty or whitespace-only question does not add a message or start a
  request.
- While a request is pending, the interface prevents accidental duplicate submissions
  and keeps the pending state understandable.
- If a request fails, the original question remains available for retry and is not
  duplicated in the visible conversation.
- If a response is empty or cannot be displayed, the user receives a recoverable error
  instead of a blank or broken conversation.
- Starting a new chat while a request is pending clears the old conversation; a delayed
  response from it is discarded.
- When configuration needed to contact the assistant is unavailable, the user sees a
  clear setup/service-unavailable message that does not expose credential values.
- A response containing Markdown lists, emphasis, or tables remains readable on narrow
  screens.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST provide a conversation view, a text-entry control, and a
  Send action. Pressing Enter MUST submit the current non-empty question.
- **FR-002**: The assistant MUST use the full current conversation context when
  responding and MUST not offer users a choice of assistant model or service.
- **FR-003**: The assistant MUST be focused on general Indian income tax, GST, TDS, ITR
  filing, and accounting questions.
- **FR-004**: The assistant MUST politely redirect questions outside those topics to
  supported CA topics.
- **FR-005**: Assistant responses MUST be clear and professional, MUST be presented as
  general information rather than personalized professional advice, and MUST support
  readable Markdown formatting including lists, emphasis, and tables.
- **FR-006**: The product MUST show a visible thinking state while a response is pending.
- **FR-007**: If a request fails or exceeds 30 seconds, the product MUST show a
  user-safe error and a retry action that allows the user to retry the original question.
- **FR-008**: If the service indicates a rate limit, the product MUST show an explanation
  specific to temporary request limits and a retry path.
- **FR-009**: The exact disclaimer “For general information only. Consult a qualified CA
  for advice.” MUST remain visible throughout the application.
- **FR-010**: The product MUST provide a New Chat action that clears the current
  conversation and prevents responses from an earlier conversation from repopulating it.
- **FR-011**: Conversation content MUST NOT be retained after the user ends the session.
- **FR-012**: The product MUST remain usable on mobile and desktop, support full keyboard
  navigation and visible focus, and announce new assistant responses through an ARIA live
  region.
- **FR-013**: The product MUST prevent credentials from being committed, hard-coded,
  printed, or logged. User-facing setup or deployment guidance MUST explain that
  credentials made available to a public web application are observable by site visitors
  and recommend suitable access restrictions and usage quotas.

### Key Entities

- **Conversation**: The temporary sequence of questions and assistant responses visible
  during the current session; it is cleared when a new chat starts and is not retained
  between sessions.
- **Message**: A user question or assistant response, including its speaker, text, and
  position in the current conversation.

## Success Criteria

### Measurable Outcomes

- **SC-001**: In a test set of at least 25 supported questions (at least five per
  supported topic) and five unrelated questions, 100% of supported questions receive
  responses rated relevant under a documented CA review rubric, and all unrelated
  questions receive a polite redirect.
- **SC-002**: A pending request displays a thinking state, and a request that remains
  unresolved is reported as timed out no later than 30 seconds after submission.
- **SC-003**: Every simulated request failure and rate-limit case presents a clear message
  and a retry action that successfully resubmits the original question when service is
  available.
- **SC-004**: The disclaimer is visible on all tested mobile and desktop viewports, and
  the core conversation flow can be completed using only a keyboard.
- **SC-005**: At least 9 out of 10 first-time participants in a usability test can ask a
  supported question, identify the assistant's answer as general information, and start
  a new chat without assistance.
- **SC-006**: On a 4G connection, the initial application view becomes usable in under
  two seconds.
- **SC-007**: Review of the released product finds no credential value in committed
  project files, and user-facing guidance accurately explains public-client credential
  visibility.

## Assumptions

- The primary users are individuals and small business owners in India seeking quick,
  general tax or accounting information.
- Users have an internet connection while asking questions; offline answer generation is
  not required.
- One product-approved assistant service is configured for all users; service selection
  is outside user scope.
- Conversation history exists only for the current active session and is cleared by New
  Chat or when the session ends.
- The assistant provides informational guidance, not a substitute for a qualified CA's
  review of an individual's circumstances.
- The 9-out-of-10 usability threshold is an acceptance target adopted for this feature;
  the test should include first-time users representative of the intended audience.
