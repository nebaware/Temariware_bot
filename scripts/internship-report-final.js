// Temariware Internship Report — Consolidated, page-controlled (target ≤35 pages)
// Per Dire Dawa University Project Guideline + Internship Report Outline
// Rules followed:
//   - Max 35 pages total
//   - Times New Roman, A4, body 12pt, H1 14pt bold UPPER, H2 13pt bold
//   - 1.5 line spacing (1.0 for tables/captions/lists per guideline exception)
//   - Margins: Top 1" Bottom 1" Left 1.25" Right 1"
//   - No paragraph indents; no extra line between paragraphs
//   - Each section starts on a new page, centered Major Heading
//   - Roman numerals for front matter, Arabic from Introduction
//   - Outline numbering: 5. Introduction, 6. Company Background, ... 14. Conclusion
//   - Tables numbered with section prefix (Table 7.1, 8.1, etc.)

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  NumberFormat, SectionType, BorderStyle, ShadingType,
  Table, TableRow, TableCell, WidthType, TableOfContents,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");

// =====================================================================
// CONSTANTS
// =====================================================================
const FONT = "Times New Roman";
const SIZE_BODY = 24;     // 12pt
const SIZE_H1 = 28;       // 14pt
const SIZE_H2 = 26;       // 13pt
const SIZE_H3 = 24;       // 12pt
const LINE_15 = 360;      // 1.5 line spacing
const LINE_10 = 240;      // 1.0 line spacing (tables, captions)
const M_TOP = convertInchesToTwip(1);
const M_BOT = convertInchesToTwip(1);
const M_LEFT = convertInchesToTwip(1.25);
const M_RIGHT = convertInchesToTwip(1);
const PG_W = 11906;
const PG_H = 16838;

// =====================================================================
// HELPERS — per guideline: no indent, no extra line between paragraphs
// =====================================================================

function tr(text, opts = {}) {
  return new TextRun({
    text, font: { ascii: FONT, hAnsi: FONT, cs: FONT },
    size: opts.size || SIZE_BODY, bold: opts.bold || false,
    italics: opts.italics || false, color: opts.color || "000000",
  });
}

// Body paragraph: justified, 1.5 spacing, NO indent, NO extra line after
function p(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: LINE_15, after: 0, before: 0 },
    children: [tr(text)],
  });
}

// Body with inline bold segments
function pmixed(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: LINE_15, after: 0, before: 0 },
    children: runs,
  });
}

// Major heading (H1): 14pt bold UPPER CASE, centered, starts new page
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    pageBreakBefore: true,
    spacing: { line: LINE_15, before: 0, after: 240 },
    children: [new TextRun({
      text: text.toUpperCase(), font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H1, bold: true, color: "000000",
    })],
  });
}

// H1 without page break (for first section after TOC)
function h1First(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_15, before: 0, after: 240 },
    children: [new TextRun({
      text: text.toUpperCase(), font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H1, bold: true, color: "000000",
    })],
  });
}

// Second order heading (H2): 13pt bold, left
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { line: LINE_15, before: 240, after: 120 },
    children: [new TextRun({
      text, font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H2, bold: true, color: "000000",
    })],
  });
}

// Caption: centered, 1.0 spacing, smaller
function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_10, after: 60, before: 60 },
    children: [tr(text, { size: 22 })], // 11pt
  });
}

// Centered text (for cover)
function center(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_15, after: opts.after !== undefined ? opts.after : 0, before: opts.before || 0 },
    children: [tr(text, opts)],
  });
}

// Empty line (used sparingly — only on cover/front matter, not between body paragraphs)
function blank() {
  return new Paragraph({ spacing: { line: LINE_15 }, children: [] });
}

// =====================================================================
// COVER PAGE (Section 1 of outline)
// =====================================================================

function buildCover() {
  return [
    center("DIRE DAWA UNIVERSITY", { bold: true, size: 28 }),
    center("INSTITUTE OF TECHNOLOGY", { bold: true, size: 26 }),
    center("SCHOOL OF COMPUTING", { bold: true, size: 26 }),
    center("DEPARTMENT OF SOFTWARE ENGINEERING", { bold: true, size: 26 }),
    blank(), blank(),
    center("INTERNSHIP REPORT", { bold: true, size: 36 }),
    blank(),
    center("\u201CSoftware Engineering Internship Presentation\u201D", { bold: true, size: 28, italics: true }),
    blank(), blank(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_15, after: 0 },
      children: [tr("A report submitted to the Department of Software Engineering, School of Computing, Dire Dawa University Institute of Technology, in partial fulfillment of the requirements of the internship programme for the Degree of BSc in Software Engineering.", { size: 22 })],
    }),
    blank(), blank(),
    // Info table
    new Table({
      width: { size: 80, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      borders: allBorders(6),
      rows: [
        infoRow("Student Name", "Nebiyu Tsegaye"),
        infoRow("Student ID", "1501332"),
        infoRow("Programme", "BSc in Software Engineering"),
        infoRow("Internship Organization", "Afronex Tech Company"),
        infoRow("Internship Period", "10/06/2018 E.C \u2013 10/10/2018 E.C"),
        infoRow("Industry Supervisor", "Mr. Tsegaw (to be confirmed)"),
        infoRow("University Advisor", "[Advisor Name]"),
        infoRow("Submission Date", "10/01/2019 E.C"),
        infoRow("Presentation Date", "12/01/2019 E.C"),
      ],
    }),
    blank(), blank(),
    center("Dire Dawa, Ethiopia", { size: 22, italics: true }),
  ];
}

function infoRow(label, value) {
  return new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
        children: [new Paragraph({ spacing: { line: LINE_10 }, children: [tr(label, { bold: true, size: 22 })] })],
      }),
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({ spacing: { line: LINE_10 }, children: [tr(value, { size: 22 })] })],
      }),
    ],
  });
}

function allBorders(size) {
  const s = { style: BorderStyle.SINGLE, size, color: "000000" };
  return { top: s, bottom: s, left: s, right: s, insideHorizontal: s, insideVertical: s };
}

