import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== 'string') return dirty;
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
}

export function stripScripts(dirty: string): string {
  if (typeof dirty !== 'string') return dirty;
  // This will remove all HTML tags, leaving only text content
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return stripScripts(obj) as any;
  if (Array.isArray(obj)) return obj.map(sanitizeObject) as any;
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized as T;
  }
  return obj;
}
