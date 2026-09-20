// Internship Report — Chapter 3 (Internship Activities) + Chapter 4 (Technical Skills)

const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak, ShadingType,
} = require("docx");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  FONT, SIZE_BODY, LINE_SPACING_15,
} = require("./generate-project-doc.js");

// =====================================================================
// CHAPTER 3: INTERNSHIP ACTIVITIES
// =====================================================================

function buildChapter3() {
  return [
    h1("Chapter Three: Internship Activities"),

    h2("3.1 My Role and Responsibilities"),
    body(
      "During the four-month internship at Afronex, I participated as a frontend specialist with broad cross-cutting responsibilities. My role was not confined to a single layer of the system: I worked across the feature lifecycle, from studying the purpose of a workflow to implementing it, reviewing its integration behaviour, testing it, presenting it to the company, and responding to feedback. I was also designated as the communication person on the interns' side, which meant I served as the primary point of contact between the intern cohort and the company leadership, coordinated cross-team discussions, and prepared general presentations to show progress and achievements.",
    ),
    body(
      "In addition to my frontend and communication responsibilities, I actively participated as a prompt engineer and AI engineer on selected tasks, deploying agentic AI systems to perform specific, scoped activities for areas where our group was not yet advanced. This included using AI agents to scaffold unfamiliar code, generate test cases, and review security-sensitive flows. I was also tasked with coming up with new recommendation features and functionalities on the project we were working on and on the company's real-time running products, to help them fit new and trending technology advancements and demands. A summary of my key activities and their outcomes is presented in Table 3.1 below.",
    ),
    caption("Table 3.1: Summary of Internship Activities and Outcomes"),
    buildActivitiesTable(),

    h2("3.2 Time Distribution Across Activity Categories"),
    body(
      "Over the course of the internship, my time was distributed across several categories of activity. The approximate breakdown is presented in Table 3.2 below. Development occupied the largest share at forty percent, reflecting the depth of frontend and integration work required by the membership management system modernisation. Documentation and meetings together accounted for thirty percent, reflecting the strong emphasis the company placed on shared contracts, plan documents, checklists, and weekly review sessions.",
    ),
    caption("Table 3.2: Approximate Time Distribution by Activity Category"),
    buildTimeDistributionTable(),

    h2("3.3 Main Project: Membership Management System Modernisation"),
    body(
      "The principal team project during the internship was the modernisation of a previously existing membership management system owned by Afronex. The existing system had been built on an earlier technology stack and had accumulated technical debt that limited its extensibility. Our task as a team of interns was to rewrite the system using modern frameworks, with additional features requested by the client. For confidentiality reasons, the client name, exact identifiers, and production URLs cannot be disclosed in this report; the description below focuses on the technical scope and the features that were added.",
    ),
    body(
      "The modernisation effort was divided across the seven teams described in Table 2.1 of Chapter 2. Each team owned a specific horizontal capability, owned the plan and checklist documents for that capability, and depended on shared contracts defined by Team 1. My assignment was Team 6: Payments and Subscriptions, whose responsibilities included payment transactions, subscription plans and billing state, manual payment and transfer recording, invoices and receipts, and payment status normalization and auditability.",
    ),

    h3("3.3.1 Updates Implemented"),
    body("The modernisation of the membership management system included the following key updates, several of which were owned or co-owned by Team 6:"),
    body("\u2022  Fayda ID card integration \u2014 the Ethiopian national digital ID was added as a primary identification mechanism for member registration, replacing or supplementing the existing manual ID collection process."),
    body("\u2022  Custom attributes for member \u2014 the member data model was extended to support organisation-specific custom attributes, allowing each organisation using the system to define its own member profile fields without modifying the core schema."),
    body("\u2022  Telebirr payment integration \u2014 the national mobile payment service Telebirr was integrated as a primary payment channel for membership fees and subscription renewals, with transaction records linked to member accounts and subscription states."),
    body("\u2022  Manual payment confirmation and invoice integration \u2014 a manual payment confirmation workflow was added for cases in which automated payment verification was not available (for example, bank transfers or in-person cash payments), with associated invoice and receipt generation."),
    body("\u2022  OTP confirmation for user registration \u2014 a one-time password mechanism was added to the user registration flow to verify phone number ownership and reduce fraudulent account creation."),
    body("\u2022  OCR-based payment screenshot verification \u2014 a payment verification method based on optical character recognition was added, allowing users to upload a screenshot of their Telebirr or CBE Birr success screen and have the system extract the transaction ID, amount, and date using an OCR library. This approach significantly reduced user friction compared with manual entry of long transaction strings."),

    h3("3.3.2 My Specific Contributions Within Team 6"),
    body(
      "Within Team 6, my specific contributions focused on the manual payment confirmation workflow, the invoice and receipt workspace, and the integration of the OCR-based screenshot verification method. I implemented the frontend interfaces for the manual payment confirmation flow, including the form for recording manual transfers and the dashboard for reviewing pending confirmations. I also contributed to the design of the payment status normalization rules, which ensured that every payment record, regardless of its source (Telebirr, manual transfer, or OCR-verified screenshot), was represented in a consistent state machine that could be audited end-to-end.",
    ),
    body(
      "A particular area of independent contribution was the OCR-based payment screenshot verification flow. The user-facing concept was simple: instead of asking users to type long transaction IDs, they would upload a screenshot of their Telebirr or CBE Birr success screen, and an OCR library (such as Tesseract or EasyOCR) would extract the transaction ID, amount, and date from the image. This approach had very low friction for the user, but it required careful design on the backend side: the OCR output had to be validated against expected formats, the extracted transaction had to be checked for uniqueness to prevent double-processing, and the screenshot itself had to be retained as an audit trail for the manual confirmation step. I worked on the integration of this flow with the manual payment confirmation workspace owned by Team 6.",
    ),

    h2("3.4 Personal Project Participation"),
    body(
      "Beyond the main team project, I participated in several other initiatives at Afronex, including personal projects and side contributions. These projects were either personal in nature (built outside the company's main client work) or represented additional contributions to the company's broader product portfolio. To preserve confidentiality, project names have been generalised where appropriate.",
    ),

    h3("3.4.1 AI Care System (Django)"),
    body(
      "I participated in the development of an AI-driven care system built using the Django framework. This project was selected for Python because of its strong AI ecosystem compatibility, which aligned with my personal interest in artificial intelligence. My role involved contributing to the system's data flow design and integrating selected AI-driven features. The specific client and the precise nature of the care domain cannot be disclosed in this report due to confidentiality constraints; the description here is intentionally generalised.",
    ),

    h3("3.4.2 Accounting and Inventory Subsystem (Odoo)"),
    body(
      "I also participated in the development of an accounting and inventory subsystem for another of the company's main projects, using Odoo as the primary framework. Odoo is an open-source ERP framework written in Python that provides a modular structure for business applications. My contribution focused on adapting the existing accounting and inventory modules to meet the client's specific workflow requirements, including custom report generation and integration with the broader system's payment records.",
    ),

    h3("3.4.3 Personal Projects: Temariware and Azmera"),
    body(
      "Outside of the company's client work, I developed two personal production-grade projects that are now live. These projects are described in detail in Chapter 6 (Project Highlights). Temariware is a Telegram Mini App for university student job matching, built on Next.js, React, Prisma, and Neon Postgres. Azmera is a full-stack agricultural marketplace platform for the Ethiopian market, built on Next.js 15, Prisma, NextAuth, Chapa, and Google Genkit AI. Both projects were inspired by the skills and perspectives I gained during the internship and represent my commitment to building production-grade software for the Ethiopian context.",
    ),

    h2("3.5 Tools, Programming Languages, and Frameworks Used"),
    body("The following tools, languages, and frameworks were used during the internship:"),
    body("\u2022  Programming Languages: TypeScript, JavaScript, Python (for Django and Odoo work), SQL (for database queries and schema management)."),
    body("\u2022  Frontend Frameworks: React with TypeScript, Next.js (for personal projects), Tailwind CSS, shadcn/ui component library."),
    body("\u2022  Backend Frameworks: Django (Python) for the AI care system, Odoo (Python) for the accounting and inventory subsystem, Next.js API routes (TypeScript) for personal projects."),
    body("\u2022  Database: PostgreSQL via Prisma ORM (for personal projects and selected company work), SQLite for local development."),
    body("\u2022  Version Control: Git and GitHub, with structured branching and pull request review conventions documented in shared markdown files."),
    body("\u2022  AI Tools: Agentic AI systems for code scaffolding, test case generation, and security review (specific tools generalised for confidentiality)."),
    body("\u2022  Collaboration: Telegram groups for team communication, GitHub for code review and issue tracking, collaborative folders for AI agent outputs, phone calls and Zoom meetings for synchronous discussion."),
    body("\u2022  OCR Libraries: Tesseract and EasyOCR (considered for the payment screenshot verification feature)."),
    body("\u2022  Other Tools: Visual Studio Code as the primary IDE, Postman for API testing, LibreOffice for documentation."),

    h2("3.6 Methodology: Agile Approach"),
    body(
      "The company used an Agile development methodology for the membership management system modernisation. The Agile approach was chosen because the project requirements evolved as the client provided feedback on early iterations, and a traditional waterfall approach would have locked in decisions too early. Work was organised into sprints aligned with feature ownership: each team owned a set of features and was responsible for delivering them within an agreed timeline, with integration and review happening at the end of each sprint.",
    ),
    body(
      "Specifically, the Agile approach manifested in the following practices: iterative development with frequent demonstrations to the company and to fellow interns; adaptive planning in which the delivery roadmap was updated based on integration findings; cross-functional collaboration in which teams depended on shared contracts but owned their own implementation; and continuous feedback in which presentation comments were collected, prioritised, and incorporated into the next iteration. The team-allocation structure described in Chapter 2 (seven teams with a strict dependency order) was itself a manifestation of the Agile principle of organising work around autonomous, cross-functional teams.",
    ),

    h2("3.7 Examples of Problems Solved"),
    body(
      "Several concrete problems were solved during the internship, three of which are highlighted here as representative examples. First, the payment status normalization problem: payments arrived from multiple sources (Telebirr, manual transfer, OCR-verified screenshot), each with its own data shape and verification status. The solution was a unified state machine that mapped every payment source to a common status set (PENDING, APPROVED, REJECTED) with an audit trail that recorded who reviewed each payment and when. This state machine is now used consistently across the system.",
    ),
    body(
      "Second, the member custom attributes problem: different organisations using the membership management system needed different member profile fields, but the core schema could not be modified per organisation. The solution was a custom attributes mechanism that allowed each organisation to define its own fields through a configuration interface, with the values stored in a flexible key-value structure linked to the member record. This avoided schema proliferation while preserving type safety in the frontend forms.",
    ),
    body(
      "Third, the OCR accuracy problem: the OCR-based payment screenshot verification flow initially produced inconsistent results due to variations in screenshot quality, layout, and language. The solution was a multi-step validation pipeline: the OCR output was parsed for the expected fields (transaction ID, amount, date) using regular expressions tuned to Telebirr and CBE Birr formats, the extracted values were validated for uniqueness against existing payment records to prevent double-processing, and any uncertain extraction was routed to the manual confirmation workspace for human review. This combination of automated extraction and human fallback achieved an acceptable balance between user friction and verification reliability.",
    ),
  ];
}

