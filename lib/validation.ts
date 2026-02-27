import { CreateBookmarkInput, UpdateBookmarkInput } from '@/types/bookmark';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a URL string.
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates input for creating a new bookmark.
 */
export function validateCreateBookmark(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const body = input as Record<string, unknown>;

  // Validate url
  if (!body.url || typeof body.url !== 'string' || body.url.trim() === '') {
    errors.push('url is required and must be a non-empty string');
  } else if (!isValidUrl(body.url.trim())) {
    errors.push('url must be a valid HTTP or HTTPS URL');
  }

  // Validate title
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  } else if (body.title.trim().length > 500) {
    errors.push('title must not exceed 500 characters');
  }

  // Validate tags (optional)
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      errors.push('tags must be an array of strings');
    } else {
      const invalidTags = body.tags.filter((t) => typeof t !== 'string' || t.trim() === '');
      if (invalidTags.length > 0) {
        errors.push('All tags must be non-empty strings');
      }
      if (body.tags.length > 20) {
        errors.push('A bookmark may have at most 20 tags');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates input for updating an existing bookmark.
 */
export function validateUpdateBookmark(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  const body = input as Record<string, unknown>;

  // At least one field must be present
  const updatableFields = ['url', 'title', 'tags'];
  const hasAnyField = updatableFields.some((f) => f in body);
  if (!hasAnyField) {
    errors.push('At least one of url, title, or tags must be provided');
  }

  // Validate url if present
  if ('url' in body) {
    if (typeof body.url !== 'string' || body.url.trim() === '') {
      errors.push('url must be a non-empty string');
    } else if (!isValidUrl(body.url.trim())) {
      errors.push('url must be a valid HTTP or HTTPS URL');
    }
  }

  // Validate title if present
  if ('title' in body) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title must be a non-empty string');
    } else if (body.title.trim().length > 500) {
      errors.push('title must not exceed 500 characters');
    }
  }

  // Validate tags if present
  if ('tags' in body) {
    if (!Array.isArray(body.tags)) {
      errors.push('tags must be an array of strings');
    } else {
      const invalidTags = body.tags.filter((t) => typeof t !== 'string' || t.trim() === '');
      if (invalidTags.length > 0) {
        errors.push('All tags must be non-empty strings');
      }
      if (body.tags.length > 20) {
        errors.push('A bookmark may have at most 20 tags');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Sanitizes a CreateBookmarkInput — trims strings, normalizes tags.
 */
export function sanitizeCreateInput(body: Record<string, unknown>): CreateBookmarkInput {
  return {
    url: (body.url as string).trim(),
    title: (body.title as string).trim(),
    tags: Array.isArray(body.tags)
      ? (body.tags as string[]).map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [],
  };
}

/**
 * Sanitizes an UpdateBookmarkInput — trims strings, normalizes tags.
 */
export function sanitizeUpdateInput(body: Record<string, unknown>): UpdateBookmarkInput {
  const result: UpdateBookmarkInput = {};
  if ('url' in body) result.url = (body.url as string).trim();
  if ('title' in body) result.title = (body.title as string).trim();
  if ('tags' in body) {
    result.tags = (body.tags as string[]).map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  return result;
}
