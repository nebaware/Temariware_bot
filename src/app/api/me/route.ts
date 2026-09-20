// GET /api/me — current authenticated user
// PATCH /api/me — update profile
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      role: user.role,
      language: user.language,
      university: user.university,
      fieldOfStudy: user.fieldOfStudy,
      year: user.year,
      fullName: user.fullName,
      phone: user.phone,
      cvUrl: user.cvUrl,
      bio: user.bio,
      companyName: user.companyName,
      companyTelegram: user.companyTelegram,
      verification: user.verification,
      isAdmin: user.isAdmin,
      alertSubjects: user.alertSubjects,
      alertLocations: user.alertLocations,
      // Documents
      nationalIdNumber: user.nationalIdNumber,
      nationalIdImage: user.nationalIdImage,
      universityIdNumber: user.universityIdNumber,
      universityIdImage: user.universityIdImage,
      lastSemesterGradeImage: user.lastSemesterGradeImage,
      profileComplete: user.profileComplete,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();

  const allowed: Record<string, unknown> = {};
  const fields = [
    "language", "fullName", "phone", "university", "fieldOfStudy", "year",
    "bio", "cvUrl", "companyName", "companyTelegram", "alertSubjects", "alertLocations",
    // Student documents (mandatory to apply)
    "nationalIdNumber", "nationalIdImage",
    "universityIdNumber", "universityIdImage",
    "lastSemesterGradeImage",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) allowed[f] = body[f];
  }
  if (allowed.year !== undefined) {
    allowed.year = allowed.year === "" || allowed.year === null ? null : Number(allowed.year);
  }

  // Compute profileComplete flag — student is "complete" when all mandatory docs are present
  const merged = { ...user, ...allowed } as Record<string, unknown>;
  const isComplete =
    !!merged.nationalIdNumber &&
    !!merged.nationalIdImage &&
    !!merged.universityIdNumber &&
    !!merged.universityIdImage &&
    !!merged.lastSemesterGradeImage;
  allowed.profileComplete = isComplete;

  const updated = await db.user.update({ where: { id: user.id }, data: allowed });

  return NextResponse.json({
    user: {
      id: updated.id,
      telegramId: updated.telegramId,
      username: updated.username,
      firstName: updated.firstName,
      lastName: updated.lastName,
      photoUrl: updated.photoUrl,
      role: updated.role,
      language: updated.language,
      university: updated.university,
      fieldOfStudy: updated.fieldOfStudy,
      year: updated.year,
      fullName: updated.fullName,
      phone: updated.phone,
      cvUrl: updated.cvUrl,
      bio: updated.bio,
      companyName: updated.companyName,
      companyTelegram: updated.companyTelegram,
      verification: updated.verification,
      isAdmin: updated.isAdmin,
      alertSubjects: updated.alertSubjects,
      alertLocations: updated.alertLocations,
      // Documents
      nationalIdNumber: updated.nationalIdNumber,
      nationalIdImage: updated.nationalIdImage,
      universityIdNumber: updated.universityIdNumber,
      universityIdImage: updated.universityIdImage,
      lastSemesterGradeImage: updated.lastSemesterGradeImage,
      profileComplete: updated.profileComplete,
    },
  });
}