// Helper: Activities table
function buildActivitiesTable() {
  const rows = [
    ["Frontend Development", "Implemented user-facing behaviour, connected UI to workflow rules, refined existing screens", "Feature implementations, integration tests, demonstrations"],
    ["Team 6 (Payments & Subscriptions)", "Owned payment transactions, subscription states, manual payment confirmation, invoices and receipts, payment status normalization", "Primary task ownership and cross-module integration"],
    ["Prompt Engineering / AI Engineering", "Deployed and monitored agentic AI systems to perform scoped tasks outside our group's primary expertise", "AI-assisted scaffolding, test case generation, security review"],
    ["Communication Lead (Interns' Side)", "Served as primary contact between interns and company leadership; coordinated cross-team discussions", "Progress presentations, issue escalation, cross-team coordination"],
    ["Feature Recommendations", "Proposed new features for the project we were working on and for the company's running products", "Several recommendations adopted by the company (see Chapter 9)"],
    ["Personal Projects", "Developed Temariware (Telegram Mini App) and Azmera (Agricultural Marketplace) outside company hours", "Both projects now live in production"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Area", "My Practical Activities", "Evidence / Outcome"].map((h) =>
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240 }, children: [textRun(h, { bold: true, size: 20 })] })],
          }),
        ),
      }),
      ...rows.map((r) => new TableRow({
        cantSplit: true,
        children: r.map((cell, i) =>
          new TableCell({
            margins: { top: 50, bottom: 50, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 20, bold: i === 0 })] })],
          }),
        ),
      })),
    ],
  });
}

