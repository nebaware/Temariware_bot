// Temariware — References + Appendices + Main assembly

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  NumberFormat, SectionType, BorderStyle, ShadingType,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered,
  figure, figureWithCaption,
  buildCover, buildCertificate, buildAcknowledgment, buildAbstract, buildTOC, buildListsAndAcronyms,
  FONT, SIZE_BODY, SIZE_H1, SIZE_H2, SIZE_H3, LINE_SPACING_15,
  MARGIN_TOP, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_RIGHT,
  PAGE_WIDTH, PAGE_HEIGHT,
} = require("./generate-project-doc.js");
const { buildChapter1 } = require("./generate-chapter1.js");
const { buildChapter2, buildChapter3 } = require("./generate-chapter2-3.js");

// =====================================================================
// REFERENCES
// =====================================================================

function buildReferences() {
  return [
    h1("References"),
    empty(),
    body("[1]  Telegram. (2024). Telegram Bot API Documentation. [Online]. Available: https://core.telegram.org/bots/api [Accessed: July 10, 2026]."),
    body("[2]  Telegram. (2024). Telegram Mini Apps \u2014 Web Apps. [Online]. Available: https://core.telegram.org/bots/webapps [Accessed: July 10, 2026]."),
    body("[3]  Telegram. (2024). Validating Data Received via the Mini App. [Online]. Available: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app [Accessed: July 10, 2026]."),
    body("[4]  Vercel Inc. (2024). Next.js 16 Documentation. [Online]. Available: https://nextjs.org/docs [Accessed: July 10, 2026]."),
    body("[5]  Vercel Inc. (2024). Vercel Platform Documentation. [Online]. Available: https://vercel.com/docs [Accessed: July 10, 2026]."),
    body("[6]  Prisma. (2024). Prisma ORM Documentation. [Online]. Available: https://www.prisma.io/docs [Accessed: July 10, 2026]."),
    body("[7]  Neon. (2024). Neon Serverless Postgres Documentation. [Online]. Available: https://neon.tech/docs [Accessed: July 10, 2026]."),
    body("[8]  Tailwind Labs. (2024). Tailwind CSS Documentation. [Online]. Available: https://tailwindcss.com/docs [Accessed: July 10, 2026]."),
    body("[9]  shadcn. (2024). shadcn/ui Component Library. [Online]. Available: https://ui.shadcn.com [Accessed: July 10, 2026]."),
    body("[10] Meta Platforms. (2024). React 19 Documentation. [Online]. Available: https://react.dev [Accessed: July 10, 2026]."),
    body("[11] Microsoft. (2024). TypeScript Handbook. [Online]. Available: https://www.typescriptlang.org/docs/handbook [Accessed: July 10, 2026]."),
    body("[12] Bun. (2024). Bun JavaScript Runtime Documentation. [Online]. Available: https://bun.sh/docs [Accessed: July 10, 2026]."),
    body("[13] Larsson, F. and Vesterlund, M. (2023). Serverless Web Applications with Next.js and Vercel. In Proceedings of the Nordic Web Conference, pp. 45\u201358, Stockholm, Sweden, 2023."),
    body("[14] Pressman, R. S. (2014). Software Engineering: A Practitioner's Approach (8th ed.). McGraw-Hill Education, New York, 2014."),
    body("[15] Sommerville, I. (2015). Software Engineering (10th ed.). Pearson, Boston, 2015."),
    body("[16] Booch, G., Rumbaugh, J., and Jacobson, I. (2005). The Unified Modeling Language User Guide (2nd ed.). Addison-Wesley Professional, Boston, 2005."),
    body("[17] Fowler, M. (2002). Patterns of Enterprise Application Architecture. Addison-Wesley Professional, Boston, 2002."),
    body("[18] Hoffer, J. A., Venkataraman, R., and Topi, H. (2016). Modern Database Management (12th ed.). Pearson, Boston, 2016."),
    body("[19] Ethiopian Ministry of Innovation and Technology. (2022). National Digital Transformation Strategy. [Online]. Available: https://www.mint.gov.et [Accessed: July 10, 2026]."),
    body("[20] World Bank. (2023). Ethiopia Economic Update: The Role of Digital Technology in Youth Employment. [Online]. Available: https://www.worldbank.org/en/country/ethiopia [Accessed: July 10, 2026]."),
    body("[21] Afriwork. (2024). Afriwork Freelance Ethiopia \u2014 Telegram Channel. [Online]. Available: https://t.me/freelanceethbot [Accessed: July 10, 2026]."),
    body("[22] Yegna Tutors. (2024). Yegna Tutors Harrar \u2014 Telegram Channel. [Online]. Available: https://t.me/Yegnatutorharrar [Accessed: July 10, 2026]."),
    body("[23] Chapa Financial Technologies. (2024). Chapa Payment API Documentation. [Online]. Available: https://developer.chapa.co [Accessed: July 10, 2026]."),
    body("[24] Ethio Telecom. (2024). Telebirr Mobile Payment Service. [Online]. Available: https://www.ethiotelecom.et/telebirr [Accessed: July 10, 2026]."),
    body("[25] Mozilla Developer Network. (2024). Web Crypto API \u2014 HMAC SubtleCrypto. [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign [Accessed: July 10, 2026]."),
  ];
}

