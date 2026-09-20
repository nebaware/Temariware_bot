// GET /api/admin/stats — overview stats (admin only)
// GET /api/admin/pending — pending jobs (admin only)
// GET /api/admin/verifications — pending verification requests (admin only)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";
import { JobStatus, VerificationStatus } from "@prisma/client";

async function requireAdmin(request: Request) {
  const user = await authenticate(request);
  if (!user || !user.isAdmin) return null;
  return user;
}

export async function GET(request: Request) {
  const user = await requireAdmin(request);
  if (!user) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "stats";

  if (view === "stats") {
    const [totalUsers, totalJobs, pendingJobs, approvedJobs, totalApps] = await Promise.all([
      db.user.count(),
      db.job.count(),
      db.job.count({ where: { status: JobStatus.PENDING } }),
      db.job.count({ where: { status: JobStatus.APPROVED } }),
      db.application.count(),
    ]);
    return NextResponse.json({ stats: { totalUsers, totalJobs, pendingJobs, approvedJobs, totalApps } });
  }

  if (view === "pending") {
    // Return jobs awaiting review (PENDING_PAYMENT or PENDING)
    const jobs = await db.job.findMany({
      where: { status: { in: [JobStatus.PENDING_PAYMENT, JobStatus.PENDING] } },
      orderBy: { createdAt: "desc" },
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
      },
    });
    return NextResponse.json({ jobs });
  }

  if (view === "verifications") {
    const requests = await db.verificationRequest.findMany({
      where: { status: VerificationStatus.PENDING },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            username: true,
            firstName: true,
            companyName: true,
          },
        },
      },
    });
    return NextResponse.json({ requests });
  }

  if (view === "payments") {
    // Pending application payments (students who paid after acceptance)
    const applications = await db.application.findMany({
      where: { status: "PAYMENT_PENDING" as never },
      orderBy: { createdAt: "desc" },
      include: {
        job: { select: { id: true, title: true, employerId: true, positionsAvailable: true, filledPositions: true } },
        user: {
          select: {
            id: true, telegramId: true, username: true, firstName: true, lastName: true,
            fullName: true, phone: true, university: true, fieldOfStudy: true, year: true,
          },
        },
      },
    });
    return NextResponse.json({ applications });
  }

  return NextResponse.json({ error: "Unknown view" }, { status: 400 });
}
