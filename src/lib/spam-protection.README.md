# Spam Protection Library

Shared spam protection utilities for all lead forms (estimate, contact, quote, etc.).

## Features

1. **Honeypot Field** - Hidden field that bots fill but humans don't see
2. **Timing Gate** - Blocks submissions faster than 2.5 seconds (bots)
3. **Gibberish Detection** - Validates names, cities, and messages for common spam patterns:
   - No-vowel strings
   - CamelCase gibberish
   - Nonsense text mixed with real options
4. **Per-IP Rate Limiting** - Max 5 requests per 10 minutes per IP
5. **Silent Drop** - Returns 200 OK to bots without persisting data
6. **Logging** - All spam rejections logged with reason tags

## Usage

### In API Route Handler

```typescript
import {
  checkSpam,
  logSpamRejection,
  silentDrop,
  validateName,
  validateEmail,
  validatePhone,
  validateCity,
  validateMessage,
  validateService,
} from '../../lib/spam-protection';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  
  // Run all spam checks
  const spamCheck = checkSpam(data, request);
  if (spamCheck.isSpam) {
    logSpamRejection(spamCheck, 'form-type');
    return silentDrop('Form Type');
  }
  
  // Validate individual fields
  let error = validateName(data.name);
  if (error) {
    return new Response(
      JSON.stringify({ error }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // ... more validation ...
  
  // Process legitimate submission
};
```

### In Frontend Form

```html
<!-- Honeypot field (hidden from humans, visible to bots) -->
<div style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;" aria-hidden="true">
  <label for="website">Website</label>
  <input
    type="text"
    id="website"
    name="website"
    tabindex="-1"
    autocomplete="off"
  />
</div>

<script>
  // Record form start time
  const formStartedAt = Date.now();
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add timing data and honeypot
    data.formStartedAt = formStartedAt;
    data.website = data.website || '';
    
    // Submit to API
    const response = await fetch('/api/your-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  });
</script>
```

## Validation Functions

- `validateName(name)` - 2-80 chars, has vowels, no camelCase gibberish
- `validateEmail(email)` - Basic email format (allows dotted Gmail)
- `validatePhone(phone)` - 10-11 digits
- `validateCity(city)` - 2-60 chars, letters/spaces/hyphens/apostrophes/periods only
- `validateMessage(message)` - Min 12 chars, no camelCase spam tokens
- `validateService(service, validServices)` - Must be in allowed list

## Protection Patterns Blocked

- Random gibberish names (e.g., `dfghjkdfgh`, `bcdfghjk`)
- Extreme dotted Gmail addresses (e.g., `a.b.c.d.e.f.g@gmail.com`)
- CamelCase nonsense (e.g., `johnSmithRoofingContactForm`)
- Instant form submits (< 2.5 seconds)
- High-frequency IP abuse (> 5 requests / 10 min)
- Filled honeypot fields

## Real Users Protected

- Normal dotted Gmail addresses are allowed
- Reasonable typing speeds (2.5+ seconds) pass
- Legitimate multi-submission attempts are rate-limited but not blocked completely
- All validation errors return helpful messages to users
- Spam is silently dropped (bot sees success, but data isn't saved)

## Log Examples

```
[HONEYPOT] Blocked estimate submission: Honeypot field filled
[TIMING GATE] Blocked estimate submission: Form submitted too quickly (1245ms < 2500ms)
[RATE LIMIT] Blocked estimate submission: Rate limit exceeded for IP 192.168.1.100
```