// =====================================================================
// APPENDICES
// =====================================================================

function buildAppendices() {
  return [
    h1("Appendices"),
    empty(),
    h2("Appendix A: Complete CRC Card Set"),
    body(
      "This appendix contains the complete set of Class-Responsibility-Collaboration (CRC) cards for all seven primary classes in the Temariware system: User, Job, Application, Subscription, VerificationRequest, Setting, and Payment. Three representative cards were presented in Table 2.3, 2.4, and 2.5 of Chapter Two; the remaining four cards are presented here.",
    ),
    body("[Additional CRC cards for Subscription, VerificationRequest, Setting, and Payment classes \u2014 to be inserted by the team following the same format as Tables 2.3-2.5.]"),

    h2("Appendix B: User Interface Prototype Screenshots"),
    body(
      "This appendix contains the user interface diagrams of the six primary views of the Temariware Mini App. The diagrams show the structural layout and component composition of each view, including the header, navigation, content areas, and action buttons. These wireframes were produced during the design phase and informed the high-fidelity implementation in React with Tailwind CSS and shadcn/ui components.",
    ),
    ...figureWithCaption("figure_3_10_ui_home.png", "Figure B.1: Home View \u2014 Job Feed with Search and Filters"),
    ...figureWithCaption("figure_3_11_ui_detail.png", "Figure B.2: Job Detail View with Apply Form"),
    ...figureWithCaption("figure_3_12_ui_post.png", "Figure B.3: Post Job Form with Payment Screenshot Upload"),
    ...figureWithCaption("figure_3_13_ui_apps.png", "Figure B.4: Applications View \u2014 Employer Applicants Tab"),
    ...figureWithCaption("figure_3_14_ui_profile.png", "Figure B.5: Profile View \u2014 Mandatory Documents Upload"),
    ...figureWithCaption("figure_3_15_ui_admin.png", "Figure B.6: Admin Panel \u2014 Pending Jobs Tab"),

    h2("Appendix C: Database Schema (Prisma)"),
    body(
      "This appendix contains the complete Prisma schema file (schema.prisma) that defines the database structure for Temariware. The schema is the authoritative source for all entity definitions, relationships, and constraints referenced throughout this document.",
    ),
    // Render the schema as a fixed-width code block
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { line: 240, after: 60 },
      shading: { type: ShadingType.CLEAR, fill: "F5F5F5", color: "auto" },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" },
      },
      children: [new TextRun({
        text: [
          "generator client {",
          "  provider = \"prisma-client-js\"",
          "}",
          "",
          "datasource db {",
          "  provider = \"postgresql\"",
          "  url      = env(\"DATABASE_URL\")",
          "}",
          "",
          "enum UserRole { STUDENT  EMPLOYER  ADMIN }",
          "enum VerificationStatus { NONE  PENDING  APPROVED  REJECTED }",
          "enum JobStatus { PENDING_PAYMENT  PENDING  APPROVED  REJECTED  CLOSED  EXPIRED }",
          "enum JobType { TUTORING  FREELANCE  PART_TIME  FULL_TIME  INTERNSHIP  REMOTE }",
          "enum PaymentStatus { NONE  PENDING  APPROVED  REJECTED }",
          "enum ApplicationStatus { PENDING  ACCEPTED  PAYMENT_PENDING  HIRED  REJECTED  CLOSED }",
          "enum PaymentType { JOB_POST  APPLICATION }",
          "",
          "model User {",
          "  id                String   @id @default(cuid())",
          "  telegramId        String   @unique",
          "  username          String?",
          "  role              UserRole @default(STUDENT)",
          "  language          String   @default(\"en\")",
          "  fullName          String?",
          "  phone             String?",
          "  university        String?",
          "  fieldOfStudy      String?",
          "  year              Int?",
          "  bio               String?",
          "  cvUrl             String?",
          "  nationalIdNumber  String?",
          "  nationalIdImage   String?",
          "  universityIdNumber String?",
          "  universityIdImage String?",
          "  lastSemesterGradeImage String?",
          "  profileComplete   Boolean  @default(false)",
          "  companyName       String?",
          "  companyTelegram   String?",
          "  verification      VerificationStatus @default(NONE)",
          "  isAdmin           Boolean  @default(false)",
          "  alertSubjects     String?",
          "  alertLocations    String?",
          "  createdAt         DateTime @default(now())",
          "  updatedAt         DateTime @updatedAt",
          "  jobs              Job[]",
          "  applications      Application[]",
          "  subscriptions     Subscription[]",
          "  verifications     VerificationRequest[]",
          "  payments          Payment[]",
          "}",
          "",
          "model Job {",
          "  id            String      @id @default(cuid())",
          "  title         String",
          "  description   String",
          "  employerId    String",
          "  employer      User        @relation(fields: [employerId], references: [id])",
          "  subjects      String",
          "  gradeLevel    String?",
          "  location      String?",
          "  workType      JobType     @default(TUTORING)",
          "  salary        String?",
          "  currency      String      @default(\"ETB\")",
          "  hoursPerWeek  String?",
          "  genderPref    String?",
          "  languageReq    String?",
          "  deadline      DateTime?",
          "  contactTelegram String?",
          "  status        JobStatus   @default(PENDING_PAYMENT)",
          "  rejectionReason String?",
          "  positionsAvailable Int?",
          "  filledPositions    Int    @default(0)",
          "  applicationFee     Float?",
          "  paymentScreenshot String?",
          "  paymentStatus     PaymentStatus @default(NONE)",
          "  createdAt     DateTime    @default(now())",
          "  updatedAt     DateTime    @updatedAt",
          "  applications  Application[]",
          "  payments      Payment[]",
          "  @@index([status, createdAt])",
          "}",
          "",
          "model Application {",
          "  id          String            @id @default(cuid())",
          "  jobId       String",
          "  job         Job               @relation(fields: [jobId], references: [id])",
          "  userId      String",
          "  user        User              @relation(fields: [userId], references: [id])",
          "  message     String?",
          "  status      ApplicationStatus @default(PENDING)",
          "  paymentScreenshot String?",
          "  paymentStatus     PaymentStatus @default(NONE)",
          "  hiredAt     DateTime?",
          "  createdAt   DateTime          @default(now())",
          "  @@unique([jobId, userId])",
          "  @@index([userId])",
          "}",
          "",
          "model Subscription {",
          "  id        String   @id @default(cuid())",
          "  userId    String",
          "  user      User     @relation(fields: [userId], references: [id])",
          "  category  String",
          "  createdAt DateTime @default(now())",
          "  @@unique([userId, category])",
          "}",
          "",
          "model VerificationRequest {",
          "  id          String              @id @default(cuid())",
          "  userId      String",
          "  user        User                @relation(fields: [userId], references: [id])",
          "  companyName String",
          "  contactTelegram String",
          "  proofUrl    String?",
          "  note        String?",
          "  status      VerificationStatus  @default(PENDING)",
          "  createdAt   DateTime            @default(now())",
          "}",
          "",
          "model Setting {",
          "  id                  String   @id @default(\"singleton\")",
          "  jobPostFee          Float    @default(500)",
          "  applicationFee      Float    @default(25)",
          "  paymentInstructions String",
          "  telebirrNumber      String?",
          "  cbeAccount           String?",
          "  chapaEnabled        Boolean  @default(false)",
          "  updatedAt           DateTime @updatedAt",
          "}",
          "",
          "model Payment {",
          "  id              String       @id @default(cuid())",
          "  userId          String",
          "  user            User         @relation(fields: [userId], references: [id])",
          "  jobId           String",
          "  job             Job          @relation(fields: [jobId], references: [id])",
          "  type            PaymentType",
          "  applicationId   String?",
          "  amount          Float",
          "  screenshotUrl   String?",
          "  status          PaymentStatus @default(PENDING)",
          "  reviewedBy      String?",
          "  reviewNote      String?",
          "  createdAt       DateTime     @default(now())",
          "  reviewedAt      DateTime?",
          "  @@index([status, type])",
          "}",
        ].join("\n"),
        font: { ascii: "Courier New", hAnsi: "Courier New", cs: "Courier New" },
        size: 16,  // 8pt to fit the wide schema
        color: "000000",
      })],
    }),

    h2("Appendix D: Telegram Bot Commands Reference"),
    body("This appendix lists all Telegram bot commands supported by @temariwarebot, along with their descriptions and example usage."),
    body("\u2022  /start \u2014 Welcome message with Open Temariware button."),
    body("\u2022  /latest \u2014 Shows the 5 most recently approved jobs with inline buttons."),
    body("\u2022  /search <query> \u2014 Searches jobs by title, description, subjects, or location. Example: /search math"),
    body("\u2022  /subscribe <category> \u2014 Subscribes to push alerts for a job category. Categories: ALL, TUTORING, FREELANCE, PART_TIME, FULL_TIME, INTERNSHIP, REMOTE. Example: /subscribe Tutoring"),
    body("\u2022  /unsubscribe <category> \u2014 Unsubscribes from alerts for a category."),
    body("\u2022  /myapps \u2014 Lists the user's applications with current status."),
    body("\u2022  /postjob \u2014 Opens the Post Job form in the Mini App (verified employers only)."),
    body("\u2022  /admin \u2014 Opens the Admin panel in the Mini App (administrators only)."),
    body("\u2022  /help \u2014 Lists all available commands."),

    h2("Appendix E: Deployment Guide Summary"),
    body(
      "This appendix summarises the deployment steps for the Temariware system. The full deployment guide is available in the project repository as DEPLOYMENT.md. The system is deployed entirely on free-tier infrastructure: Vercel for the Next.js application, Neon for the PostgreSQL database, and the Telegram Bot API (which is free). Total recurring cost: zero Ethiopian Birr per month.",
    ),
    body("\u2022  Step 1: Create a Telegram bot via @BotFather and obtain the bot token."),
    body("\u2022  Step 2: Create a Neon Postgres database and obtain the connection string."),
    body("\u2022  Step 3: Deploy the Next.js application to Vercel via the Vercel CLI."),
    body("\u2022  Step 4: Set environment variables on Vercel (TELEGRAM_BOT_TOKEN, DATABASE_URL, MINI_APP_URL, ADMIN_TELEGRAM_IDS, ALERT_CHAT_ID, CHANNEL_USERNAME, TELEGRAM_BOT_USERNAME)."),
    body("\u2022  Step 5: Set the Telegram webhook to https://your-app.vercel.app/api/bot."),
    body("\u2022  Step 6: Configure the Mini App menu button in @BotFather."),
    body("\u2022  Step 7: Add @temariwarebot as administrator to the @TEMARIWARE channel with Post Messages permission."),
    body("\u2022  Step 8: Push the Prisma schema to the database (prisma db push) and seed initial settings."),
    body("\u2022  Step 9: Test end-to-end by posting a job as admin, approving it, and verifying the channel broadcast."),
  ];
}

