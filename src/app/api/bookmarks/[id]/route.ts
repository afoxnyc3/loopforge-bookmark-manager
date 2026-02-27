import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { updateBookmarkSchema } from '@/lib/validators';
import { ZodError } from 'zod';

type RouteParams = { params: { id: string } };

// PATCH /api/bookmarks/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Bookmark ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateBookmarkSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from('bookmarks')
      .update(parsed)
      .eq('id', id)
      .select('id, url, title, tags, created_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
      }
      console.error(`[PATCH /api/bookmarks/${id}] Supabase error:`, error);
      return NextResponse.json(
        { error: 'Failed to update bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmark: data }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    console.error('[PATCH /api/bookmarks/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/bookmarks/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Bookmark ID is required' }, { status: 400 });
    }

    const { error, count } = await supabaseAdmin
      .from('bookmarks')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error(`[DELETE /api/bookmarks/${id}] Supabase error:`, error);
      return NextResponse.json(
        { error: 'Failed to delete bookmark', details: error.message },
        { status: 500 }
      );
    }

    if (count === 0) {
      return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[DELETE /api/bookmarks/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
