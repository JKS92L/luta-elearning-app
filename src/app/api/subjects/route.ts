// src/app/api/subjects/route.ts
import { db } from "@/lib/db";
import { subjects } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/subjects - Get all subjects
export async function GET(request: NextRequest) {
  try {
    // Get user session (optional - can be public or protected)
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Optional: Restrict to authenticated users
    // if (!session) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const allSubjects = await db
      .select()
      .from(subjects)
      .orderBy(desc(subjects.createdAt));

    return NextResponse.json(allSubjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

// POST /api/subjects - Create new subject (Admin/Teacher only)
export async function POST(request: NextRequest) {
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

    // Check if user has permission
    // Note: Update these role checks to match your actual role enum values
    const allowedRoles = [
      "SYSTEM_ADMIN",
      "SYSTEM_SUPER_ADMIN", 
      "SYSTEM_DEVELOPER",
      "TEACHER",
      "LECTURER"
    ];
    
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields with new fields
    const requiredFields = ['name', 'short_tag', 'code', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          details: `${missingFields.join(', ')} are required` 
        },
        { status: 400 }
      );
    }

    // Validate code format (alphanumeric)
    if (body.code && !/^[a-zA-Z0-9]+$/.test(body.code)) {
      return NextResponse.json(
        { error: "Subject code must be alphanumeric (letters and numbers only)" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const [existingCode] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.code, body.code))
      .limit(1);
    
    if (existingCode) {
      return NextResponse.json(
        { error: "Subject code already exists" },
        { status: 409 }
      );
    }

    // Check if short_tag already exists
    const [existingShortTag] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.short_tag, body.short_tag))
      .limit(1);
    
    if (existingShortTag) {
      return NextResponse.json(
        { error: "Subject short tag already exists" },
        { status: 409 }
      );
    }

    // Validate short_tag format (optional)
    if (body.short_tag && !/^[a-zA-Z0-9_]+$/.test(body.short_tag)) {
      return NextResponse.json(
        { error: "Short tag must contain only letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Create subject with new fields
    const [newSubject] = await db
      .insert(subjects)
      .values({
        name: body.name,
        short_tag: body.short_tag,
        code: body.code,
        description: body.description || null,
        category: body.category,
        level: body.level || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subject:", error);
    
    // Handle database constraint errors
    if (error.code === '23505') { // PostgreSQL unique violation
      const constraint = error.constraint || '';
      if (constraint.includes('short_tag')) {
        return NextResponse.json(
          { error: "Subject short tag already exists" },
          { status: 409 }
        );
      } else if (constraint.includes('code')) {
        return NextResponse.json(
          { error: "Subject code already exists" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}