import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { z } from "zod";

const UpdateBookmarkSchema = z.object({
  url: z.string().url({ message: "Must be a valid URL" }).optional(),
  title: z.string().min(1).max(255).optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({ bookmark: data });
  } catch (err) {
    console.error("Unexpected error in GET /api/bookmarks/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const parsed = UpdateBookmarkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("bookmarks")
      .update(parsed.data)
      .eq("id", params.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Bookmark not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({ bookmark: data });
  } catch (err) {
    console.error("Unexpected error in PATCH /api/bookmarks/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await supabaseAdmin
      .from("bookmarks")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Supabase DELETE error:", error);
      return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Unexpected error in DELETE /api/bookmarks/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
