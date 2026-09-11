/**
 * Manual test cases for spam protection
 * 
 * To test in development:
 * 1. Start dev server: npm run dev
 * 2. Go to http://localhost:4321/estimate
 * 3. Test each scenario below
 */

// ✅ LEGITIMATE SUBMISSION - Should succeed
const legitimateSubmission = {
  name: "John Smith",
  email: "john.smith@gmail.com",
  phone: "407-555-1234",
  city: "Kissimmee",
  service: "interior-exterior-painting",
  message: "I need my living room and kitchen painted. The walls have some minor damage that may need repair first.",
  formStartedAt: Date.now() - 10000, // 10 seconds ago
  website: "" // Honeypot empty
};

// ❌ SPAM: Honeypot filled - Should be silently dropped
const spamHoneypot = {
  ...legitimateSubmission,
  website: "https://spam-site.com"
};

// ❌ SPAM: Too fast (instant submit) - Should be silently dropped
const spamInstantSubmit = {
  ...legitimateSubmission,
  formStartedAt: Date.now() - 1000 // Only 1 second
};

// ❌ SPAM: Missing formStartedAt - Should be silently dropped
const spamMissingTimestamp = {
  ...legitimateSubmission,
  formStartedAt: undefined
};

// ❌ SPAM: Gibberish name (no vowels) - Should return validation error
const spamGibberishName = {
  ...legitimateSubmission,
  name: "bcdfghjkl",
  formStartedAt: Date.now() - 10000
};

// ❌ SPAM: CamelCase gibberish name - Should return validation error
const spamCamelCaseName = {
  ...legitimateSubmission,
  name: "johnSmithRoofingContactForm",
  formStartedAt: Date.now() - 10000
};

// ❌ SPAM: Gibberish message - Should return validation error
const spamGibberishMessage = {
  ...legitimateSubmission,
  message: "asdfjklAsdfjklQwerty",
  formStartedAt: Date.now() - 10000
};

// ✅ EDGE CASE: Dotted Gmail (legitimate) - Should succeed
const legitimateDottedGmail = {
  ...legitimateSubmission,
  email: "john.a.smith@gmail.com"
};

// ✅ EDGE CASE: Short but valid message - Should succeed
const legitimateShortMessage = {
  ...legitimateSubmission,
  message: "Paint my house"
};

/**
 * To test rate limiting:
 * Submit the same form 6 times rapidly from the same IP
 * The 6th submission should be silently dropped
 */

/**
 * Expected logs for spam:
 * [HONEYPOT] Blocked estimate submission: Honeypot field filled
 * [TIMING GATE] Blocked estimate submission: Form submitted too quickly (1000ms < 2500ms)
 * [RATE LIMIT] Blocked estimate submission: Rate limit exceeded for IP x.x.x.x
 */

export const testCases = {
  legitimate: [legitimateSubmission, legitimateDottedGmail, legitimateShortMessage],
  spam: [spamHoneypot, spamInstantSubmit, spamMissingTimestamp],
  validation: [spamGibberishName, spamCamelCaseName, spamGibberishMessage]
};
