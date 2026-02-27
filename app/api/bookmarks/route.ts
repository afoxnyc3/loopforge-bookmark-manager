import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateCreateBookmark, sanitizeCreateInput } from '@/lib/validation';
import type { Bookmark } from '@/types/bookmark';

/**
 * GET /api/bookmarks
 *
 * Query params:
 *   - tag    (string) — filter bookmarks that contain this tag
 *   - search (string) — case-insensitive substring match on title
 *
 * Returns bookmarks sorted by created_at DESC.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag')?.trim() || null;
    const search = searchParams.get('search')?.trim() || null;

    let query = supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (tag) {
      // Filter bookmarks where the tags array contains the specified tag.
      // Using the @> (contains) operator on the Postgres array.
      query = query.contains('tags', [tag.toLowerCase()]);
    }

    if (search) {
      // Case-insensitive substring search on title using ilike.
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/bookmarks] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Bookmark[], { status: 200 });
  } catch (err) {
    console.error('[GET /api/bookmarks] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/bookmarks
 *
 * Body: { url: string, title: string, tags?: string[] }
 *
 * Creates a new bookmark and returns the created record.
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
    }

    const validation = validateCreateBookmark(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors.join('; ') },
        { status: 400 }
      );
    }

    const input = sanitizeCreateInput(body as Record<string, unknown>);

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        url: input.url,
        title: input.title,
        tags: input.tags ?? [],
      })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/bookmarks] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Bookmark, { status: 201 });
  } catch (err) {
    console.error('[POST /api/bookmarks] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