// =====================================================================
// ACKNOWLEDGMENT (Section 2 of outline — optional, 1 short paragraph)
// =====================================================================

function buildAcknowledgment() {
  return [
    h1First("Acknowledgment"),
    p("I would like to express my sincere gratitude to Afronex Tech Company for accepting me as an intern and for creating an environment in which I could learn through meaningful software development activities. The company received us politely, directed us on how to engage with new technology advancements including artificial intelligence, provided communication channels with senior developers, taught us how to use modern frameworks, assigned us real client-facing projects, and followed our progress through weekly supervision. I am also grateful to my classmates at Dire Dawa University and the interns from other universities including Haramaya University who worked alongside me; their collaboration, shared experience, and disciplined discussions improved every deliverable. I thank Mr. Tsegaw, the leader of Afronex and a lecturer at DDU, for his committed mentorship, and I thank my family for their support throughout the internship. This report is dedicated to all those who walked with me through this journey of growth and discovery."),
  ];
}

// =====================================================================
// LIST OF ACRONYMS (Section 3 of outline — optional, compact 2-col)
// =====================================================================

function buildAcronyms() {
  const acronyms = [
    ["AI", "Artificial Intelligence"], ["API", "Application Programming Interface"],
    ["BSc", "Bachelor of Science"], ["CBE", "Commercial Bank of Ethiopia"],
    ["CRUD", "Create, Read, Update, Delete"], ["DBMS", "Database Management System"],
    ["DDU", "Dire Dawa University"], ["EC", "Ethiopian Calendar"],
    ["ERD", "Entity-Relationship Diagram"], ["ETB", "Ethiopian Birr"],
    ["HTML", "Hypertext Markup Language"], ["HTTPS", "Hypertext Transfer Protocol Secure"],
    ["ID", "Identification"], ["IDE", "Integrated Development Environment"],
    ["JSON", "JavaScript Object Notation"], ["JWT", "JSON Web Token"],
    ["MVC", "Model-View-Controller"], ["MVP", "Minimum Viable Product"],
    ["OCR", "Optical Character Recognition"], ["Odoo", "Open-source ERP framework"],
    ["OOP", "Object-Oriented Programming"], ["OTP", "One-Time Password"],
    ["ORM", "Object-Relational Mapping"], ["PDF", "Portable Document Format"],
    ["PWA", "Progressive Web Application"], ["QA", "Quality Assurance"],
    ["REST", "Representational State Transfer"], ["SaaS", "Software-as-a-Service"],
    ["SDLC", "Software Development Life Cycle"], ["SQL", "Structured Query Language"],
    ["TOTP", "Time-based One-Time Password"], ["UI", "User Interface"],
    ["URL", "Uniform Resource Locator"], ["UX", "User Experience"],
    ["VCS", "Version Control System"],
  ];
  // 2-column layout: each row has 2 acronym+meaning pairs
  const pairs = [];
  for (let i = 0; i < acronyms.length; i += 2) {
    pairs.push([acronyms[i], acronyms[i + 1] || ["", ""]]);
  }
  return [
    h1First("List of Acronyms"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders(),
      rows: pairs.map(([left, right]) => new TableRow({
        cantSplit: true,
        children: [
          ...[left, right].map((pair, idx) => new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 20, bottom: 20, left: 40, right: 40 },
            children: [new Paragraph({ spacing: { line: LINE_10 }, children: [
              tr(pair[0], { bold: true, size: 20 }),
              tr(`  ${pair[1]}`, { size: 20 }),
            ] })],
          })),
        ],
      })),
    }),
  ];
}

function noBorders() {
  const n = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: n, bottom: n, left: n, right: n, insideHorizontal: n, insideVertical: n };
}

// =====================================================================
// TABLE OF CONTENTS (Section 4 of outline)
// =====================================================================

function buildTOC() {
  return [
    h1First("Table of Contents"),
    new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
    new Paragraph({
      spacing: { line: LINE_10, before: 240 },
      children: [new TextRun({
        text: "[Right-click the table above and choose \u201CUpdate Field\u201D to refresh page numbers.]",
        font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: 20, italics: true, color: "808080",
      })],
    }),
  ];
}

// =====================================================================
// BODY SECTIONS — following outline numbering 5-14
// =====================================================================

