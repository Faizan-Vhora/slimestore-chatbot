// Input sanitization and safety utilities

const BLOCKED_PATTERNS = [
  // Prompt injection attempts
  /ignore (all |previous |above |prior )?instructions/i,
  /disregard (all |previous |above |prior )?instructions/i,
  /forget (all |previous |above |prior )?instructions/i,
  /you are now/i,
  /pretend (to be|you are)/i,
  /act as/i,
  /roleplay as/i,
  /system prompt/i,
  /reveal (your|the) (instructions|prompt|system)/i,
  /what are your instructions/i,
  /show me your prompt/i,
  /ignore safety/i,
  /bypass/i,
  /jailbreak/i,
  
  // Harmful content attempts
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  
  // Data exfiltration attempts
  /api[_\s]?key/i,
  /secret[_\s]?key/i,
  /password/i,
  /credential/i,
];

const MAX_INPUT_LENGTH = 500;

export interface SanitizationResult {
  isValid: boolean;
  sanitizedInput: string;
  reason?: string;
}

export function sanitizeInput(input: string): SanitizationResult {
  // Check for empty input
  if (!input || input.trim().length === 0) {
    return {
      isValid: false,
      sanitizedInput: '',
      reason: 'Empty input',
    };
  }

  // Check length
  if (input.length > MAX_INPUT_LENGTH) {
    return {
      isValid: false,
      sanitizedInput: input.slice(0, MAX_INPUT_LENGTH),
      reason: 'Input too long',
    };
  }

  // Check for blocked patterns (prompt injection)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isValid: false,
        sanitizedInput: '',
        reason: 'Invalid input pattern detected',
      };
    }
  }

  // Check for excessive special characters (potential attack)
  const specialCharMatch = input.match(/[^a-zA-Z0-9\s]{10,}/);
  if (specialCharMatch) {
    return {
      isValid: false,
      sanitizedInput: '',
      reason: 'Suspicious character pattern',
    };
  }

  // Basic HTML/script sanitization
  const sanitized = input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .trim();

  return {
    isValid: true,
    sanitizedInput: sanitized,
  };
}

// Rate limiting (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Safe fallback response
export const FALLBACK_RESPONSE = "I'm still learning and couldn't quite understand that. Could you try rephrasing your question? I'm happy to help with products, orders, shipping, returns, or payments.";

export const OUT_OF_SCOPE_RESPONSE = "I appreciate your question! I'm specialized in helping with Slimestore topics like our products, orders, shipping, and policies. Is there anything in those areas I can help you with?";
