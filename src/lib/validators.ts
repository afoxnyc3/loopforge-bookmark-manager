import { z } from 'zod';

export const createBookmarkSchema = z.object({
  url: z
    .string()
    .url({ message: 'Must be a valid URL (e.g. https://example.com)' })
    .max(2048, { message: 'URL must be 2048 characters or fewer' }),
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(255, { message: 'Title must be 255 characters or fewer' }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: 'Tag must not be empty' })
        .max(50, { message: 'Each tag must be 50 characters or fewer' })
        .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Tags may only contain letters, numbers, hyphens, and underscores' })
    )
    .max(10, { message: 'A bookmark may have at most 10 tags' })
    .optional()
    .default([]),
});

export const updateBookmarkSchema = z.object({
  url: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .max(2048)
    .optional(),
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(255)
    .optional(),
  tags: z
    .array(
      z
        .string()
        .min(1)
        .max(50)
        .regex(/^[a-zA-Z0-9_-]+$/)
    )
    .max(10)
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field (url, title, or tags) must be provided for update' }
);

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
