// Temariware — Chapter content (Chapter 1, 2, 3)
// Each chapter is a function returning an array of Paragraphs/Tables.

const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak,
} = require("docx");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  figure, figureWithCaption,
  FONT, SIZE_BODY, LINE_SPACING_15,
} = require("./generate-project-doc.js");

// =====================================================================
// CHAPTER ONE: INTRODUCTION / BACKGROUND
// =====================================================================

function buildChapter1() {
  return [
    // ===== H1 =====
    h1("Chapter One: Introduction"),

    // 1.1 Introduction
    h2("1.1 Introduction"),
    body(
      "The rapid expansion of mobile internet access and the widespread adoption of instant messaging platforms in Ethiopia have transformed how young people search for employment opportunities. Telegram, in particular, has emerged as the de-facto communication backbone for university students, freelancers, and small businesses across the country, with millions of daily active users exchanging text, files, and payments through the platform. Within this ecosystem, a number of informal job-broadcasting channels have sprung up \u2014 channels such as Afriwork (Freelance Ethiopia) and Yegna Tutors Harrar regularly post tutoring gigs, part-time sales positions, freelance design work, and even full-time software development roles aimed at university students. These channels are popular because they are free to join, reach a large audience instantly, and feel native to the platforms students already use every day.",
    ),
    body(
      "However, the existing channel-based model suffers from several structural limitations. Job posts are unstructured free text, making it difficult to filter by subject, location, or salary. There is no centralised repository of past postings, so opportunities disappear into the chat history within hours. Applicants have no way to verify the legitimacy of employers, and employers have no way to verify the identity, academic standing, or contact information of applicants before scheduling an interview. There is also no mechanism for collecting posting or application fees, which limits the sustainability of these channels as businesses and creates friction when employers genuinely want to filter serious applicants from casual browsers. Temariware \u2014 the system proposed in this document \u2014 is designed to solve all of these problems by combining the reach of Telegram with the structure of a traditional job-matching platform.",
    ),
    body(
      "This chapter introduces the project by laying out the background of the existing system, articulating the problem statement, defining the general and specific objectives, scoping the work, listing its limitations, describing the methodology and tools used, explaining its significance, and finally presenting the work breakdown structure and feasibility analysis. The remaining chapters cover system requirement specification and analysis (Chapter Two) and design specification (Chapter Three).",
    ),

    // 1.2 Background of the System
    h2("1.2 Background (Overview) of the System"),
    body(
      "The Ethiopian higher education sector has expanded dramatically over the past two decades, with dozens of public universities now enrolling hundreds of thousands of undergraduate students every year. Despite this growth, formal part-time employment opportunities for students remain scarce and poorly advertised. Most universities do not maintain an internal job board, and the few commercial job portals that exist in Ethiopia \u2014 such as EthioJobs and Ezega Jobs \u2014 focus almost exclusively on full-time professional roles aimed at graduates rather than part-time tutoring, freelance, or internship roles suited to enrolled students. This gap has driven students and employers alike to informal channels on Telegram, where posting is free and the audience is highly targeted.",
    ),
    body(
      "Telegram's bot platform, first released in 2015, has matured into a capable development environment. The introduction of the Telegram Mini App framework (formerly Web Apps) in 2022 allowed bots to launch full-screen web applications inside the Telegram client, with the user's identity automatically passed to the application through a cryptographically signed initData string. This means that a well-designed Mini App can offer a rich user interface \u2014 complete with forms, image uploads, payments, and navigation \u2014 while inheriting the user's Telegram identity, contacts, and chat context. Combined with the Telegram Bot API's webhook mechanism, this enables real-time bidirectional communication between a backend server and the end user, all without the user ever leaving the Telegram app.",
    ),
    body(
      "Several existing bots in the Ethiopian market already use parts of this stack. Afriwork's bot (@freelanceethbot) broadcasts job posts and accepts applications via forwarded messages. Yegna Tutors Harrar (@Yegnatutorharrar) operates similarly but focuses exclusively on tutoring roles. Neither bot, however, offers a structured Mini App for browsing or applying, neither verifies user identity through documents, and neither supports integrated payments. Temariware's contribution is to combine all of these capabilities into a single, free-to-use platform that is specifically tailored to the needs of Ethiopian university students and the employers who want to hire them.",
    ),

    // 1.3 Statement of the Problem
    h2("1.3 Statement of the Problem"),
    body(
      "Despite the popularity of informal Telegram job channels, the current model fails both students and employers in several measurable ways. First, job posts are unstructured: a typical post from Yegna Tutors might list subjects, schedule, location, and salary as free-flowing text, making it impossible for a student to filter by subject or location, and easy to miss relevant opportunities when scrolling through a long chat history. Second, there is no persistent record of past postings, so once a job disappears from the recent feed it is effectively lost forever. Third, neither employers nor students are verified, which creates an environment where scams, no-shows, and disputes are common and trust is low.",
    ),
    body(
      "Fourth, the application process is highly manual: a student who is interested in a job must forward their CV and contact details to the employer's personal Telegram account, after which the employer must manually review each application in their private chat. There is no way to track which jobs a student has applied to, no way to compare applicants side by side, and no way to enforce a structured workflow such as \u201Caccept \u2192 pay confirmation fee \u2192 hired.\u201D Fifth, the existing channels have no monetisation model that would allow them to grow into sustainable businesses; without a payment mechanism, channel operators cannot charge for premium features, and employers cannot filter out casual applicants by requiring a small commitment fee.",
    ),
    body(
      "Temariware addresses all of these problems by providing a structured, verified, payment-enabled job-matching platform built directly into Telegram. The system allows employers to post jobs with rich, filterable metadata; requires students to upload National ID, University ID, and last semester grade report before they can apply; supports a per-job application fee paid via Telebirr or CBE with screenshot-based verification; and automatically closes positions once the specified number of hires has been reached. By solving these problems in a single integrated platform, Temariware aims to significantly reduce the friction of part-time employment for Ethiopian university students while creating a sustainable, trustworthy marketplace for employers.",
    ),

    // 1.4 General and Specific Objectives
    h2("1.4 General and Specific Objectives"),
    h3("1.4.1 General Objective"),
    body(
      "The general objective of this project is to design, develop, and deploy a Telegram Mini App and Bot called Temariware that connects Ethiopian university students with verified tutoring, freelance, part-time, and full-time job opportunities, while providing integrated payment verification, mandatory document checks, and automated hiring workflow management.",
    ),
    h3("1.4.2 Specific Objectives"),
    body("To achieve the general objective, the following specific objectives have been defined:"),
    body("i.   To analyse the limitations of existing informal Telegram job channels and elicit detailed functional and non-functional requirements from stakeholders (students, employers, and administrators)."),
    body("ii.  To design a multi-section Mini App user interface \u2014 covering job feed, job detail, post-job form, applications panel, profile, and admin panel \u2014 that is usable on small mobile screens and supports English, Amharic, and Afaan Oromoo."),
    body("iii. To design and implement a PostgreSQL database schema (managed via Prisma ORM) that captures users, jobs, applications, payments, subscriptions, and verification requests with appropriate relationships and constraints."),
    body("iv.  To implement a Telegram Bot webhook that handles slash commands (/start, /latest, /search, /subscribe, /postjob, /admin, /help), pushes instant job alerts to subscribers, and broadcasts approved jobs to the @TEMARIWARE channel."),
    body("v.   To implement Telegram WebApp initData HMAC-SHA256 validation so that every API request is cryptographically tied to a real Telegram user identity."),
    body("vi.  To implement a screenshot-based payment verification flow that allows employers to pay a configurable job post fee and students to pay a per-job application fee upon acceptance, with all payments reviewed and approved by an administrator."),
    body("vii. To implement mandatory student document upload (National ID, University ID, last semester grade report) with image compression, and expose these documents to employers during applicant review."),
    body("viii. To implement automatic job closure when the number of hired applicants reaches the positionsAvailable threshold, with appropriate notifications to all stakeholders."),
    body("ix.  To deploy the complete system on free-tier infrastructure (Vercel + Neon Postgres + Telegram Bot API) and verify end-to-end functionality through browser-based and bot-based testing."),
    body("x.   To document the system comprehensively in accordance with the Dire Dawa University industrial project guideline, including this proposal, the requirement specification, the design specification, and references."),

    // 1.5 Scope of the Project
    h2("1.5 Scope of the Project"),
    body(
      "Temariware is scoped as a v1 production system that delivers end-to-end job posting, application, payment, and hiring functionality for the Ethiopian university student market. The system supports three primary user roles: students (who browse, apply, and pay), employers (who post, review, and accept), and administrators (who approve, verify payments, and manage settings). The platform supports three languages (English, Amharic, Afaan Oromoo) and is designed to work on any device that runs the Telegram mobile, desktop, or web client.",
    ),
    body(
      "Within scope are: the Next.js Mini App with six primary views (Home, Job Detail, Post Job, Applications, Profile, Admin); the Telegram bot with nine slash commands and webhook handler; a PostgreSQL database with seven primary entities (User, Job, Application, Subscription, VerificationRequest, Setting, Payment); an HMAC-based authentication layer; a screenshot-based payment verification flow with admin approval; mandatory document upload with client-side image compression; per-job configurable application fees; automatic job closure upon hiring target completion; channel broadcast to @TEMARIWARE; and per-subscriber push alerts.",
    ),
    body(
      "Explicitly out of scope for v1 are: integration with real Chapa or Telebirr API for automated payment verification (only screenshot-based verification is implemented; a Chapa integration stub is included for v2); automated scraping and import of jobs from existing Telegram channels (manual posting only); in-app CV file storage (CV is referenced via external Google Drive or Dropbox links); email or SMS notifications (Telegram-only); employer dashboards with multiple job management (single-job-at-a-time applicant review); saved/bookmarked jobs; and reporting or analytics beyond basic admin stats. These features are documented as future work in the conclusion.",
    ),

    // 1.6 Limitation of the Project
    h2("1.6 Limitation of the Project"),
    body(
      "Several limitations of the proposed system should be acknowledged at the proposal stage. First, the payment verification flow relies on manual review of payment screenshots by an administrator. This introduces a latency of several hours between a student uploading a payment and being marked as hired, and it creates a single point of failure if the administrator is unavailable. A future version of the system would integrate with Chapa or Telebirr's API for instant automated verification, but this requires a registered business entity and a payment processor account that the project team does not currently possess.",
    ),
    body(
      "Second, the system depends entirely on Telegram as the delivery platform. Users who do not have a Telegram account cannot use Temariware, and any outage or API change on Telegram's side would directly impact the system's availability. Third, the system stores payment screenshots and identity documents as base64-encoded strings inside the PostgreSQL database rather than in dedicated object storage such as Supabase Storage or AWS S3. This decision was made to keep the deployment simple and within free-tier limits, but it imposes a practical limit of approximately one megabyte per image and may require migration to object storage as the user base grows.",
    ),
    body(
      "Fourth, the platform's trust model is based on document upload and admin verification, but it does not perform automated authenticity checks on uploaded IDs. A determined bad actor could upload a forged National ID image, and the system would have no automated way to detect this. Mitigation relies on the administrator visually inspecting each document and on the legal deterrent of fraudulent identity use under Ethiopian law. Fifth, the system currently supports only the Ethiopian market and the three languages mentioned; supporting other East African countries or additional languages would require additional localisation work. Finally, the system does not currently include an in-app dispute resolution mechanism; disputes between students and employers must be handled through the existing Telegram chat between the two parties.",
    ),

    // 1.7 Methodology and Approaches, Techniques and Tools
    h2("1.7 Methodology and Approaches, Techniques and Tools"),
    h3("1.7.1 Methodology and Approaches"),
    body(
      "The Temariware project follows the Object-Oriented Software Development approach as recommended by the Dire Dawa University industrial project guideline. Within this broad approach, the team adopts an iterative and incremental development process, with each iteration producing a working slice of functionality that can be demonstrated to the advisor and tested by potential users. The methodology is loosely based on the Agile Unified Process, combining lightweight upfront design (use case diagrams, conceptual class diagrams) with continuous integration and frequent deployment to a staging environment on Vercel.",
    ),
    body(
      "The project lifecycle consists of five phases: (1) requirements elicitation and analysis, in which existing Telegram job channels are studied, stakeholder interviews are conducted, and use cases are documented; (2) system design, in which the database schema, API contracts, and user interface are designed; (3) implementation, in which the Next.js Mini App, Prisma schema, and Telegram bot webhook are coded; (4) testing, in which end-to-end flows are verified through browser automation and manual bot interaction; and (5) deployment, in which the system is published to Vercel, the Telegram webhook is registered, and the @TEMARIWARE channel is configured for broadcasting.",
    ),
    h3("1.7.2 Techniques"),
    body(
      "Several specific software engineering techniques are employed. Object-oriented analysis is used to identify the primary entities (User, Job, Application, Payment, Subscription, VerificationRequest, Setting) and their relationships. Use case modelling is used to capture the interactions between actors (Student, Employer, Admin, Bot) and the system. CRC (Class-Responsibility-Collaboration) modelling is used during the conceptual design phase to assign responsibilities to each class. Sequence diagrams are used to document the multi-step flows such as \u201Capply to job,\u201D \u201Caccept applicant,\u201D and \u201Cverify payment.\u201D Activity diagrams capture the parallel and conditional flows such as the job approval and broadcast pipeline. Client-side image compression using the HTML Canvas API is used to keep uploaded document and payment screenshot sizes within database limits. Cryptographic HMAC-SHA256 validation is used to verify the authenticity of Telegram initData strings.",
    ),
    h3("1.7.3 Tools"),
    body("The following tools are used throughout the project:"),
    body("\u2022  Next.js 16 with App Router \u2014 the primary web framework for the Mini App, providing server-rendered React 19 components, API routes, and TypeScript support."),
    body("\u2022  React 19 + TypeScript 5 \u2014 the frontend library and type system used to build the user interface components."),
    body("\u2022  Tailwind CSS 4 with shadcn/ui \u2014 the styling framework and component library that provides a consistent, Telegram-native visual design."),
    body("\u2022  Prisma ORM 6 \u2014 the object-relational mapper that manages database schema, migrations, and typed queries."),
    body("\u2022  PostgreSQL on Neon \u2014 the relational database hosting provider, selected for its generous free tier (500MB storage) and Frankfurt region proximity to Ethiopia."),
    body("\u2022  Vercel \u2014 the deployment platform that hosts the Next.js application on its free tier with automatic HTTPS and global CDN."),
    body("\u2022  Telegram Bot API \u2014 the official Telegram API used to receive updates via webhook, send messages, set the menu button, and configure bot commands."),
    body("\u2022  Bun \u2014 the JavaScript runtime and package manager used during local development for its speed and built-in TypeScript execution."),
    body("\u2022  Visual Studio Code \u2014 the integrated development environment used for code editing, debugging, and version control integration."),
    body("\u2022  Git and GitHub \u2014 the version control system and remote repository used to track changes and collaborate within the team."),
    body("\u2022  Postman \u2014 the API testing tool used during development to verify endpoint behaviour."),
    body("\u2022  Vercel CLI \u2014 the command-line interface used to deploy the application and manage environment variables."),

    // 1.8 Significance of the Project
    h2("1.8 Significance of the Project"),
    body(
      "The significance of Temariware can be understood from the perspectives of three primary stakeholder groups: students, employers, and the broader Ethiopian tech ecosystem. For students, the platform significantly reduces the friction of finding part-time employment while studying. Instead of monitoring dozens of informal Telegram channels and manually forwarding CVs to employers, students can subscribe to subject- or location-based alerts on a single bot, browse a structured job feed, and apply with a single tap using a pre-verified profile. The mandatory document upload (National ID, University ID, grade report) serves a dual purpose: it builds trust with employers who would otherwise have no way to verify a student's identity, and it gives the student an incentive to maintain a complete and accurate academic record.",
    ),
    body(
      "For employers, the platform provides a structured applicant tracking workflow that simply does not exist in the current informal channel model. Employers can post jobs with rich metadata, set a per-job application fee that filters out casual browsers, review applicants' full profiles including documents in a single panel, accept or reject with one tap, and have the platform automatically close the position once the hiring target is met. The screenshot-based payment flow, while not as automated as a full Chapa integration, still provides a transparent record of every transaction and gives the administrator a clear audit trail. The @TEMARIWARE broadcast channel extends the reach of every posting to a public audience, including people who have not yet subscribed to the bot.",
    ),
    body(
      "For the broader Ethiopian tech ecosystem, Temariware serves as a reference implementation of a production-grade Telegram Mini App built entirely on free-tier infrastructure. The complete source code, deployment guide, and architectural decisions documented in this proposal can serve as a learning resource for other student developers who wish to build similar platforms. The project also demonstrates that it is possible to launch a real, revenue-generating software product in Ethiopia without any upfront capital investment in servers or proprietary software licences, which has implications for youth entrepreneurship and digital economy policy. Finally, by formalising a previously informal labour market, the platform creates data that can inform future research on youth employment patterns in Ethiopia.",
    ),

    // 1.9 Work breakdown Structure and Feasibility Analysis
    h2("1.9 Work Breakdown Structure and Feasibility Analysis"),
    h3("1.9.1 Work Breakdown"),
    body(
      "The project is divided into six major work packages, each with clearly defined deliverables, estimated effort, and responsible team members. The breakdown is summarised in Table 1.1 below and presented in detail in the project plan that accompanies this proposal.",
    ),
    // Table 1.1: Work breakdown
    caption("Table 1.1: Project Work Breakdown Structure"),
    buildWorkBreakdownTable(),
    body(
      "The total estimated effort for the project is approximately sixteen person-weeks, distributed across the four team members over a calendar period of roughly twelve weeks. The requirements and design phases are front-loaded to ensure that the implementation phase begins with a clear specification, while testing and deployment are interspersed with implementation rather than left to the end. The advisor review milestones are aligned with the end of each phase to ensure continuous feedback.",
    ),

    h3("1.9.2 Feasibility Analysis"),
    body(
      "A feasibility analysis was conducted along four traditional dimensions: technical, economic, operational, and schedule feasibility. The analysis is summarised in Table 1.2 below.",
    ),
    caption("Table 1.2: Feasibility Analysis Summary"),
    buildFeasibilityTable(),
    body(
      "The analysis indicates that the project is feasible on all four dimensions. Technically, all required tools and platforms are freely available and well-documented, and the team has the necessary background in web development and databases from prior coursework. Economically, the total recurring cost is zero Ethiopian Birr per month on free-tier infrastructure, with the only cost being the team's time. Operationally, the system aligns with existing user behaviour (Telegram usage is already widespread) and requires no training for end users. From a schedule perspective, the twelve-week timeline is tight but achievable given the iterative development approach and the fact that the team has already begun implementation as part of the proposal phase. The main risk is the dependency on a single administrator (the project team) for payment verification, which will be mitigated in v2 through Chapa API integration.",
    ),
  ];
}