// --- 5. Introduction (2 pages) ---
function buildIntroduction() {
  return [
    h1First("5. Introduction"),
    h2("5.1 Purpose of the Internship"),
    p("The purpose of my internship was to acquire practical software engineering experience by participating in real projects, collaborating with developers and fellow interns, and applying academic knowledge to user-facing and business-oriented systems. I aimed to understand the complete delivery process: studying an existing codebase, interpreting requirements, implementing within an assigned boundary, connecting layers, testing, presenting, revising, and integrating. The internship programme at Dire Dawa University is structured as a full-semester industrial placement completed after the third year of study, designed to bridge the gap between classroom learning and professional practice by exposing students to real client requirements, real deadlines, real code review, and real production considerations. For me specifically, the programme aligned with my personal interests in web development and artificial intelligence, both of which I had the opportunity to explore in depth during the four months at Afronex."),
    h2("5.2 How It Relates to Your Programme of Study"),
    p("We applied most skills that we acquired through the three years of learning software engineering at DDU in order to solve real-world problems. The internship fits the sectors I want to specialise upon, particularly web development and AI. Over the preceding three years, I completed courses in Object-Oriented Programming, Data Structures and Algorithms, Object-Oriented System Analysis and Design, Advanced Software Engineering, Fundamentals of Database Systems, Software Architecture and Design, Software Security, Internet Programming, Mobile Application Development, and Software Engineering Tools and Practices, among others as per the DDU curriculum. During the internship, I drew on these foundations daily: Object-Oriented Analysis informed the way I read existing class diagrams; Advanced Database Systems guided my work on the payment audit trail; Software Architecture shaped my understanding of the seven-team allocation structure; and Software Security informed my approach to payment screenshot handling and OTP confirmation flows."),
    h2("5.3 Personal Learning Objectives"),
    p("My personal learning objectives were to learn anything useful for the project we were working on, to strengthen my full-stack web development skills, to gain practical exposure to payment and subscription workflows, to improve my debugging and testing habits, and to explore the responsible use of AI-assisted engineering. I also wanted to understand how a complex product is divided among task-based teams and how cross-team integration works in practice. An additional objective was to learn how to monitor and direct agentic AI systems when performing tasks outside my primary expertise, which shaped my preference for the Django framework (Python-based, compatible with the AI ecosystem) on selected projects."),
    h2("5.4 Initial Assumptions and How They Changed"),
    p("I assumed building the whole system would be given to me to do as the company wanted, and to be integrated and deployed directly into production. This assumption made me nervous, as I feared any mistake would have immediate real-world consequences. The reality was very different: the work was fundamentally about teamwork, with each intern assigned to a specific role based on their strengths, and integration happened only after multiple rounds of review, testing, and cross-team coordination. I learned that production readiness is not the responsibility of a single developer but the collective outcome of a disciplined team process: shared contracts, code review, integration testing, acceptance criteria, and stakeholder sign-off. I also learned that asking a precise question early was often more efficient than implementing an assumption and discovering later that it conflicted with another module's expectations."),
    h2("5.5 Planned Schedule, Onboarding, and First Assignment"),
    p("I made myself busy from the first day with learning and implementing until I reached what was expected of me. There was no rigid schedule that framed my working days; instead, we were advised to manage our own time while ensuring project milestones were met. The company provided a final submission date and a presentation day for each project, on which we would demonstrate the work, check integration issues, and fix defects. Onboarding consisted of reading shared documentation including developer-prompt.md, team-ownership-matrix.md, delivery-roadmap.md, and the team-allocation file. My first assignment was to locate my team (Team 6: Payments and Subscriptions), read my feature plan and checklist, and keep the developer-prompt.md file open as the authoritative reference. We were supervised through weekly meetings with no fixed dates, scheduled around project progress."),
  ];
}

// --- 6. Company Background (2 pages) ---
function buildCompanyBackground() {
  return [
    h1("6. Company Background"),
    h2("6.1 Organizational Overview"),
    p("Afronex Tech Company is found in Dire Dawa city, Ethiopia, near Dire Dawa University. The company is known for delivering real-time technology solutions for real-world problems across multiple domains including system development, web development, artificial intelligence, and technology skills development. Its client base spans the eastern region and the wider national market, with a focus on serving government institutions, membership-based organisations, and small-to-medium enterprises. Afronex is led by Mr. Tsegaw, who is also a lecturer at DDU. His academic background in software engineering informs the company's working culture, which combines discipline with mentorship. He was friendly with his students and continually encouraged us to advance on software development and AI usage. The company is now focusing its strategic direction on AI-driven products. Afronex also runs Afronex Tech Hub, a skills-development initiative that teaches practical software engineering to early-career developers. This culture of openness made the internship particularly valuable: interns were integrated into active project teams, given ownership of specific features, and held accountable for delivery in the same way as full-time engineers."),
    h2("6.2 Services and Technology Orientation"),
    p("The internship environment reflected the needs of modern digital services: accessible interfaces, responsive workflows, secure handling of sensitive data, integration between modules, and adaptability to changing requirements. Afronex's service portfolio spans custom web application development, membership management systems, AI-driven care solutions, accounting and inventory subsystems built on Odoo, and a growing set of AI product initiatives. Because the projects involved confidential organisational and client information, all references in this report have been generalised. The company's technology orientation favours mature, well-supported frameworks: React with TypeScript for frontend work, Django and Odoo for Python-based backend work, and agentic AI patterns for selected development activities. GitHub was used throughout for version control with structured branching and review conventions."),
    h2("6.3 Organizational Structure and Intern Placement"),
    p("Interns were assigned across all project groups according to the tasks and ownership areas defined for the product. I was mainly assigned to Team 6 (Payments and Subscriptions), but my work was not limited to a single layer. The full team structure comprised seven teams, each with a clearly defined ownership area, as summarised in Table 6.1. The assignment order followed a strict dependency chain: Team 1 started first to lock shared platform contracts; Teams 2 and 3 started after Team 1's contracts were stable; Teams 4, 5, and 6 started after shared API and status rules were finalised; and Team 7 ran across the integration phase to validate cross-module behaviour."),
    caption("Table 6.1: Team Allocation for the Membership Management System Modernisation"),
    buildTeamTable(),
    h2("6.4 Working Culture"),
    p("The working culture emphasised communication, peer support, iterative improvement, and practical completion. Work was organised around expected deliverables, demonstrations, and integration milestones rather than rigid daily stand-ups. We were encouraged to come forward with new feature recommendations on the project and on the working environment. Progress was demonstrated through presentations to the company leadership and to fellow interns, after which comments were collected, prioritised, and incorporated into the next iteration. Several recommendations I made were subsequently adopted, as described in Section 13."),
  ];
}

function buildTeamTable() {
  const rows = [
    ["Team 1", "Platform Foundation and Security", "Auth, roles, permissions, API response format, error handling"],
    ["Team 2", "Super Admin and Org Governance", "Super admin dashboard, organizations management"],
    ["Team 3", "Org Admin and Member Management", "Member CRUD, import/export, bulk actions"],
    ["Team 4", "Event Management and Registration", "Event CRUD, calendar views, attendee management"],
    ["Team 5", "Blog, Announcements, Content", "Post CRUD, draft/publish workflow, filters"],
    ["Team 6", "Payments and Subscriptions (my team)", "Payment transactions, subscription plans, invoices, receipts"],
    ["Team 7", "Member Experience and Integration QA", "Cross-module validation, regression catching, release-readiness"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: ["Team", "Role", "Key Responsibilities"].map(h => th(h)) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => td(c, i === 0)) })),
    ],
  });
}

