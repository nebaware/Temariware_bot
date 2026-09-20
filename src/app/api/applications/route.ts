// GET /api/applications — current user's applications
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ applications: [] });
  }
  const applications = await db.application.findMany({
    where: { userId: user.id },
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
          status: true,
          employer: {
            select: {
              companyName: true,
              companyTelegram: true,
              verification: true,
            },
          },
        },
      },
    },
  });
  return NextResponse.json({ applications });
}
