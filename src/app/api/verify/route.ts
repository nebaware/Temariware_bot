// POST /api/verify — submit a verification request (employer)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { UserRole, VerificationStatus } from "@prisma/client";

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Switch role to EMPLOYER if currently STUDENT
  if (user.role === UserRole.STUDENT) {
    await db.user.update({ where: { id: user.id }, data: { role: UserRole.EMPLOYER } });
  }

  // Already pending?
  const existing = await db.verificationRequest.findFirst({
    where: { userId: user.id, status: VerificationStatus.PENDING },
  });
  if (existing) {
    return NextResponse.json({ error: "You already have a pending verification request." }, { status: 409 });
  }

  const body = await request.json();
  if (!body.companyName || !body.contactTelegram) {
    return NextResponse.json({ error: "Company name and contact are required." }, { status: 400 });
  }

  const req = await db.verificationRequest.create({
    data: {
      userId: user.id,
      companyName: body.companyName.trim(),
      contactTelegram: body.contactTelegram.trim(),
      proofUrl: body.proofUrl?.trim() || null,
      note: body.note?.trim() || null,
      status: VerificationStatus.PENDING,
    },
  });

  // Update user's employer profile fields
  await db.user.update({
    where: { id: user.id },
    data: {
      companyName: body.companyName.trim(),
      companyTelegram: body.contactTelegram.trim(),
      verification: VerificationStatus.PENDING,
    },
  });

  return NextResponse.json({ request: req });
}