// --- 7. Internship Activities (3 pages) ---
function buildInternshipActivities() {
  return [
    h1("7. Internship Activities"),
    h2("7.1 My Role and Responsibilities"),
    p("I participated as a frontend specialist with broad cross-cutting responsibilities, working across the feature lifecycle from studying the purpose of a workflow to implementing it, reviewing integration behaviour, testing, presenting, and responding to feedback. I was also designated as the communication person on the interns' side, serving as the primary point of contact between the intern cohort and the company leadership. Additionally, I participated as a prompt engineer and AI engineer on selected tasks, deploying agentic AI systems to perform scoped activities for areas where our group was not yet advanced. I was also tasked with coming up with new recommendation features on the project and on the company's running products. A summary of my key activities and their outcomes is presented in Table 7.1."),
    caption("Table 7.1: Summary of Internship Activities and Outcomes"),
    buildActivitiesTable(),
    h2("7.2 Time Distribution"),
    p("Over the course of the internship, my time was distributed as follows: development 40%, documentation and meetings 30%, testing 10%, research 5%, and support/training/other 15%. Development occupied the largest share, reflecting the depth of frontend and integration work required. Documentation and meetings together accounted for 30%, reflecting the company's strong emphasis on shared contracts, plan documents, checklists, and weekly review sessions."),
    h2("7.3 Main Project: Membership Management System Modernisation"),
    p("The principal team project was the modernisation of a previously existing membership management system owned by Afronex. Our task as a team of interns was to rewrite the system using modern frameworks with additional features requested by the client. For confidentiality, the client name and production URLs cannot be disclosed. The modernisation included the following key updates, several of which were owned or co-owned by Team 6: (1) Fayda ID card integration as a primary identification mechanism for member registration; (2) custom attributes for member profiles, allowing each organisation to define its own fields; (3) Telebirr payment integration for membership fees and subscription renewals; (4) manual payment confirmation and invoice integration for cases where automated verification was unavailable; (5) OTP confirmation for user registration to verify phone number ownership; and (6) OCR-based payment screenshot verification, allowing users to upload a screenshot of their Telebirr or CBE Birr success screen and have the system extract the transaction ID, amount, and date using an OCR library such as Tesseract or EasyOCR. This approach significantly reduced user friction compared with manual entry of long transaction strings."),
    p("Within Team 6, my specific contributions focused on the manual payment confirmation workflow, the invoice and receipt workspace, and the integration of the OCR-based screenshot verification flow. I implemented the frontend interfaces for the manual payment confirmation flow and contributed to the design of payment status normalization rules, ensuring that every payment record regardless of source was represented in a consistent state machine that could be audited end-to-end."),
    h2("7.4 Other Projects Participated"),
    p("Beyond the main team project, I participated in several other initiatives. I contributed to an AI-driven care system built using the Django framework, selected for Python because of its strong AI ecosystem compatibility. My role involved contributing to the system's data flow design and integrating selected AI-driven features; the specific client and domain cannot be disclosed for confidentiality. I also participated in the development of an accounting and inventory subsystem for another of the company's main projects using Odoo (an open-source ERP framework in Python), focusing on adapting existing modules to meet client-specific workflow requirements. Additionally, I developed a personal production-grade project outside company hours: Temariware (a Telegram Mini App for university student job matching), described in Section 10."),
    h2("7.5 Tools and Methodology"),
    p("Tools used included: TypeScript, JavaScript, Python, and SQL for programming; React with TypeScript and Next.js for frontend; Django and Odoo for Python-based backend; PostgreSQL via Prisma ORM for databases; Git and GitHub for version control with structured pull request review; agentic AI systems for code scaffolding and security review; Telegram groups, Zoom meetings, and phone calls for collaboration; and Tesseract/EasyOCR for OCR. The company used an Agile development methodology with iterative development, adaptive planning, cross-functional collaboration, and continuous feedback. The team-allocation structure (seven teams with a strict dependency order) was itself a manifestation of the Agile principle of organising work around autonomous, cross-functional teams."),
  ];
}

function buildActivitiesTable() {
  const rows = [
    ["Frontend Development", "Implemented user-facing behaviour, connected UI to workflow rules, refined screens", "Feature implementations, integration tests"],
    ["Team 6: Payments & Subscriptions", "Owned payment transactions, subscription states, manual payment confirmation, invoices", "Primary task ownership, cross-module integration"],
    ["Prompt Engineering / AI", "Deployed and monitored agentic AI for scoped tasks outside group's expertise", "AI-assisted scaffolding, test generation, security review"],
    ["Communication Lead (Interns)", "Primary contact between interns and company; coordinated cross-team discussions", "Progress presentations, issue escalation"],
    ["Feature Recommendations", "Proposed new features for projects and company products", "Several recommendations adopted (see Section 13)"],
    ["Personal Projects", "Developed Temariware (Telegram Mini App) outside company hours", "Project now live in production"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: ["Area", "My Practical Activities", "Evidence / Outcome"].map(h => th(h)) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => td(c, i === 0, 20)) })),
    ],
  });
}

