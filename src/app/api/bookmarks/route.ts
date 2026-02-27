import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createBookmarkSchema } from '@/lib/validators';
import { ZodError } from 'zod';

/**
 * GET /api/bookmarks
 * Query params:
 *   - tag: string  — filter bookmarks where tags array contains this tag (exact match)
 *   - q:   string  — case-insensitive substring search on title
 *
 * Returns bookmarks sorted by created_at DESC.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const q = searchParams.get('q');

    let query = supabaseAdmin
      .from('bookmarks')
      .select('id, url, title, tags, created_at')
      .order('created_at', { ascending: false });

    if (tag && tag.trim() !== '') {
      // GIN index: check if tags array contains the given tag
      query = query.contains('tags', [tag.trim()]);
    }

    if (q && q.trim() !== '') {
      // B-tree / sequential scan: case-insensitive title search
      query = query.ilike('title', `%${q.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/bookmarks] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('[GET /api/bookmarks] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/bookmarks
 * Body: { url: string; title: string; tags?: string[] }
 * Returns the created bookmark.
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = createBookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { url, title, tags } = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('bookmarks')
      .insert({ url, title, tags })
      .select('id, url, title, tags, created_at')
      .single();

    if (error) {
      console.error('[POST /api/bookmarks] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error('[POST /api/bookmarks] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
