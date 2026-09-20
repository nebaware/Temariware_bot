// GET /api/jobs — list approved jobs (with filters)
// POST /api/jobs — submit a new job (verified employers only, with payment screenshot)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { JobStatus, JobType, VerificationStatus, PaymentStatus } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const subject = url.searchParams.get("subject");
  const location = url.searchParams.get("location");
  const workType = url.searchParams.get("workType");
  const grade = url.searchParams.get("grade");
  const gender = url.searchParams.get("gender");
  const languageReq = url.searchParams.get("languageReq");
  const search = url.searchParams.get("q");
  const limit = Math.min(50, Number(url.searchParams.get("limit") ?? 30));
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));

  // Use AND with nested OR groups so multiple filters don't overwrite each other.
  // Use mode: 'insensitive' for PostgreSQL case-insensitive matching.
  const where: Record<string, unknown> = { status: JobStatus.APPROVED };
  const andConditions: unknown[] = [];

  if (subject) {
    andConditions.push({
      subjects: { contains: subject, mode: "insensitive" },
    });
  }
  if (location) {
    andConditions.push({
      location: { contains: location, mode: "insensitive" },
    });
  }
  if (workType) {
    andConditions.push({ workType: workType as JobType });
  }
  if (grade) {
    andConditions.push({
      gradeLevel: { contains: grade, mode: "insensitive" },
    });
  }
  if (gender && gender !== "any") {
    andConditions.push({
      OR: [
        { genderPref: gender },
        { genderPref: null },
        { genderPref: "any" },
      ],
    });
  }
  if (languageReq) {
    andConditions.push({
      OR: [
        { languageReq: { contains: languageReq, mode: "insensitive" } },
        { languageReq: null },
      ],
    });
  }
  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { subjects: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ],
    });
  }
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const jobs = await db.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      employer: {
        select: {
          id: true,
          companyName: true,
          companyTelegram: true,
          username: true,
          firstName: true,
          verification: true,
        },
      },
      _count: { select: { applications: true } },
    },
  });

  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.verification !== VerificationStatus.APPROVED && !user.isAdmin) {
    return NextResponse.json(
      { error: "Only verified employers can post jobs. Please verify your company first." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const required = ["title", "description", "subjects"];
  for (const f of required) {
    if (!body[f] || typeof body[f] !== "string" || body[f].trim().length === 0) {
      return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
  }

  // Get settings to know the fee
  const settings = await db.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", jobPostFee: 50, applicationFee: 25 },
  });

  // Require payment screenshot if fee > 0
  const fee = settings.jobPostFee;
  let paymentScreenshot: string | null = null;
  let paymentStatus = PaymentStatus.NONE;
  let status = JobStatus.PENDING;

  if (fee > 0) {
    if (!body.paymentScreenshot || typeof body.paymentScreenshot !== "string") {
      return NextResponse.json(
        { error: `Payment screenshot required (job post fee: ${fee} ETB). Please upload your Telebirr/CBE payment confirmation.` },
        { status: 400 }
      );
    }
    // Validate it's a base64 data URL (cap at 1MB to keep DB small)
    const screenshot = body.paymentScreenshot;
    if (screenshot.length > 1_400_000) {
      return NextResponse.json(
        { error: "Screenshot too large. Please use a smaller image (under 1MB)." },
        { status: 400 }
      );
    }
    if (!screenshot.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid screenshot format. Must be a PNG or JPEG image." },
        { status: 400 }
      );
    }
    paymentScreenshot = screenshot;
    paymentStatus = PaymentStatus.PENDING;
    status = JobStatus.PENDING_PAYMENT;
  }

  const job = await db.job.create({
    data: {
      title: body.title.trim(),
      description: body.description.trim(),
      employerId: user.id,
      subjects: body.subjects.trim(),
      gradeLevel: body.gradeLevel?.trim() || null,
      location: body.location?.trim() || null,
      workType: (body.workType as JobType) ?? JobType.TUTORING,
      salary: body.salary?.trim() || null,
      currency: "ETB",
      hoursPerWeek: body.hoursPerWeek?.trim() || null,
      genderPref: body.genderPref || null,
      languageReq: body.languageReq?.trim() || null,
      deadline: body.deadline ? new Date(body.deadline) : null,
      contactTelegram: body.contactTelegram?.trim() || user.companyTelegram || null,
      positionsAvailable: body.positionsAvailable ? Number(body.positionsAvailable) : null,
      // Per-job application fee (null = use global default; explicit number = override)
      applicationFee: body.applicationFee !== undefined && body.applicationFee !== "" ? Number(body.applicationFee) : null,
      status,
      paymentScreenshot,
      paymentStatus,
    },
  });

  // If payment is required, also create a Payment audit record
  if (fee > 0 && paymentScreenshot) {
    await db.payment.create({
      data: {
        userId: user.id,
        jobId: job.id,
        type: "JOB_POST",
        amount: fee,
        screenshotUrl: paymentScreenshot,
        status: PaymentStatus.PENDING,
      },
    });
  }

  return NextResponse.json({
    job,
    fee,
    paymentRequired: fee > 0,
  });
}