// Helper: Work breakdown table
function buildWorkBreakdownTable() {
  const rows = [
    ["WP1", "Requirements Elicitation & Analysis", "2 weeks", "All members", "Requirements doc, use cases"],
    ["WP2", "System Design", "2 weeks", "Member 1, 2", "Schema, API contracts, UI mockups"],
    ["WP3", "Database & Backend Implementation", "3 weeks", "Member 1, 3", "Prisma schema, API routes, auth"],
    ["WP4", "Frontend Mini App Implementation", "3 weeks", "Member 2, 4", "All views, navigation, i18n"],
    ["WP5", "Bot Webhook & Channel Integration", "1 week", "Member 3", "Bot commands, broadcasts, alerts"],
    ["WP6", "Testing, Deployment, Documentation", "1 week", "All members", "Deployed app, this document"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: ["ID", "Work Package", "Duration", "Responsible", "Deliverables"].map((h) =>
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: 240 },
              children: [textRun(h, { bold: true, size: 22 })],
            })],
          }),
        ),
      }),
      // Data
      ...rows.map((r) => new TableRow({
        cantSplit: true,
        children: r.map((cell, i) =>
          new TableCell({
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({
              alignment: i === 0 || i === 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { line: 240 },
              children: [textRun(cell, { size: 22 })],
            })],
          }),
        ),
      })),
    ],
  });
}

// Helper: Feasibility table
function buildFeasibilityTable() {
  const rows = [
    ["Technical", "All tools are free, open-source, and well-documented. Team has relevant coursework background.", "Feasible"],
    ["Economic", "Zero monthly recurring cost on Vercel free tier + Neon free tier + Telegram Bot API. Only cost is team time.", "Feasible"],
    ["Operational", "Aligns with existing Telegram usage habits. No user training required. Document verification is intuitive.", "Feasible"],
    ["Schedule", "12-week timeline with 4 team members. Iterative development with continuous integration mitigates schedule risk.", "Feasible (tight)"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: ["Dimension", "Analysis", "Verdict"].map((h) =>
          new TableCell({
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { line: 240 },
              children: [textRun(h, { bold: true, size: 22 })],
            })],
          }),
        ),
      }),
      ...rows.map((r) => new TableRow({
        cantSplit: true,
        children: r.map((cell, i) =>
          new TableCell({
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({
              alignment: i === 0 || i === 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
              spacing: { line: 240 },
              children: [textRun(cell, { size: 22 })],
            })],
          }),
        ),
      })),
    ],
  });
}

// Need ShadingType in scope
const { ShadingType } = require("docx");

module.exports = { buildChapter1 };