// --- 8. Technical Skills and Knowledge Utilized (2 pages) ---
function buildTechnicalSkills() {
  return [
    h1("8. Technical Skills and Knowledge Utilized"),
    h2("8.1 Programming Languages and Frameworks"),
    p("During the internship, I worked with several programming languages and frameworks. TypeScript was the primary language for the membership management system modernisation, chosen for its static typing which reduced runtime errors. Python was used for the AI care system (via Django) and the accounting and inventory subsystem (via Odoo), taking advantage of Python's AI ecosystem compatibility. SQL was used for database queries with Prisma ORM abstracting routine SQL. Frameworks used included: React with TypeScript (primary frontend for the modernisation), Next.js (for personal projects), Django (for the AI care system), Odoo (for the accounting subsystem), Tailwind CSS with shadcn/ui (styling), and Prisma ORM (database management)."),
    h2("8.2 Tools, Version Control, and Testing"),
    p("Git and GitHub were used throughout for version control, with structured branching conventions and pull request review documented in the shared developer-prompt.md file. Each feature was developed on a dedicated branch, reviewed by at least one team member, and integrated only after passing the relevant checklist. Other tools included Visual Studio Code as the primary IDE, Postman for API testing, and LibreOffice for documentation. For collaboration, the team used Telegram groups for asynchronous communication, Zoom meetings for synchronous discussions, collaborative folders for AI agent outputs, and phone calls for urgent coordination. Testing included manual verification of payment flows, integration testing across module boundaries (coordinated by Team 7), and acceptance criteria validation before features were considered complete."),
    h2("8.3 Soft Skills"),
    p("Teamwork was the most significant soft skill developed: I learned how to coordinate with cross-functional teams, communicate delays early, and accept that my preferred implementation might not always be the right one. Communication was developed through my role as the company's communication lead, which required translating between technical and non-technical stakeholders. Time management was developed through the company's flexible working culture, which required me to set my own priorities and meet deadlines without rigid supervision. Professional behaviour and workplace ethics were developed through daily interactions: I learned the value of politeness, team spirit, clear communication, and disciplined leadership."),
    h2("8.4 Coursework Connections"),
    p("The internship directly connected to my university coursework at DDU. Table 8.1 maps key courses to their practical applications during the internship, illustrating the strong alignment between the DDU Software Engineering curriculum and professional software development."),
    caption("Table 8.1: Mapping of University Coursework to Internship Applications"),
    buildCourseworkTable(),
    h2("8.5 Certifications and Training"),
    p("There were no formal certifications issued during the internship itself. However, I participated in the Cursor Hackathon held at Haramaya University, which brought together participants from multiple universities. I received a certificate of participation for this event. Beyond the hackathon, training was informal but continuous: weekly supervision meetings, code review feedback, and presentation review sessions all served as ongoing professional development throughout the four months."),
  ];
}

function buildCourseworkTable() {
  const rows = [
    ["Object-Oriented Programming", "Reading and refining existing class diagrams for the payment state machine"],
    ["Object-Oriented System Analysis and Design", "Use case modelling for the manual payment confirmation flow"],
    ["Advanced Software Engineering", "Understanding the seven-team allocation; iterative development with weekly review"],
    ["Fundamentals / Advanced Database Systems", "Payment audit trail design; subscription state machine; status normalization"],
    ["Internet Programming", "React frontend implementation; Next.js API route development; REST API consumption"],
    ["Software Architecture and Design", "Understanding the layered architecture; component and deployment diagrams"],
    ["Software Security", "Payment screenshot handling; OTP confirmation flow; audit trail design"],
    ["Software Engineering Tools and Practices", "Git and GitHub workflow; pull request review; shared markdown documentation"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: ["University Course", "Internship Application"].map(h => th(h)) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => td(c, i === 0, 20)) })),
    ],
  });
}

// --- 9. Collaboration and Teamwork (2 pages) ---
function buildCollaboration() {
  return [
    h1("9. Collaboration and Teamwork"),
    h2("9.1 Team Experience and Collaborative Tools"),
    p("My experience working with the team at Afronex was one of the most formative aspects of the internship. The team comprised classmates from DDU and students from other universities including Haramaya University. We were organised into pairs within each team, with each pair taking ownership of a specific feature based on preference and closeness. This pair-based ownership model allowed us to master our features while being available to help other teams. Collaborative tools used included: Telegram groups for asynchronous communication, GitHub for code hosting and pull request review, collaborative folders for AI agent outputs, physical discussions at the company premises for complex design decisions, phone calls for urgent coordination, and Zoom meetings for synchronous cross-university discussions."),
    h2("9.2 Achievements and Contributions"),
    p("Through the team experience, I gained significant experience in teamwork, solving real-world problems, advancing my use of trending technologies (particularly agentic AI), and following the right software development life cycle from requirements through to production. A specific achievement was my selection, due to my commitment and communication skills, to participate in and contribute to real client-facing projects of the company that are still in development. This opportunity was extended based on the trust I built through my work on the main team project and through my role as the communication lead. I am continuing to collaborate on these projects beyond the formal end of the internship."),
    h2("9.3 Disagreements, Misunderstandings, and Coordination Problems"),
    p("A recurring challenge was that sometimes one of us would try to dominate the team's flow and insist on a single direction, creating disagreements among teammates. We resolved this through discussion, sometimes repeatedly, until we reached a shared understanding. If the disagreement was too far apart to be resolved internally, we would escalate to the company leadership to guide us on the best alternative. Through this process, we learned to value team spirit over individual preference, to separate the person from the technical position, and to make decisions based on evidence and shared contracts rather than on force of personality."),
    h2("9.4 Time Management, Feedback, and Professional Behaviour"),
    p("My approach to time management was to first learn the unfamiliar aspects of a task, then work on the project keeping priority, time management, and punctuality in focus. The company's flexible working culture supported this approach as long as deliverables met agreed deadlines. I was appreciated for my activeness in utilising new technology advancements, particularly AI, and after receiving this feedback I now plan to specialise in AI engineering for my future career. Professional behaviours developed included politeness, team spirit, communication, and team leadership. As the communication lead on the interns' side, I had to coordinate cross-team discussions, facilitate disagreement resolution, and ensure that every team's voice was heard in the broader planning process."),
  ];
}

// --- 10. Project Highlights (2 pages) ---
function buildProjectHighlights() {
  return [
    h1("10. Project Highlights"),
    h2("10.1 Overview"),
    p("During the internship period, I worked on three significant projects: the membership management system modernisation at Afronex (the main company project, described in Section 7 with confidentiality constraints), the AI care system built in Django (described in Section 7.4), and a personal production-grade project built outside company hours: Temariware. The personal project is now live in production and represents the application of internship-learned skills to a problem I am personally passionate about. The company projects cannot be described in full detail due to confidentiality; the personal project is highlighted below."),
    h2("10.2 Personal Project: Temariware"),
    p("Temariware is a Telegram Mini App combined with a Telegram Bot that connects Ethiopian university students with verified tutoring, freelance, part-time, and full-time job opportunities. The problem it addresses is that informal Telegram job channels (such as Afriwork and Yegna Tutors Harrar) post unstructured job ads with no filtering, no archive, no verification, and no payment mechanism. Temariware provides a structured, multilingual platform (English, Amharic, Afaan Oromoo) where students can browse verified jobs, apply with their academic profile including mandatory documents (National ID, University ID, grade report), and pay a confirmation fee through a screenshot-based verification flow. Employers can post jobs with rich metadata, set per-job application fees, review applicant documents in a dedicated panel, and have the platform automatically close positions once hiring targets are met. The bot (@temariwarebot on Telegram) exposes nine slash commands and pushes instant job alerts to subscribers, while the @TEMARIWARE channel automatically receives richly-formatted job cards every time an administrator approves a new posting. The complete stack is built on free-tier infrastructure: Next.js 16 + React 19 + TypeScript + Tailwind CSS + shadcn/ui for the Mini App, Prisma ORM + PostgreSQL on Neon for the database, Vercel for hosting, and Telegram WebApp initData HMAC-SHA256 validation for authentication. Total monthly cost: 0 ETB. The system is live and accepting real users. Temariware is a solo project in which I am the sole developer and architect, and it represents the application of skills and perspectives gained during the internship to a problem I am personally passionate about."),
  ];
}

