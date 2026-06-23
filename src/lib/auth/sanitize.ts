/**
 * Sanitizes user input to prevent XSS attacks.
 * Strips dangerous HTML tags and event handlers.
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "");
}

/**
 * Sanitizes input intended for LLM prompts to prevent prompt injection.
 * Wraps user content in delimiters and strips common injection patterns.
 */
export function sanitizeForLLM(input: string): string {
  // Remove common prompt injection patterns
  const sanitized = input
    .replace(
      /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/gi,
      "[filtered]"
    )
    .replace(/you\s+are\s+now/gi, "[filtered]")
    .replace(/system\s*:\s*/gi, "[filtered]")
    .replace(/\[INST\]/gi, "[filtered]")
    .replace(/<\|im_start\|>/gi, "[filtered]")
    .replace(/<\|im_end\|>/gi, "[filtered]");

  return sanitized;
}

/**
 * Generates a CSRF token for form submissions.
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Validates a CSRF token against the expected value.
 */
export function validateCsrfToken(token: string, expected: string): boolean {
  if (!token || !expected) return false;
  // Constant-time comparison to prevent timing attacks
  if (token.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Sanitizes all string fields in an object recursively.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeHtml(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>
      );
    }
  }
  return result;
}