// Helper: Time distribution table
function buildTimeDistributionTable() {
  const rows = [
    ["Development", "40%", "Frontend implementation, integration, code review participation"],
    ["Documentation and Meetings", "30%", "Plan documents, checklists, weekly supervision meetings, progress presentations"],
    ["Testing", "10%", "Unit tests, integration tests, manual verification of payment flows"],
    ["Research", "5%", "Exploring OCR libraries, AI agent capabilities, framework documentation"],
    ["Support, Training, Other", "15%", "Helping other teams, onboarding new interns, miscellaneous tasks"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Category", "Approx. %", "Description"].map((h) =>
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240 }, children: [textRun(h, { bold: true, size: 22 })] })],
          }),
        ),
      }),
      ...rows.map((r) => new TableRow({
        cantSplit: true,
        children: r.map((cell, i) =>
          new TableCell({
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ alignment: i === 1 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 22, bold: i === 0 })] })],
          }),
        ),
      })),
    ],
  });
}

// =====================================================================
// CHAPTER 4: TECHNICAL SKILLS AND KNOWLEDGE UTILIZED
// =====================================================================

function buildChapter4() {
  return [
    h1("Chapter Four: Technical Skills and Knowledge Utilized"),

    h2("4.1 Programming Languages"),
    body(
      "During the internship, I worked with several programming languages, each selected for a specific project context. TypeScript was the primary language for the membership management system modernisation and for my personal projects (Temariware and Azmera), chosen for its static typing which significantly reduced runtime errors in large codebases. JavaScript was used where TypeScript was not strictly required, particularly in legacy parts of the codebase. Python was used for the AI care system (via the Django framework) and for the accounting and inventory subsystem (via the Odoo framework), taking advantage of Python's strong AI ecosystem and the maturity of these frameworks for business application development. SQL was used for database queries, schema management, and data migration scripts, with Prisma ORM abstracting most of the routine SQL for TypeScript-based projects.",
    ),

    h2("4.2 Frameworks"),
    body("The following frameworks were used during the internship, each chosen for a specific reason:"),
    body("\u2022  React with TypeScript \u2014 the primary frontend framework for the membership management system modernisation, selected for its component-based architecture, strong ecosystem, and the company team's existing expertise."),
    body("\u2022  Next.js (App Router) \u2014 used for my personal projects (Temariware and Azmera) for its server-side rendering, API routes, and integrated deployment story on Vercel."),
    body("\u2022  Django \u2014 the Python web framework used for the AI care system, selected for its batteries-included approach and Python's compatibility with the AI ecosystem."),
    body("\u2022  Odoo \u2014 the open-source ERP framework used for the accounting and inventory subsystem, selected for its modularity and built-in business application patterns."),
    body("\u2022  Tailwind CSS with shadcn/ui \u2014 the styling approach used for all frontend work, providing a consistent visual design system with minimal custom CSS."),
    body("\u2022  Prisma ORM \u2014 the object-relational mapper used for TypeScript-based projects, providing type-safe database queries and schema migration management."),

    h2("4.3 Tools and Version Control"),
    body(
      "Git and GitHub were used throughout the internship for version control, with structured branching conventions and pull request review documented in the shared developer-prompt.md file. Each feature was developed on a dedicated branch, reviewed by at least one team member before merging, and integrated into the main branch only after passing the relevant checklist. This process taught me the discipline of writing clean commit messages, keeping pull requests small and focused, and responding constructively to review feedback.",
    ),
    body(
      "Other tools used included Visual Studio Code as the primary integrated development environment, Postman for API testing during development, and LibreOffice for documentation. For collaboration, the team used Telegram groups for asynchronous communication, Zoom meetings for synchronous discussions, collaborative folders for sharing AI agent outputs, and phone calls for urgent coordination. The combination of asynchronous and synchronous channels ensured that communication flowed smoothly across teams that were sometimes working on different schedules.",
    ),

    h2("4.4 Testing"),
    body(
      "Testing was an integral part of the development process at Afronex, although the depth of testing varied by project. For the membership management system modernisation, testing included manual verification of payment flows, integration testing across module boundaries (coordinated by Team 7), and acceptance criteria validation before features were considered complete. For my personal projects, I implemented more structured testing using the React Testing Library for component tests and end-to-end smoke tests for critical flows such as job posting and application submission. The testing experience reinforced my appreciation for the cost of catching defects early: a bug found during integration testing was typically ten times more expensive to fix than the same bug caught during local development.",
    ),

    h2("4.5 Soft Skills"),
    body(
      "Beyond technical skills, the internship developed several soft skills that I consider equally important for a software engineering career. Teamwork was the most significant: I learned how to coordinate with cross-functional teams, how to communicate delays early, and how to accept that my preferred implementation might not always be the right one for the broader system. Communication was developed through my role as the company's communication lead on the interns' side, which required me to translate between technical and non-technical stakeholders, prepare progress presentations, and facilitate cross-team discussions.",
    ),
    body(
      "Time management was developed through the company's flexible working culture, which required me to set my own priorities and meet project deadlines without rigid daily supervision. I learned to manage my time by first learning the unfamiliar aspects of a task, then implementing the task while keeping priority, time management, and punctuality in focus. Professional behaviour and workplace ethics were developed through daily interactions with the company leadership, senior developers, and fellow interns: I learned the value of politeness, team spirit, clear communication, and disciplined leadership.",
    ),

    h2("4.6 Coursework Connections"),
    body(
      "The internship directly connected to my university coursework at Dire Dawa University. Table 4.1 below maps the courses I completed during my first three years of study to the practical situations in which I applied them during the internship. This mapping illustrates the strong alignment between the DDU Software Engineering curriculum and the practical demands of professional software development.",
    ),
    caption("Table 4.1: Mapping of University Coursework to Internship Applications"),
    buildCourseworkTable(),

    h2("4.7 Certifications and Training"),
    body(
      "There were no formal certifications issued during the internship itself. However, I participated in the Cursor Hackathon held at Haramaya University, which brought together participants from multiple universities across Ethiopia. The hackathon provided an opportunity to apply my software engineering skills in a competitive, time-boxed environment and to network with peers from other institutions. I received a certificate of participation for this event, which is included in the appendices. Beyond the hackathon, the training I received was informal but continuous: weekly supervision meetings, code review feedback, and presentation review sessions all served as ongoing professional development throughout the four months.",
    ),
  ];
}

