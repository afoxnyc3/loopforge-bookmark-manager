import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { updateBookmarkSchema } from '@/lib/validators';
import { ZodError } from 'zod';

interface RouteContext {
  params: { id: string };
}

/**
 * PATCH /api/bookmarks/:id
 * Body: partial { url?: string; title?: string; tags?: string[] }
 * Returns the updated bookmark.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid bookmark id' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = updateBookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updates = parsed.data;

    const { data, error } = await supabaseAdmin
      .from('bookmarks')
      .update(updates)
      .eq('id', id)
      .select('id, url, title, tags, created_at')
      .single();

    if (error) {
      // PostgREST returns PGRST116 when no rows matched
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
      }
      console.error(`[PATCH /api/bookmarks/${id}] Supabase error:`, error);
      return NextResponse.json(
        { error: 'Failed to update bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error('[PATCH /api/bookmarks/:id] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/bookmarks/:id
 * Returns 204 No Content on success.
 */
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid bookmark id' }, { status: 400 });
    }

    // First verify the record exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('bookmarks')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('bookmarks')
      .delete()
      .eq('id', id);

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