// --- 11. Learning and Growth (2 pages) ---
function buildLearning() {
  return [
    h1("11. Learning and Growth"),
    h2("11.1 New Skills Acquired"),
    p("During the four-month internship, I acquired a broad range of new skills. Technically, I deepened my proficiency in React and TypeScript, learned the Django and Odoo frameworks for Python-based web development, became familiar with the Telegram Bot API and Mini App framework, and gained practical experience with Prisma ORM and PostgreSQL. I also developed practical skills in AI-assisted engineering: prompt engineering for code scaffolding, agentic AI deployment for scoped tasks, and the use of OCR libraries for payment verification. Methodologically, I learned how an Agile development process works in a professional environment: iterative development with weekly review, shared contracts across teams, dependency-ordered team allocation, and structured pull request review. Professionally, I developed communication skills through my role as the company's communication lead, leadership skills through coordinating cross-team discussions, and time management skills through the company's flexible working culture."),
    h2("11.2 The Shift from Code Correctness to Business Logic Thinking"),
    p("The most significant intellectual growth during the internship was a shift in my mindset from asking \u201Cis the system running without errors?\u201D to asking \u201Chow can I generate income or build the business logic behind each feature of the project?\u201D Working for the business logic behind each feature required the most guidance for me. I focused on \u201Cis the system running with no error?\u201D but not on \u201Chow can I generate income or build the business logic behind each feature?\u201D After the guidance I received from Mr. Tsegaw and the senior developers, I am now somewhat business-minded while coding, and I evaluate technical decisions not only for their correctness but also for their contribution to the business. This shift is, in my view, the single most valuable learning outcome of the internship."),
    h2("11.3 Independent Ability Demonstrated"),
    p("Three tasks best demonstrate my independent ability. First, researching and advancing features: when I encountered an unfamiliar feature area, I would independently research the available options, propose an implementation approach, and advance the feature through review. Second, developing and monitoring agentic AI to perform specific tasks: I deployed AI agents for scoped activities such as code scaffolding and security review, monitored their output, and integrated validated results into the team's work. Third, checking for security issues like confidentiality: I developed a habit of reviewing sensitive flows, particularly around payment handling and member data, for potential confidentiality breaches and proposing mitigations."),
    h2("11.4 Hackathon Participation and Continuous Learning"),
    p("I participated in the Cursor Hackathon held at Haramaya University, which brought together participants from multiple universities. I received a certificate of participation (see Appendix B). The hackathon reinforced lessons from the internship: the value of clear communication under time pressure, the importance of prioritising features that deliver value quickly, and the satisfaction of building something that works end-to-end within a constrained timeframe. Beyond the hackathon, learning was continuous through weekly supervision meetings, code review feedback, and self-directed learning in agentic AI patterns, which directly informed my personal projects."),
  ];
}

// --- 12. Challenges Faced and Solutions (2 pages) ---
function buildChallenges() {
  return [
    h1("12. Challenges Faced and Solutions"),
    h2("12.1 Main Difficulties Encountered"),
    p("The most significant technical challenge was working with frameworks that the company wanted, as I had previous experience with different frameworks for the same problem domain. My personal preference for Django (because of Python's AI ecosystem compatibility) sometimes conflicted with the company's preference for React and TypeScript. Bridging this gap required investing additional time in learning the company's preferred stack to a production-ready level, while preserving my Django expertise for personal projects where it was the right tool. Other technical challenges included: understanding large existing codebases with limited documentation; integrating features across module boundaries when shared contracts were still in flux; debugging issues spanning frontend, backend, and database layers; and handling the inherent uncertainty of AI agent outputs when using them for code scaffolding and security review."),
    p("On the professional side, the most significant challenge was the shift from a purely technical mindset to a business-aware mindset. Additional challenges included managing communication across cross-functional teams with different working styles, handling disagreements constructively without dominating the discussion, and balancing the depth of feature ownership with the breadth of cross-team awareness required for effective integration."),
    h2("12.2 How I Overcame Them and What I Learned"),
    p("I overcame these challenges through self-directed learning, structured mentorship, and disciplined practice. When I encountered an unfamiliar framework, I trained myself using resources shared by the company. I made a habit of reading the existing codebase before writing any new code. When I encountered integration challenges, I escalated with a clear description of the problem and the options I had already considered, which allowed senior developers to provide targeted guidance. For AI agent outputs, I developed a validation pipeline: every AI-generated artefact was reviewed by a human team member, checked against project conventions, and only integrated after passing both automated and manual review."),
    p("The challenges taught me several durable lessons: the right framework depends on the project context, not on developer preference; integration is the hardest part of multi-team development; business awareness is not optional for a software engineer; AI agents are powerful tools but not a substitute for engineering judgement; and communication is a first-class engineering skill. An additional risk-management decision was choosing to remain in Dire Dawa and join Afronex rather than travelling to Addis Ababa as the school advised; in retrospect, this decision was correct given the quality of mentorship and project work at Afronex."),
  ];
}

