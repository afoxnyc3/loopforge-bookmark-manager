import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { z } from "zod";

const CreateBookmarkSchema = z.object({
  url: z.string().url({ message: "Must be a valid URL" }),
  title: z.string().min(1, "Title is required").max(255),
  tags: z.array(z.string().min(1).max(50)).max(20).optional().default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const tag = searchParams.get("tag") ?? "";

    let query = supabaseAdmin
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
    }

    return NextResponse.json({ bookmarks: data });
  } catch (err) {
    console.error("Unexpected error in GET /api/bookmarks:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateBookmarkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST error:", error);
      return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
    }

    return NextResponse.json({ bookmark: data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error in POST /api/bookmarks:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
