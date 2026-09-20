// POST /api/applications/[id]/pay — student uploads payment screenshot
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { ApplicationStatus, PaymentStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await db.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Only the applicant can upload payment
  if (application.userId !== user.id) {
    return NextResponse.json({ error: "Only the applicant can upload payment" }, { status: 403 });
  }

  if (application.status !== ApplicationStatus.ACCEPTED) {
    return NextResponse.json(
      { error: "You can only upload payment after the employer accepts your application." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const screenshot = body.paymentScreenshot;
  if (!screenshot || typeof screenshot !== "string") {
    return NextResponse.json({ error: "Screenshot required" }, { status: 400 });
  }
  if (screenshot.length > 1_400_000) {
    return NextResponse.json({ error: "Screenshot too large (max 1MB)" }, { status: 400 });
  }
  if (!screenshot.startsWith("data:image/")) {
    return NextResponse.json({ error: "Must be a PNG or JPEG image" }, { status: 400 });
  }

  // Get fee: per-job override if set, otherwise global default
  const settings = await db.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", jobPostFee: 50, applicationFee: 25 },
  });
  const fee = application.job.applicationFee !== null ? application.job.applicationFee : settings.applicationFee;

  await db.application.update({
    where: { id },
    data: {
      status: ApplicationStatus.PAYMENT_PENDING,
      paymentScreenshot: screenshot,
      paymentStatus: PaymentStatus.PENDING,
    },
  });

  // Create payment audit record
  await db.payment.create({
    data: {
      userId: user.id,
      jobId: application.jobId,
      type: "APPLICATION",
      applicationId: application.id,
      amount: fee,
      screenshotUrl: screenshot,
      status: PaymentStatus.PENDING,
    },
  });

  return NextResponse.json({ ok: true, fee });
}
