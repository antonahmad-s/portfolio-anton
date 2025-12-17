/**
 * 🔒 SECURE FILE UPLOAD UTILITY (FUTURE USE)
 *
 * @description Comprehensive file upload security implementation
 * @compliance OWASP A04:2025 - Insecure Design
 * @compliance OWASP A05:2025 - Security Misconfiguration
 *
 * ⚠️ WARNING: File uploads are inherently dangerous!
 * Gunakan checklist ini jika menambahkan fitur upload:
 *
 * MANDATORY SECURITY CHECKS:
 * ✓ Magic Bytes validation (actual file type)
 * ✓ File extension allow-list
 * ✓ File size limits
 * ✓ Filename sanitization (prevent directory traversal)
 * ✓ Virus scanning (ClamAV atau VirusTotal API)
 * ✓ Store outside web root
 * ✓ Random filename generation
 * ✓ Content-Type validation
 * ✓ Rate limiting per user/IP
 */

/**
 * File type magic bytes signatures
 * Source: https://en.wikipedia.org/wiki/List_of_file_signatures
 */
const MAGIC_BYTES: Record<string, number[][]> = {
  // Images
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]], // GIF87a or GIF89a
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header

  // Documents
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'application/zip': [[0x50, 0x4b, 0x03, 0x04]], // PK
};

/**
 * Allowed file extensions (ALLOW-LIST approach)
 */
const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp', // Images only
  '.pdf', // Documents
] as const;

/**
 * Maximum file size per type (bytes)
 */
const MAX_FILE_SIZES: Record<string, number> = {
  'image/*': 5 * 1024 * 1024, // 5MB for images
  'application/pdf': 10 * 1024 * 1024, // 10MB for PDFs
  default: 2 * 1024 * 1024, // 2MB default
};

/**
 * Validate file by checking magic bytes (file signature)
 *
 * @security This is the PRIMARY defense against file type spoofing
 * @example
 * const file = req.file;
 * const isValid = await validateFileMagicBytes(file);
 */
export async function validateFileMagicBytes(
  file: File | Buffer
): Promise<{ valid: boolean; detectedType: string | null }> {
  const buffer = Buffer.isBuffer(file)
    ? file
    : Buffer.from(await file.arrayBuffer());

  // Check first 16 bytes
  const header = buffer.slice(0, 16);

  for (const [mimeType, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const signature of signatures) {
      const matches = signature.every((byte, index) => header[index] === byte);

      if (matches) {
        return { valid: true, detectedType: mimeType };
      }
    }
  }

  return { valid: false, detectedType: null };
}

/**
 * Sanitize filename to prevent directory traversal attacks
 *
 * @security Removes: ../, \, null bytes, control characters
 * @example sanitizeFilename("../../etc/passwd") → "etcpasswd"
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[\/\\]/g, '') // Remove path separators
    .replace(/\0/g, '') // Remove null bytes
    .replace(/[^\w\s.-]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase()
    .substring(0, 255); // Limit length
}

/**
 * Generate cryptographically secure random filename
 *
 * @security Prevents: filename conflicts, predictable URLs, path traversal
 */
export function generateSecureFilename(originalExtension: string): string {
  const crypto = require('crypto');
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();

  // Validate extension
  const ext = originalExtension.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext as any)) {
    throw new Error(`File extension ${ext} not allowed`);
  }

  return `${timestamp}-${randomBytes}${ext}`;
}

/**
 * Validate file extension using ALLOW-LIST
 *
 * @security NEVER use deny-list! Always use allow-list.
 */
export function validateFileExtension(filename: string): boolean {
  const ext = filename.toLowerCase().match(/\.[^.]+$/)?.[0];

  if (!ext) return false;

  return ALLOWED_EXTENSIONS.includes(ext as any);
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: File | Buffer,
  mimeType: string
): { valid: boolean; maxSize: number } {
  const fileSize = Buffer.isBuffer(file) ? file.length : file.size;

  // Get max size for this MIME type
  const maxSize = MAX_FILE_SIZES[mimeType] ?? MAX_FILE_SIZES['default'];

  return {
    valid: fileSize <= maxSize,
    maxSize,
  };
}

/**
 * Comprehensive file validation (USE THIS!)
 *
 * @example
 * ```typescript
 * // In your API route:
 * const file = await req.formData().get('file');
 * const validation = await validateUploadedFile(file);
 *
 * if (!validation.valid) {
 *   return Response.json({ error: validation.error }, { status: 400 });
 * }
 * ```
 */