// --- 13. Contribution to the Organization (1.5 pages) ---
function buildContribution() {
  return [
    h1("13. Contribution to the Organization"),
    h2("13.1 Recommended Features Now in Use"),
    p("Several recommended features I proposed during the internship, both on the projects we were working on and on the way the company acts, are now in use by the organisation. These recommendations ranged from specific feature ideas for the membership management system to broader suggestions for how the company could integrate AI more deeply into its development workflow. The fact that these recommendations were adopted and are now being tested for production validates the value of the internship programme not only as a learning experience for the intern but also as a source of fresh perspectives for the host company. Specific examples, while kept general for confidentiality, include improvements to the manual payment confirmation workflow that reduced review time, refinements to the OCR-based screenshot verification pipeline that improved extraction accuracy, and suggestions for how agentic AI could be deployed for selected development activities while preserving human oversight."),
    h2("13.2 Production-Ready Code and Deliverables"),
    p("The code I wrote during the internship, particularly within Team 6 (Payments and Subscriptions), is now being tested by the company for production deployment. Deliverables included: the frontend implementation of the manual payment confirmation workflow; the integration code for the OCR-based screenshot verification pipeline; the design and implementation of payment status normalization rules; documentation of the payment audit trail; and plan and checklist documents reusable by future interns. The code followed the company's established conventions for branching, review, and integration, and it passed the acceptance criteria defined by Team 7 during the integration phase. For my commitment and communication, I was given the opportunity to participate in real client-facing projects that are still in development, and I am continuing to collaborate on these beyond the formal end of the internship, which represents an extension of the trust the company placed in me based on my performance."),
  ];
}

// --- 14. Conclusion & Recommendations (2 pages) ---
function buildConclusion() {
  return [
    h1("14. Conclusion & Recommendations"),
    h2("14.1 Summary of Overall Experience"),
    p("The four-month internship at Afronex Tech Company was a transformative experience that bridged the gap between my academic training at DDU and the practical demands of professional software engineering. I worked on a real client-facing project (the membership management system modernisation), contributed to additional company projects (an AI care system in Django and an accounting subsystem in Odoo), developed a personal production-grade project (Temariware), participated in a hackathon at Haramaya University, and built durable professional relationships. The most significant learning outcomes were: the shift from a purely technical mindset to a business-aware mindset; the development of communication and leadership skills; practical experience of working within an Agile, multi-team development process; and the confidence that comes from having one's code tested for production deployment."),
    h2("14.2 Suggestions for Improving Future Internship Programmes"),
    p("Based on my experience, I offer the following suggestions. First, the university could provide more structured guidance on company selection, including a curated list of partner companies with documented track records. Second, a formal feedback loop between interns and host companies could be established, collecting mid-internship and end-of-internship feedback from both sides. Third, the host company could formalise the onboarding process by providing a written guide to conventions, tools, and expectations on the first day. Fourth, both the university and the host company could provide more structured opportunities for cross-cohort networking, so that interns can learn from the experiences of those who came before them."),
    h2("14.3 Recommendations for Future Interns"),
    p("For future interns, I recommend: (1) do not wait to be told what to do \u2014 take ownership of your learning from day one; (2) balance depth with breadth \u2014 master the features you own but also understand how they connect to the broader system; (3) cultivate a business-aware mindset from the beginning \u2014 ask why each feature matters, not just how to implement it; (4) embrace AI as a tool but do not abdicate engineering judgement to it; (5) communicate proactively \u2014 if you are stuck, say so early; if you see a problem, raise it with a proposed solution; (6) document your work as if a future intern will need to understand it without your help."),
    h2("14.4 How This Internship Will Impact My Future Career"),
    p("I had very important communication with the company and with others, and I gained practical experience of working in teams on real-world problems. I am sure that something interesting is coming in the future. The internship has shaped my career direction in three ways: it has confirmed my interest in AI engineering, which I now plan to pursue as my primary specialisation; it has given me the confidence that I can build production-grade software from scratch; and it has given me a professional network that I will continue to draw on. In the immediate term, I plan to continue my collaboration with Afronex on the client-facing projects I am currently contributing to, while further developing my personal projects and exploring deeper AI integrations. In the long term, I aspire to build a technology company of my own in Ethiopia, applying the lessons learned at Afronex about combining technical depth, business awareness, and a culture of mentorship."),
  ];
}

// --- 15. References (1 page, ~15 entries) ---
function buildReferences() {
  return [
    h1("15. References"),
    p("[1]  Afronex Tech Company. (2018 E.C). Internal Developer Documentation: Membership Management System Modernisation. [Internal document, generalised for confidentiality]."),
    p("[2]  Afronex Tech Company. (2018 E.C). Team Allocation and Ownership Matrix. [Internal document: team-allocation-7-teams.md]."),
    p("[3]  Afronex Tech Company. (2018 E.C). Developer Prompt: Shared Conventions and Standards. [Internal document: developer-prompt.md]."),
    p("[4]  Dire Dawa University. (2024). Project Guideline for Industrial Project. Department of Information Technology, School of Computing."),
    p("[5]  Telegram. (2024). Telegram Bot API Documentation. [Online]. Available: https://core.telegram.org/bots/api."),
    p("[6]  Telegram. (2024). Telegram Mini Apps \u2014 Web Apps. [Online]. Available: https://core.telegram.org/bots/webapps."),
    p("[7]  Vercel Inc. (2024). Next.js 16 Documentation. [Online]. Available: https://nextjs.org/docs."),
    p("[8]  Prisma. (2024). Prisma ORM Documentation. [Online]. Available: https://www.prisma.io/docs."),
    p("[9]  Django Software Foundation. (2024). Django Documentation. [Online]. Available: https://docs.djangoproject.com."),
    p("[10] Odoo S.A. (2024). Odoo Documentation. [Online]. Available: https://www.odoo.com/documentation."),
    p("[11] React. (2024). React 19 Documentation. [Online]. Available: https://react.dev."),
    p("[12] Microsoft. (2024). TypeScript Handbook. [Online]. Available: https://www.typescriptlang.org/docs/handbook."),
    p("[13] Smith, T. (2023). Tesseract OCR: Open Source Optical Character Recognition. [Online]. Available: https://github.com/tesseract-ocr/tesseract."),
    p("[14] Pressman, R. S. (2014). Software Engineering: A Practitioner's Approach (8th ed.). McGraw-Hill, New York."),
    p("[15] Beck, K. et al. (2001). Manifesto for Agile Software Development. [Online]. Available: https://agilemanifesto.org."),
  ];
}

