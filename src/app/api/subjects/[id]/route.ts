// src/app/api/subjects/[id]/route.ts
import { db } from "@/lib/db";
import { subjects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/subjects/[id] - Get single subject
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject" },
      { status: 500 }
    );
  }
}

// PUT /api/subjects/[id] - Update subject
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permissions
    if (session.user.role !== "ADMIN" && session.user.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Check if subject exists
    const [existing] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    // Check if code is being updated and if it's unique
    if (body.code && body.code !== existing.code) {
      const [existingWithCode] = await db
        .select()
        .from(subjects)
        .where(eq(subjects.code, body.code))
        .limit(1);
      
      if (existingWithCode && existingWithCode.id !== id) {
        return NextResponse.json(
          { error: "Subject code must be unique" },
          { status: 409 }
        );
      }
    }

    // Check if short_tag is being updated and if it's unique
    if (body.short_tag && body.short_tag !== existing.short_tag) {
      const [existingWithShortTag] = await db
        .select()
        .from(subjects)
        .where(eq(subjects.short_tag, body.short_tag))
        .limit(1);
      
      if (existingWithShortTag && existingWithShortTag.id !== id) {
        return NextResponse.json(
          { error: "Subject short tag must be unique" },
          { status: 409 }
        );
      }
    }

    // Update subject with new fields
    const [updated] = await db
      .update(subjects)
      .set({
        name: body.name || existing.name,
        short_tag: body.short_tag !== undefined ? body.short_tag : existing.short_tag,
        code: body.code !== undefined ? body.code : existing.code,
        curriculum_type: body.curriculum_type !== undefined ? body.curriculum_type : existing.curriculum_type,
        category: body.category || existing.category,
        level: body.level !== undefined ? body.level : existing.level,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 }
    );
  }
}

// DELETE /api/subjects/[id] - Delete subject
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only ADMIN can delete
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete subjects" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if subject exists
    const [existing] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    // Delete subject
    await db.delete(subjects).where(eq(subjects.id, id));

    return NextResponse.json(
      { message: "Subject deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}