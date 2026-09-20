// GET /api/employer/applications — applications to jobs posted by the current user
// Returns applicant profiles (so employer can review them)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ applications: [] });
  }

  // Find all applications for jobs this user posted
  const applications = await db.application.findMany({
    where: { job: { employerId: user.id } },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          salary: true,
          subjects: true,
          gradeLevel: true,
          deadline: true,
          workType: true,
          positionsAvailable: true,
          filledPositions: true,
          status: true,
        },
      },
      user: {
        // The applicant's profile — include all documents for employer review
        select: {
          id: true,
          telegramId: true,
          username: true,
          firstName: true,
          lastName: true,
          fullName: true,
          phone: true,
          photoUrl: true,
          university: true,
          fieldOfStudy: true,
          year: true,
          bio: true,
          cvUrl: true,
          language: true,
          // Mandatory documents (visible to employer for review)
          nationalIdNumber: true,
          nationalIdImage: true,
          universityIdNumber: true,
          universityIdImage: true,
          lastSemesterGradeImage: true,
          profileComplete: true,
        },
      },
    },
  });

  return NextResponse.json({ applications });
}
