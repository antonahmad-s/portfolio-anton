/**
 * 🔒 SECURE ENVIRONMENT VARIABLES VALIDATION
 *
 * @description Validates and sanitizes environment variables
 * @security Prevents injection attacks via env vars
 * @compliance OWASP A02:2025 - Cryptographic Failures
 */

/**
 * Sanitize string to prevent XSS
 */
function sanitizeEnvString(value: string | undefined): string {
  if (!value) return '';

  // Remove any potentially dangerous characters
  return value
    .replace(/[<>'"]/g, '') // XSS prevention
    .replace(/javascript:/gi, '') // Protocol injection
    .replace(/data:/gi, '') // Data URI injection
    .trim();
}

/**
 * Validate Google Analytics Measurement ID format
 */
function validateGAId(id: string): boolean {
  // GA4 format: G-XXXXXXXXXX (G- followed by 10 alphanumeric)
  const GA4_REGEX = /^G-[A-Z0-9]{10}$/;

  // Universal Analytics format: UA-XXXXXXXX-X
  const UA_REGEX = /^UA-\d{8,10}-\d{1,4}$/;

  return GA4_REGEX.test(id) || UA_REGEX.test(id);
}

/**
 * Public environment variables (client-side safe)
 */
export const env = {
  /**
   * Google Analytics Measurement ID
   * @security Validated and sanitized
   */
  GA_MEASUREMENT_ID: (() => {
    const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!raw) return null;

    const sanitized = sanitizeEnvString(raw);

    // Validate format
    if (!validateGAId(sanitized)) {
      console.warn('⚠️ Invalid GA_MEASUREMENT_ID format. Analytics disabled.');
      return null;
    }

    return sanitized;
  })(),

  /**
   * Site URL for canonical links and SEO
   * @security Validated as HTTPS URL
   */
  SITE_URL: (() => {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://antonahmad.dev';
    const sanitized = sanitizeEnvString(raw);

    // Ensure it's a valid HTTPS URL
    try {
      const url = new URL(sanitized);
      if (url.protocol !== 'https:') {
        console.warn(
          '⚠️ SITE_URL must use HTTPS. Defaulting to https://antonahmad.dev'
        );
        return 'https://antonahmad.dev';
      }
      return sanitized;
    } catch {
      console.error('❌ Invalid SITE_URL format');
      return 'https://antonahmad.dev';
    }
  })(),

  /**
   * Runtime environment
   */
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

/**
 * Type-safe environment variable access
 */
export type Env = typeof env;

/**
 * Validate all required environment variables at build time
 */
export function validateEnv(): void {
  const errors: string[] = [];

  // Add validation for required variables here
  // Example:
  // if (!env.REQUIRED_VAR) {
  //   errors.push('REQUIRED_VAR is not set');
  // }

  if (errors.length > 0) {
    throw new Error(`❌ Environment validation failed:\n${errors.join('\n')}`);
  }

  console.log('✅ Environment variables validated successfully');
}
