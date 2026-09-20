// GET /api/jobs/[id] — single job with employer info
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JobStatus } from "@prisma/client";
import { authenticate } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await authenticate(request);

  const job = await db.job.findUnique({
    where: { id },
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

  if (!job || (job.status !== JobStatus.APPROVED && job.status !== JobStatus.CLOSED && job.employerId !== user?.id && !user?.isAdmin)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Has the current user already applied?
  let myApplication = null;
  if (user) {
    myApplication = await db.application.findUnique({
      where: { jobId_userId: { jobId: job.id, userId: user.id } },
    });
  }

  return NextResponse.json({ job, myApplication });
}
