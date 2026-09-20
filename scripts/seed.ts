// Seed script — populates the dev DB with realistic sample jobs.
// Run with: bun run /home/z/my-project/scripts/seed.ts

import { PrismaClient, JobType, JobStatus, VerificationStatus, UserRole } from "@prisma/client";

const db = new PrismaClient();

const ADMIN_TG = "100000001";
const EMPLOYER_TG = "100000002";
const STUDENT_TG = "100000003";

async function main() {
  console.log("Seeding Temariware dev DB...");

  // Wipe (dev only)
  await db.application.deleteMany();
  await db.subscription.deleteMany();
  await db.verificationRequest.deleteMany();
  await db.job.deleteMany();
  await db.user.deleteMany();

  const admin = await db.user.create({
    data: {
      telegramId: ADMIN_TG,
      firstName: "Admin",
      username: "temariware_admin",
      role: UserRole.ADMIN,
      isAdmin: true,
      language: "en",
    },
  });

  const employer1 = await db.user.create({
    data: {
      telegramId: EMPLOYER_TG,
      firstName: "Yegna",
      username: "yegnattutorharrar",
      role: UserRole.EMPLOYER,
      verification: VerificationStatus.APPROVED,
      companyName: "የኛ Tutors Harrar",
      companyTelegram: "@Yegnatutorharrar",
      language: "am",
    },
  });

  const employer2 = await db.user.create({
    data: {
      telegramId: "100000004",
      firstName: "Afriwork",
      username: "afriworket",
      role: UserRole.EMPLOYER,
      verification: VerificationStatus.APPROVED,
      companyName: "Afriwork Ethiopia",
      companyTelegram: "@freelanceethbot",
      language: "en",
    },
  });

  const employer3 = await db.user.create({
    data: {
      telegramId: "100000005",
      firstName: "Loza",
      username: "lozanutrition",
      role: UserRole.EMPLOYER,
      verification: VerificationStatus.APPROVED,
      companyName: "Loza Nutritional Therapy Center",
      companyTelegram: "@lozanutrition",
      language: "en",
    },
  });

  const student = await db.user.create({
    data: {
      telegramId: STUDENT_TG,
      firstName: "Abebe",
      username: "abebe_student",
      role: UserRole.STUDENT,
      language: "or",
      fullName: "Abebe Bekele",
      phone: "+251911223344",
      university: "Haramaya University",
      fieldOfStudy: "Computer Science",
      year: 3,
      bio: "Year-3 CS student tutoring Math & Physics since high school. Fluent in Afaan Oromoo & Amharic.",
      cvUrl: "https://drive.google.com/file/d/example",
      alertSubjects: "Math,Physics,Computer Science",
      alertLocations: "Harar,Aweday,Remote",
    },
  });

  // Subscribe student to TUTORING + FREELANCE alerts
  await db.subscription.createMany({
    data: [
      { userId: student.id, category: "TUTORING" },
      { userId: student.id, category: "FREELANCE" },
      { userId: student.id, category: "ALL" },
    ],
  });

  const now = Date.now();
  const days = (n: number) => new Date(now + n * 24 * 60 * 60 * 1000);

  // ---- Sample jobs (mirroring the examples the user shared) ----------------

  const jobs = [
    {
      title: "Student Tutors — All Subjects (Grade 5, Female)",
      description:
        "We are hiring female university students to tutor a Grade 5 learner in Harar. Strong academic background and excellent communication skills required. Afan Oromo fluency is a plus. Sessions are 1 hour each, 4 days a week. This is a recurring part-time role — perfect for university students who want steady income alongside their studies.",
      employerId: employer1.id,
      subjects: "All",
      gradeLevel: "Grade 5",
      location: "Papaw gar, Harar",
      workType: JobType.TUTORING,
      salary: "Negotiable per session",
      hoursPerWeek: "4 days/week, 1hr per session",
      genderPref: "female",
      languageReq: "Afan Oromo (preferred)",
      deadline: days(14),
      contactTelegram: "@Yegnatutorharrar",
      status: JobStatus.APPROVED,
    },
    {
      title: "Math + Science Tutor (Grade 3, Male) — 3000 ETB",
      description:
        "Tutor a Grade 3 student in both Math and Science, 4 days a week near Samrat Hotel, Harar. Total compensation is 3000 ETB for both subjects combined. University ID and last semester grade report required at first session. Looking for a reliable male university student with strong academic background.",
      employerId: employer1.id,
      subjects: "Math,Science",
      gradeLevel: "Grade 3",
      location: "Samrat Hotel area, Harar",
      workType: JobType.TUTORING,
      salary: "3000 ETB for both subjects",
      hoursPerWeek: "4 days/week, 1hr per session",
      genderPref: "male",
      deadline: days(10),
      contactTelegram: "@Yegnatutorharrar",
      status: JobStatus.APPROVED,
    },
    {
      title: "Sales Representative (Healthcare Marketing)",
      description:
        "MEDesign is Addis Ababa's specialized digital marketing and multimedia agency serving exclusively the healthcare sector. We partner with hospitals, clinics, and medical platforms. We are looking for a Sales Representative with strong communication and a network in the healthcare sector. This is a hybrid full-time role with monthly salary + commission. University students in their final year with sales experience are encouraged to apply.",
      employerId: employer2.id,
      subjects: "Sales,Marketing,Business",
      gradeLevel: "University (final year welcome)",
      location: "Addis Ababa (Hybrid)",
      workType: JobType.FULL_TIME,
      salary: "Monthly + commission",
      hoursPerWeek: "Full-time",
      deadline: days(7),
      contactTelegram: "@freelanceethbot",
      status: JobStatus.APPROVED,
    },
    {
      title: "Medical Content Creator / Social Media Manager (Female, 60,000 ETB/mo)",
      description:
        "Loza Nutritional Consulting and Therapy is seeking a dynamic, creative, and confident female Social Media Manager & Medical Content Host. You'll manage our social channels, create educational medical content, and host video sessions. Strong written Amharic & English required. Nutrition/dietetics background is a big plus. Salary: 60,000 ETB/month, on-site in Addis Ababa.",
      employerId: employer3.id,
      subjects: "Content Writing,Social Media,Nutrition",
      gradeLevel: "University graduate",
      location: "Addis Ababa, Ethiopia",
      workType: JobType.FULL_TIME,
      salary: "60000 ETB/month",
      hoursPerWeek: "Full-time",
      genderPref: "female",
      deadline: days(3),
      contactTelegram: "@lozanutrition",
      status: JobStatus.APPROVED,
    },
    {
      title: "Full Stack Software Developer (On-site, Addis Ababa)",
      description:
        "SERDO TRAVEL SOFTWARE PLC is hiring a Full Stack Software Developer. You'll design, develop, test, deploy, and maintain modern web applications and backend services. Required: TypeScript, React/Next.js, Node.js, PostgreSQL, REST API design. Travel-tech domain experience is a plus. This is a permanent full-time on-site role in Addis Ababa with competitive monthly salary.",
      employerId: employer2.id,
      subjects: "Computer Science,Software Engineering",
      gradeLevel: "University graduate",
      location: "Addis Ababa, Ethiopia",
      workType: JobType.FULL_TIME,
      salary: "Competitive monthly",
      hoursPerWeek: "Full-time",
      genderPref: "male",
      deadline: days(12),
      contactTelegram: "@freelanceethbot",
      status: JobStatus.APPROVED,
    },
    {
      title: "English Tutor — Grade 8 National Exam Prep",
      description:
        "Looking for a patient university student to help a Grade 8 learner prepare for the national exam in English grammar and reading comprehension. Sessions twice a week for 8 weeks starting immediately. Pay is per session, negotiable based on experience. Hybrid: in-person in Aweday + online follow-ups.",
      employerId: employer1.id,
      subjects: "English",
      gradeLevel: "Grade 8",
      location: "Aweday (Hybrid)",
      workType: JobType.TUTORING,
      salary: "Negotiable per session",
      hoursPerWeek: "2 sessions/week, 1.5hr each",
      deadline: days(5),
      contactTelegram: "@Yegnatutorharrar",
      status: JobStatus.APPROVED,
    },
    {
      title: "Part-time Graphic Designer (Freelance, Remote)",
      description:
        "Small business in Dire Dawa needs a part-time graphic designer to produce social-media posts, flyers, and product labels. ~10 hours/week. Must use Figma or Canva. University students with a portfolio welcome. Pay: per project, 1500–3500 ETB per piece depending on scope.",
      employerId: employer2.id,
      subjects: "Graphic Design,Marketing",
      gradeLevel: "University (any year)",
      location: "Remote",
      workType: JobType.FREELANCE,
      salary: "1500-3500 ETB per project",
      hoursPerWeek: "~10 hours/week",
      deadline: days(20),
      contactTelegram: "@freelanceethbot",
      status: JobStatus.APPROVED,
    },
    {
      title: "Chemistry Tutor — Grade 12, Male, Weekends",
      description:
        "Tutor a Grade 12 student for the upcoming national chemistry exam. Weekend mornings only, 2 hours each Saturday & Sunday for 6 weeks. The student lives near Harar University campus. Strong chemistry background required — please mention your final chemistry grade in your application.",
      employerId: employer1.id,
      subjects: "Chemistry",
      gradeLevel: "Grade 12",
      location: "Near Harar University",
      workType: JobType.TUTORING,
      salary: "2000 ETB/month",
      hoursPerWeek: "Weekends, 2hr each",
      genderPref: "male",
      deadline: days(8),
      contactTelegram: "@Yegnatutorharrar",
      status: JobStatus.PENDING, // pending → demo for admin panel
    },
  ];

  for (const j of jobs) {
    await db.job.create({ data: j });
  }

  // One pending verification request, so the admin tab isn't empty
  await db.verificationRequest.create({
    data: {
      userId: student.id,
      companyName: "Temari Tutoring Co-op",
      contactTelegram: "@temaricoop",
      note: "Student-led tutoring collective registered with the university.",
      status: VerificationStatus.PENDING,
    },
  });

  console.log(`✓ Seeded ${jobs.length} jobs, 1 verification request, 4 users.`);
  console.log(`  Admin telegramId: ${ADMIN_TG} (set ADMIN_TELEGRAM_IDS=100000001 to test admin)`);
  console.log(`  Employer telegramId: ${EMPLOYER_TG}`);
  console.log(`  Student telegramId: ${STUDENT_TG} (set DEV_TELEGRAM_ID=100000003 to test as student)`);
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    db.$disconnect();
    process.exit(1);
  });
