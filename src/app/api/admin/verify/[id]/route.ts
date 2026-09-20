// POST /api/admin/verify/[id] — approve or reject a verification request
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { VerificationStatus, UserRole } from "@prisma/client";
import { t, type Lang } from "@/lib/i18n";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = await authenticate(request);
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();
  const action: "approve" | "reject" = body.action;
  const reason: string | undefined = body.reason;

  const req = await db.verificationRequest.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!req) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const status = action === "approve" ? VerificationStatus.APPROVED : VerificationStatus.REJECTED;

  await db.verificationRequest.update({
    where: { id },
    data: { status, reviewedBy: admin.id, reviewNote: reason ?? null, reviewedAt: new Date() },
  });

  await db.user.update({
    where: { id: req.userId },
    data: {
      verification: status,
      role: action === "approve" ? UserRole.EMPLOYER : UserRole.STUDENT,
    },
  });

  if (req.user.telegramId) {
    const lang = (req.user.language ?? "en") as Lang;
    if (action === "approve") {
      await sendMessage({
        chatId: req.user.telegramId,
        text: t(lang, "botVerificationApproved", { company: req.companyName }),
      });
    } else {
      await sendMessage({
        chatId: req.user.telegramId,
        text: t(lang, "botVerificationRejected", { reason: reason ?? "—" }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
