import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateUpdateBookmark, sanitizeUpdateInput } from '@/lib/validation';
import type { Bookmark } from '@/types/bookmark';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/bookmarks/:id
 *
 * Returns a single bookmark by ID.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid bookmark ID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PostgREST code for "no rows returned"
        return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
      }
      console.error(`[GET /api/bookmarks/${id}] Supabase error:`, error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Bookmark, { status: 200 });
  } catch (err) {
    console.error('[GET /api/bookmarks/:id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/bookmarks/:id
 *
 * Body: { url?: string, title?: string, tags?: string[] }
 *
 * Partially updates a bookmark. At least one field is required.
 * Returns the updated record.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid bookmark ID' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
    }

    const validation = validateUpdateBookmark(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors.join('; ') },
        { status: 400 }
      );
    }

    const input = sanitizeUpdateInput(body as Record<string, unknown>);

    const { data, error } = await supabase
      .from('bookmarks')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
      }
      console.error(`[PUT /api/bookmarks/${id}] Supabase error:`, error);
      return NextResponse.json(
        { error: 'Failed to update bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Bookmark, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/bookmarks/:id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/bookmarks/:id
 *
 * Deletes a bookmark by ID.
 * Returns 204 No Content on success.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid bookmark ID' }, { status: 400 });
    }

    // First verify the record exists
    const { data: existing, error: fetchError } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    }

    const { error } = await supabase.from('bookmarks').delete().eq('id', id);

    if (error) {
      console.error(`[DELETE /api/bookmarks/${id}] Supabase error:`, error);
      return NextResponse.json(
        { error: 'Failed to delete bookmark', details: error.message },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/bookmarks/:id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