// =====================================================================
// HEADERS & FOOTERS
// =====================================================================

function buildHeader(text) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 4 } },
        children: [new TextRun({
          text,
          font: { ascii: FONT, hAnsi: FONT, cs: FONT },
          size: 20,
          color: "333333",
          italics: true,
        })],
      }),
    ],
  });
}

function buildPageNumberFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { line: 240 },
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: { ascii: FONT, hAnsi: FONT, cs: FONT },
            size: 20,
          }),
        ],
      }),
    ],
  });
}

// Empty header (for cover page)
function buildEmptyHeader() {
  return new Header({ children: [new Paragraph({ children: [] })] });
}
function buildEmptyFooter() {
  return new Footer({ children: [new Paragraph({ children: [] })] });
}

// =====================================================================
// MAIN DOCUMENT ASSEMBLY
// =====================================================================

const REPORT_TITLE = "Temariware \u2014 A Telegram Mini App for University Student Job Matching in Ethiopia";

const doc = new Document({
  creator: "Temariware Project Team",
  title: "Design and Implementation of Temariware",
  description: "Senior Project Proposal \u2014 Dire Dawa University, Department of Information Technology",
  styles: {
    default: {
      document: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_BODY, color: "000000" },
        paragraph: { spacing: { line: LINE_SPACING_15 } },
      },
      heading1: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_H1, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240, line: LINE_SPACING_15 } },
      },
      heading2: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_H2, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 240, after: 120, line: LINE_SPACING_15 } },
      },
      heading3: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_H3, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 180, after: 60, line: LINE_SPACING_15 } },
      },
    },
  },
  sections: [
    // SECTION 1: COVER PAGE — no header, no footer, no page number
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: { default: buildEmptyHeader() },
      footers: { default: buildEmptyFooter() },
      children: buildCover(),
    },

    // SECTION 2: FRONT MATTER (Certificate, Acknowledgment, Abstract, TOC, Lists, Acronyms)
    // Roman numeral page numbers starting from i
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: {
            top: MARGIN_TOP, bottom: MARGIN_BOTTOM,
            left: MARGIN_LEFT, right: MARGIN_RIGHT,
            header: 720, footer: 720,
          },
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
        },
      },
      headers: { default: buildHeader(REPORT_TITLE) },
      footers: { default: buildPageNumberFooter() },
      children: [
        ...buildCertificate(),
        ...buildAcknowledgment(),
        ...buildAbstract(),
        ...buildTOC(),
        ...buildListsAndAcronyms(),
      ],
    },

    // SECTION 3: BODY (Chapters 1, 2, 3)
    // Arabic page numbers starting from 1
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: {
            top: MARGIN_TOP, bottom: MARGIN_BOTTOM,
            left: MARGIN_LEFT, right: MARGIN_RIGHT,
            header: 720, footer: 720,
          },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: buildHeader(REPORT_TITLE) },
      footers: { default: buildPageNumberFooter() },
      children: [
        ...buildChapter1(),
        ...buildChapter2(),
        ...buildChapter3(),
      ],
    },

    // SECTION 4: REFERENCES & APPENDICES (Arabic continued)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: {
            top: MARGIN_TOP, bottom: MARGIN_BOTTOM,
            left: MARGIN_LEFT, right: MARGIN_RIGHT,
            header: 720, footer: 720,
          },
          pageNumbers: { formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: buildHeader(REPORT_TITLE) },
      footers: { default: buildPageNumberFooter() },
      children: [
        ...buildReferences(),
        ...buildAppendices(),
      ],
    },
  ],
});

// Generate
const OUTPUT_PATH = "/home/z/my-project/download/Temariware_Project_Proposal.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`\u2713 Document generated: ${OUTPUT_PATH}`);
  console.log(`  Size: ${(stats.size / 1024).toFixed(1)} KB`);
}).catch((err) => {
  console.error("\u2717 Generation failed:", err);
  process.exit(1);
});