// --- 16. Appendices (2 pages) ---
function buildAppendices() {
  return [
    h1("16. Appendices"),
    h2("Appendix A: Weekly Log Summary"),
    p("This appendix summarises the weekly activities during the four-month internship period. A detailed daily log is available separately as a supplementary document."),
    caption("Table A.1: Weekly Activity Log Summary"),
    buildWeeklyLogTable(),
    h2("Appendix B: Certificate of Participation"),
    p("This appendix contains the certificate of participation awarded for the Cursor Hackathon held at Haramaya University during the internship period. The certificate recognises participation in the competitive software development event alongside students from multiple universities across Ethiopia."),
    p("[Insert certificate image here \u2014 the certificate is a scanned document that should be embedded at this location in the final printed report.]"),
  ];
}

function buildWeeklyLogTable() {
  const rows = [
    ["Month 1 (Sene 2018 EC)", "Onboarding, reading shared documentation, joining Team 6, first feature assignments, learning React + TypeScript conventions"],
    ["Month 2 (Hamle 2018 EC)", "Manual payment confirmation workflow implementation, invoice and receipt workspace, first cross-team integration"],
    ["Month 3 (Nehase 2018 EC)", "OCR-based screenshot verification pipeline, payment status normalization, Cursor Hackathon participation at Haramaya University"],
    ["Month 4 (Meskerem 2019 EC)", "Integration testing with Team 7, presentation preparation, documentation handover, ongoing client project collaboration"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: ["Period", "Key Activities and Milestones"].map(h => th(h)) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => td(c, i === 0, 22)) })),
    ],
  });
}

// =====================================================================
// TABLE CELL HELPERS
// =====================================================================
function th(text) {
  return new TableCell({
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: LINE_10 }, children: [tr(text, { bold: true, size: 20 })] })],
  });
}

function td(text, bold = false, size = 22) {
  return new TableCell({
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [new Paragraph({ alignment: bold ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: LINE_10 }, children: [tr(text, { size, bold })] })],
  });
}

// =====================================================================
// HEADERS & FOOTERS
// =====================================================================
const REPORT_TITLE = "Software Engineering Internship Report \u2014 Nebiyu Tsegaye (ID 1501332)";

function buildHeader(text) {
  return new Header({ children: [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { line: LINE_10 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 4 } },
      children: [new TextRun({ text, font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: 20, color: "333333", italics: true })],
    }),
  ]});
}

function buildFooter() {
  return new Footer({ children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT, spacing: { line: LINE_10 },
      children: [new TextRun({ children: [PageNumber.CURRENT], font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: 20 })],
    }),
  ]});
}

function emptyHeader() { return new Header({ children: [new Paragraph({ children: [] })] }); }
function emptyFooter() { return new Footer({ children: [new Paragraph({ children: [] })] }); }

// =====================================================================
// MAIN ASSEMBLY
// =====================================================================

const doc = new Document({
  creator: "Nebiyu Tsegaye",
  title: "Software Engineering Internship Report",
  description: "Internship report submitted to the Department of Software Engineering, Dire Dawa University.",
  styles: {
    default: {
      document: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_BODY, color: "000000" },
        paragraph: { spacing: { line: LINE_15 } },
      },
      heading1: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_H1, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 240, line: LINE_15 } },
      },
      heading2: {
        run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: SIZE_H2, bold: true, color: "000000" },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 240, after: 120, line: LINE_15 } },
      },
    },
  },
  sections: [
    // SECTION 1: COVER — no header/footer/page number
    {
      properties: { page: { size: { width: PG_W, height: PG_H }, margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      headers: { default: emptyHeader() }, footers: { default: emptyFooter() },
      children: buildCover(),
    },
    // SECTION 2: FRONT MATTER — Roman numerals from i
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PG_W, height: PG_H },
          margin: { top: M_TOP, bottom: M_BOT, left: M_LEFT, right: M_RIGHT, header: 720, footer: 720 },
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
        },
      },
      headers: { default: buildHeader(REPORT_TITLE) }, footers: { default: buildFooter() },
      children: [
        ...buildAcknowledgment(),
        ...buildAcronyms(),
        ...buildTOC(),
      ],
    },
    // SECTION 3: BODY — Arabic from 1
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PG_W, height: PG_H },
          margin: { top: M_TOP, bottom: M_BOT, left: M_LEFT, right: M_RIGHT, header: 720, footer: 720 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: buildHeader(REPORT_TITLE) }, footers: { default: buildFooter() },
      children: [
        ...buildIntroduction(),
        ...buildCompanyBackground(),
        ...buildInternshipActivities(),
        ...buildTechnicalSkills(),
        ...buildCollaboration(),
        ...buildProjectHighlights(),
        ...buildLearning(),
        ...buildChallenges(),
        ...buildContribution(),
        ...buildConclusion(),
      ],
    },
    // SECTION 4: REFERENCES & APPENDICES — Arabic continued
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PG_W, height: PG_H },
          margin: { top: M_TOP, bottom: M_BOT, left: M_LEFT, right: M_RIGHT, header: 720, footer: 720 },
          pageNumbers: { formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: buildHeader(REPORT_TITLE) }, footers: { default: buildFooter() },
      children: [
        ...buildReferences(),
        ...buildAppendices(),
      ],
    },
  ],
});

const OUTPUT = "/home/z/my-project/download/Internship_Report_Nebiyu_Tsegaye.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  const stats = fs.statSync(OUTPUT);
  console.log(`\u2713 Document generated: ${OUTPUT}`);
  console.log(`  Size: ${(stats.size / 1024).toFixed(1)} KB`);
}).catch(err => { console.error("\u2717 Generation failed:", err); process.exit(1); });
