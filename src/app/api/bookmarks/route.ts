import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createBookmarkSchema } from '@/lib/validators';
import { ZodError } from 'zod';

// GET /api/bookmarks
// Query params: ?search=<string>&tag=<string>
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() ?? '';
    const tag = searchParams.get('tag')?.trim() ?? '';

    let query = supabaseAdmin
      .from('bookmarks')
      .select('id, url, title, tags, created_at')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/bookmarks] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmarks: data ?? [] }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/bookmarks] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookmarks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookmarkSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from('bookmarks')
      .insert({
        url: parsed.url,
        title: parsed.title,
        tags: parsed.tags ?? [],
      })
      .select('id, url, title, tags, created_at')
      .single();

    if (error) {
      console.error('[POST /api/bookmarks] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create bookmark', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmark: data }, { status: 201 });
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
    console.error('[POST /api/bookmarks] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