// Helper: Coursework mapping table
function buildCourseworkTable() {
  const rows = [
    ["Object-Oriented Programming", "Reading and refining existing class diagrams; proposing new classes for the payment status state machine"],
    ["Object-Oriented System Analysis and Design", "Use case modelling for the manual payment confirmation flow; CRC cards for the Payment and Application classes"],
    ["Advanced Software Engineering", "Understanding the seven-team allocation structure; participating in iterative development with weekly review"],
    ["Fundamentals of Database Systems", "Designing the payment audit trail; working with the Prisma schema for personal projects"],
    ["Advanced Database Systems", "Subscription state machine design; payment status normalization across multiple payment sources"],
    ["Internet Programming", "React frontend implementation; Next.js API route development; REST API consumption"],
    ["Software Architecture and Design", "Understanding the layered architecture; component and deployment diagrams for personal projects"],
    ["Software Security", "Payment screenshot handling; OTP confirmation flow; manual payment confirmation audit trail"],
    ["Software Engineering Tools and Practices", "Git and GitHub workflow; pull request review; shared markdown documentation"],
    ["Software Requirements Engineering", "Interpreting client requirements; translating them into plan and checklist documents"],
    ["Data Structures and Algorithms", "OCR output validation pipeline; payment uniqueness checking; subscription state transitions"],
    ["Mobile Application Development", "Telegram Mini App development for Temariware (responsive design, touch targets)"],
    ["Computer Networks", "Understanding webhook mechanics; HTTPS communication between Vercel, Neon, and Telegram"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["University Course", "Internship Application"].map((h) =>
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240 }, children: [textRun(h, { bold: true, size: 20 })] })],
          }),
        ),
      }),
      ...rows.map((r) => new TableRow({
        cantSplit: true,
        children: r.map((cell, i) =>
          new TableCell({
            margins: { top: 50, bottom: 50, left: 100, right: 100 },
            children: [new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 20, bold: i === 0 })] })],
          }),
        ),
      })),
    ],
  });
}

module.exports = { buildChapter3, buildChapter4 };
