import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust this path to your Prisma client instance

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, email, enrollmentNo, batchYear, branch, 
      college, course, phone, authProvider, providerId, passwordHash 
    } = body;

    // 1. Validation: Check if they are already a registered/invited Alumnus
    const existingAlumni = await db.alumni.findUnique({ where: { email } });
    if (existingAlumni) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // 2. Validation: Check for an outstanding pending request
    const existingRequest = await db.registrationRequest.findUnique({ where: { email } });
    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return NextResponse.json(
          { error: "Your registration request is already pending admin review." },
          { status: 400 }
        );
      }
      if (existingRequest.status === "REJECTED") {
        return NextResponse.json(
          { error: "Your previous request was rejected. Please contact support." },
          { status: 403 }
        );
      }
    }

    // 3. Create the staging record
    const newRequest = await db.registrationRequest.create({
      data: {
        name,
        email,
        enrollmentNo,
        batchYear: Number(batchYear),
        branch,
        college,
        course,
        phone,
        authProvider, // "GOOGLE" | "LINKEDIN" | "MANUAL"
        providerId,   // OAuth ID token identifier if available
        passwordHash, // Ensure this is already safely hashed if MANUAL
      },
    });

    return NextResponse.json(
      { message: "Registration request submitted successfully.", requestId: newRequest.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("SELF_REGISTER_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}