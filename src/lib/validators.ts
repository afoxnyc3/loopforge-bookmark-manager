import { z } from 'zod';

/**
 * Schema for creating a new bookmark (POST /api/bookmarks)
 */
export const createBookmarkSchema = z.object({
  url: z
    .string({ required_error: 'url is required' })
    .url({ message: 'url must be a valid URL' }),
  title: z
    .string({ required_error: 'title is required' })
    .min(1, { message: 'title must not be empty' })
    .max(255, { message: 'title must be 255 characters or fewer' }),
  tags: z
    .array(z.string().min(1).max(50))
    .max(20, { message: 'A bookmark may have at most 20 tags' })
    .default([]),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;

/**
 * Schema for updating an existing bookmark (PATCH /api/bookmarks/:id)
 * All fields are optional — only provided fields are updated.
 */
export const updateBookmarkSchema = z
  .object({
    url: z.string().url({ message: 'url must be a valid URL' }).optional(),
    title: z
      .string()
      .min(1, { message: 'title must not be empty' })
      .max(255, { message: 'title must be 255 characters or fewer' })
      .optional(),
    tags: z
      .array(z.string().min(1).max(50))
      .max(20, { message: 'A bookmark may have at most 20 tags' })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
