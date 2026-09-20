// GET /api/settings — public settings (fees + payment instructions) for display
// PATCH /api/settings — admin updates fees + instructions
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

export async function GET() {
  const settings = await db.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      jobPostFee: 50,
      applicationFee: 25,
      paymentInstructions: "Send payment via Telebirr to: 0911 23 45 67\nThen upload the screenshot below.",
      telebirrNumber: "0911234567",
    },
  });

  return NextResponse.json({
    settings: {
      jobPostFee: settings.jobPostFee,
      applicationFee: settings.applicationFee,
      paymentInstructions: settings.paymentInstructions,
      telebirrNumber: settings.telebirrNumber,
      cbeAccount: settings.cbeAccount,
      chapaEnabled: settings.chapaEnabled,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await authenticate(request);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();
  const allowed: Record<string, unknown> = {};
  const fields = [
    "jobPostFee", "applicationFee", "paymentInstructions",
    "telebirrNumber", "cbeAccount",
    "chapaEnabled", "chapaPublicKey", "chapaSecretKey",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) allowed[f] = body[f];
  }
  // Convert numeric fields
  if (allowed.jobPostFee !== undefined) allowed.jobPostFee = Number(allowed.jobPostFee);
  if (allowed.applicationFee !== undefined) allowed.applicationFee = Number(allowed.applicationFee);
  if (allowed.chapaEnabled !== undefined) allowed.chapaEnabled = Boolean(allowed.chapaEnabled);

  const updated = await db.setting.upsert({
    where: { id: "singleton" },
    update: allowed,
    create: {
      id: "singleton",
      jobPostFee: 50,
      applicationFee: 25,
      paymentInstructions: "Send payment via Telebirr to: 0911 23 45 67\nThen upload the screenshot below.",
      telebirrNumber: "0911234567",
      ...allowed,
    },
  });

  return NextResponse.json({
    settings: {
      jobPostFee: updated.jobPostFee,
      applicationFee: updated.applicationFee,
      paymentInstructions: updated.paymentInstructions,
      telebirrNumber: updated.telebirrNumber,
      cbeAccount: updated.cbeAccount,
      chapaEnabled: updated.chapaEnabled,
    },
  });
}