export async function validateUploadedFile(file: File): Promise<{
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  detectedType?: string;
}> {
  // 1. Check file size first (quick check)
  const sizeValidation = validateFileSize(file, file.type);
  if (!sizeValidation.valid) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${
        sizeValidation.maxSize / 1024 / 1024
      }MB`,
    };
  }

  // 2. Validate extension (allow-list)
  if (!validateFileExtension(file.name)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(
        ', '
      )}`,
    };
  }

  // 3. Validate magic bytes (CRITICAL!)
  const magicBytesValidation = await validateFileMagicBytes(file);
  if (!magicBytesValidation.valid) {
    return {
      valid: false,
      error:
        'File type validation failed. The file may be corrupted or disguised.',
    };
  }

  // 4. Verify MIME type matches magic bytes
  if (
    !file.type.startsWith(
      magicBytesValidation.detectedType?.split('/')[0] || ''
    )
  ) {
    return {
      valid: false,
      error: 'File type mismatch. Declared type does not match actual content.',
    };
  }

  // 5. Generate secure filename
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
  const secureFilename = generateSecureFilename(extension);

  return {
    valid: true,
    sanitizedFilename: secureFilename,
    detectedType: magicBytesValidation.detectedType || undefined,
  };
}

/**
 * Example: Secure file upload API route
 *
 * @example Create file: app/api/upload/route.ts
 */
export const SECURE_UPLOAD_EXAMPLE = `
import { NextRequest, NextResponse } from 'next/server';
import { validateUploadedFile } from '@/lib/security/file-upload';

// 🔒 Rate limiting (use upstash/ratelimit or similar)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 uploads per hour
});

export async function POST(request: NextRequest) {
  try {
    // 🔒 Rate limiting
    const ip = request.ip ?? 'anonymous';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many upload requests' },
        { status: 429 }
      );
    }

    // 🔒 CSRF validation
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (!origin?.includes(host || '')) {
      return NextResponse.json(
        { error: 'CSRF validation failed' },
        { status: 403 }
      );
    }

    // 🔒 Get file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 🔒 Validate file
    const validation = await validateUploadedFile(file);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 🔒 CRITICAL: Store file OUTSIDE web root or use object storage
    // RECOMMENDED: Use Cloudflare R2, AWS S3, or similar
    // NEVER store in public/ directory!
    
    // Example: Upload to Cloudflare R2
    const r2 = /* your R2 client */;
    await r2.put(validation.sanitizedFilename, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: validation.detectedType,
      },
      customMetadata: {
        originalName: file.name, // Store original name in metadata
        uploadedAt: new Date().toISOString(),
        uploadedBy: ip, // Or user ID if authenticated
      },
    });

    return NextResponse.json({
      success: true,
      filename: validation.sanitizedFilename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // 🔒 Don't leak internal errors
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// 🔒 Disable this route in production if not needed
export const runtime = 'edge';
export const maxDuration = 30; // Timeout after 30 seconds
`;

/**
 * Checklist untuk implementasi upload yang aman
 */
export const UPLOAD_SECURITY_CHECKLIST = `
🔒 FILE UPLOAD SECURITY CHECKLIST

SEBELUM DEVELOPMENT:
□ Apakah fitur upload BENAR-BENAR dibutuhkan? (Pertimbangkan alternatif)
□ Apakah Anda memiliki budget untuk antivirus scanning?
□ Apakah Anda sudah menyiapkan object storage (S3/R2)?

IMPLEMENTATION:
□ Magic bytes validation (WAJIB!)
□ Extension allow-list (WAJIB!)
□ File size limits (WAJIB!)
□ Filename sanitization → Random UUID (WAJIB!)
□ Store OUTSIDE web root (WAJIB!)
□ MIME type validation
□ Virus scanning (ClamAV atau VirusTotal API)
□ Rate limiting per IP/user
□ CSRF protection
□ Content-Disposition: attachment headers
□ Separate subdomain untuk serving files

INFRASTRUCTURE:
□ CDN dengan virus scanning (Cloudflare)
□ Web Application Firewall (WAF)
□ Regular security audits
□ Incident response plan

MONITORING:
□ Log semua upload attempts
□ Alert pada suspicious patterns
□ Regular review upload logs
□ Monitor storage usage

FORBIDDEN FILES (ALWAYS DENY):
□ .exe, .bat, .cmd, .sh
□ .php, .asp, .jsp, .py
□ .env, .config, .pem
□ .html, .js (potential XSS)
□ Executable archives (.rar dengan .exe)
`;

export default {
  validateUploadedFile,
  validateFileMagicBytes,
  sanitizeFilename,
  generateSecureFilename,
  UPLOAD_SECURITY_CHECKLIST,
};
