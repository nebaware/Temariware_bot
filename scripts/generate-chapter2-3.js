// Temariware — Chapter 2 (System Requirement Specification and Analysis)
// and Chapter 3 (Design Specification)

const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak, ShadingType,
} = require("docx");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  figure, figureWithCaption,
  FONT, SIZE_BODY, LINE_SPACING_15,
} = require("./generate-project-doc.js");

// =====================================================================
// CHAPTER TWO: SYSTEM REQUIREMENT SPECIFICATION AND ANALYSIS
// =====================================================================

function buildChapter2() {
  return [
    h1("Chapter Two: System Requirement Specification and Analysis"),

    // 2.1
    h2("2.1 Introduction/Overview"),
    body(
      "This chapter presents the requirement specification and analysis for the Temariware system. It is organised into two parts: Part One (System Requirement Specification) describes the current system, elicits the functional and non-functional requirements of the proposed system, and documents the supplementary specifications including business rules, constraints, and change cases. Part Two (System Analysis) presents the proposed system models in the Object-Oriented approach, including the system use case model, conceptual class model, sequence diagram, activity diagram, and user interface prototype. Together, these two parts form the bridge between the high-level objectives defined in Chapter One and the detailed design that will be presented in Chapter Three.",
    ),
    body(
      "The requirements were elicited through three complementary techniques: (1) direct observation of existing informal Telegram job channels such as Afriwork (@freelanceethbot) and Yegna Tutors Harrar (@Yegnatutorharrar), where the team monitored posts and applicant interactions over a two-week period; (2) informal interviews with five university students who have previously applied to jobs through these channels, focusing on the pain points they experienced; and (3) a competitive analysis of formal job portals (EthioJobs, Ezega Jobs) and international Telegram-based job bots to identify best practices and gaps. The resulting requirements are categorised as functional (what the system must do) and non-functional (how well the system must do it), with supplementary specifications capturing the implicit rules and constraints that shape the system's behaviour.",
    ),

    // PART ONE
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING_15, before: 240, after: 120 },
      children: [textRun("PART ONE: SYSTEM REQUIREMENT SPECIFICATION", { bold: true, size: 24 })],
    }),

    // 2.2 Description of Current System
    h2("2.2 Description of the Current System"),
    body(
      "The current system for matching university students with part-time employment in Ethiopia consists of a loose collection of informal Telegram channels operated by individual entrepreneurs. The largest of these, Afriwork (Freelance Ethiopia), operates a primary channel with over fifty thousand subscribers and an associated bot (@freelanceethbot) that accepts job postings from verified employers and forwards them to the channel. Yegna Tutors Harrar is a smaller, regionally-focused channel that specialises in tutoring jobs in the Harar and Dire Dawa areas, operated through the bot @Yegnatutorharrar. Other smaller channels exist for specific niches such as graphic design, content writing, and software development.",
    ),
    body(
      "The workflow of the current system is as follows. An employer who wishes to post a job composes a free-text message containing the job title, subjects, location, schedule, salary, and contact information, then forwards this message to the channel operator's bot. The operator manually reviews the post (sometimes), reformats it for consistency, and publishes it to the channel. Interested students then forward the post along with their CV and contact details to the employer's personal Telegram account. The employer reviews the forwarded applications in their private chat, contacts promising candidates directly, and arranges interviews or trial sessions. Payments, when required, are made directly between the employer and the channel operator via Telebirr, with no formal record kept by either party.",
    ),
    body(
      "Several weaknesses of this current system are immediately apparent. Posts are unstructured, making them difficult to filter or search. There is no centralised archive; once a post scrolls out of the recent feed, it is effectively lost. Neither employers nor students are verified, leading to frequent scams and no-shows. The application process is highly manual and repetitive, requiring students to forward their CV multiple times. There is no tracking of which jobs a student has applied to or which applicants an employer is considering. Payments are informal and lack an audit trail. The channels have no monetisation model beyond optional donations, limiting their ability to grow into sustainable businesses. These weaknesses collectively motivate the development of Temariware as a structured, verified, and payment-enabled alternative.",
    ),

    // 2.3 Functional Requirements
    h2("2.3 Functional Requirements of the Proposed System"),
    body(
      "The functional requirements describe what the Temariware system must do. They are organised by user role and presented in Table 2.1 below. Each requirement is given a unique identifier (FR-XX) for traceability throughout the design and implementation phases.",
    ),
    caption("Table 2.1: Functional Requirements"),
    buildFunctionalRequirementsTable(),

    // 2.4 Non-functional Requirements
    h2("2.4 Non-Functional Requirements (Technical Requirements)"),
    body(
      "The non-functional requirements describe how well the Temariware system must perform the functions defined above. They are organised into seven categories: performance, security, usability, reliability, scalability, maintainability, and compatibility. Each requirement is given a unique identifier (NFR-XX) and is testable through specific acceptance criteria.",
    ),
    caption("Table 2.2: Non-Functional Requirements"),
    buildNonFunctionalRequirementsTable(),

    // 2.5 Supplementary Specification
    h2("2.5 Supplementary Specification"),
    body(
      "This section documents the implicit rules, constraints, and anticipated changes that shape the Temariware system but do not fit neatly into the functional or non-functional requirement categories.",
    ),

    h3("2.5.1 Business Rules"),
    body("The following business rules govern the behaviour of the system:"),
    body("\u2022  BR-01: Only users with an active Telegram account can use the system. There is no email-password or social-login alternative."),
    body("\u2022  BR-02: Only verified employers (verification status = APPROVED) or administrators can post new jobs. Unverified users must submit a verification request first."),
    body("\u2022  BR-03: Students cannot apply to any job until their profile is marked complete (National ID number + image, University ID number + image, last semester grade report image all present)."),
    body("\u2022  BR-04: A student can apply to a given job only once. Duplicate applications are rejected at the API level via a unique constraint on (jobId, userId)."),
    body("\u2022  BR-05: Job posting requires payment of the configured jobPostFee (default 500 ETB) via screenshot upload. The job remains in PENDING_PAYMENT status until the administrator approves both the content and the payment."),
    body("\u2022  BR-06: Application fees are per-job configurable by the employer. When the employer accepts an applicant, the student is notified to pay the applicationFee for that specific job (or the global default if not set)."),
    body("\u2022  BR-07: An application cannot be marked HIRED until the student has uploaded a payment screenshot and the administrator has approved it."),
    body("\u2022  BR-08: When the number of hired applicants for a job reaches the positionsAvailable threshold, the job is automatically marked CLOSED and all remaining pending or accepted applications are marked CLOSED with notifications sent to all affected users."),
    body("\u2022  BR-09: Administrators can configure global fees, payment instructions, and Telebirr/CBE account numbers through the Settings tab. Changes take effect immediately for all subsequent transactions."),
    body("\u2022  BR-10: Every approved job is automatically broadcast to the @TEMARIWARE channel as a richly formatted card, and to all subscribers whose alert category matches the job's work type or who have subscribed to the ALL category."),

    h3("2.5.2 Constraint"),
    body("The following constraints limit the design and implementation choices:"),
    body("\u2022  CON-01: The system must operate entirely on free-tier infrastructure to ensure zero recurring cost. This limits database storage to 500MB on Neon and serverless function execution time to 60 seconds on Vercel."),
    body("\u2022  CON-02: Payment verification must be screenshot-based in v1 because the project team does not have a registered business entity required for Chapa or Telebirr API integration. This constraint will be lifted in v2."),
    body("\u2022  CON-03: Uploaded images (documents and payment screenshots) must be stored as base64 strings inside the PostgreSQL database, with a maximum size of approximately 1MB per image after client-side compression. This is a trade-off to avoid the complexity of separate object storage."),
    body("\u2022  CON-04: The Mini App must work inside the Telegram WebApp container, which restricts certain browser APIs (no download attribute on links, limited clipboard access, no service workers)."),
    body("\u2022  CON-05: The Telegram Bot API does not allow web_app inline buttons in channel posts; only URL buttons are permitted. This constraint shapes the channel broadcast UX."),
    body("\u2022  CON-06: The system must support three languages (English, Amharic, Afaan Oromoo) with runtime switching, requiring all UI strings to be externalised in a translation dictionary."),

    h3("2.5.3 Change Case"),
    body("The following change cases represent anticipated future modifications that the design should accommodate without major rework:"),
    body("\u2022  CC-01: Add Chapa or Telebirr API integration for automated payment verification, replacing the screenshot-based flow. The existing Payment model already includes a chapaEnabled flag and chapaPublicKey/chapaSecretKey fields to support this."),
    body("\u2022  CC-02: Migrate image storage from base64-in-PostgreSQL to Supabase Storage or AWS S3. The User and Job models already separate image fields, making this migration straightforward."),
    body("\u2022  CC-03: Add an in-app messaging system between students and employers, replacing the current \u201Ccontact via Telegram @username\u201D approach."),
    body("\u2022  CC-04: Add automated scraping and import of jobs from existing Telegram channels such as Afriwork, to seed the platform during the early growth phase."),
    body("\u2022  CC-05: Add an employer dashboard with multi-job management, analytics, and bulk applicant actions."),
    body("\u2022  CC-06: Add saved/bookmarked jobs for students, with optional daily or weekly digest notifications."),

    h3("2.5.4 Requirement Elicitation Models"),
    body(
      "This subsection presents the models used during requirements elicitation to capture and communicate the system's behaviour before the formal analysis in Part Two. Four models are presented: essential use case modelling, CRC modelling, essential user interface prototyping, and user interface flow diagramming.",
    ),

    h3("2.5.4.1 Essential Use Case Modeling"),
    body(
      "An essential use case model captures the interactions between the system's primary actors and the system itself, at a technology-independent level. The primary actors in Temariware are the Student, the Employer, the Administrator, and the Telegram Bot (which acts as both an actor and a system component). The essential use cases identified during elicitation are summarised below, and the diagram is presented in Figure 2.1.",
    ),
    body("\u2022  UC-01: Browse Job Feed \u2014 any user (including unauthenticated) can browse the list of approved jobs with filters."),
    body("\u2022  UC-02: View Job Detail \u2014 any user can view the full details of a specific job."),
    body("\u2022  UC-03: Register / Authenticate \u2014 a Telegram user is automatically registered and authenticated when they open the Mini App via the Telegram WebApp initData flow."),
    body("\u2022  UC-04: Complete Profile \u2014 a student uploads their personal information and mandatory documents."),
    body("\u2022  UC-05: Apply to Job \u2014 a student with a complete profile submits an application to an approved, open job."),
    body("\u2022  UC-06: Subscribe to Alerts \u2014 a user subscribes to receive push notifications when matching jobs are posted."),
    body("\u2022  UC-07: Post Job \u2014 a verified employer submits a new job posting with payment screenshot."),
    body("\u2022  UC-08: Verify Employer \u2014 an administrator reviews and approves or rejects an employer verification request."),
    body("\u2022  UC-09: Approve Job \u2014 an administrator reviews a pending job (content + payment) and approves or rejects it."),
    body("\u2022  UC-10: Review Applicants \u2014 an employer views the list of applicants for their jobs with full profiles and documents."),
    body("\u2022  UC-11: Accept Applicant \u2014 an employer accepts an applicant, triggering a payment request notification."),
    body("\u2022  UC-12: Upload Payment \u2014 a student uploads a payment screenshot after being accepted."),
    body("\u2022  UC-13: Approve Payment \u2014 an administrator verifies a payment screenshot and marks the applicant as HIRED."),
    body("\u2022  UC-14: Configure Settings \u2014 an administrator updates fees, payment instructions, and account numbers."),
    body("\u2022  UC-15: Broadcast to Channel \u2014 the system automatically posts approved jobs to the @TEMARIWARE channel."),
    ...figureWithCaption("figure_2_1_use_case.png", "Figure 2.1: Essential Use Case Diagram of Temariware"),

    h3("2.5.4.2 CRC Modeling"),
    body(
      "Class-Responsibility-Collaboration (CRC) modelling is used during the conceptual design phase to assign responsibilities to each class and identify the collaborations between them. A CRC card is a physical or virtual index card listing the class name, its responsibilities, and the classes it collaborates with. Three representative CRC cards are presented below; the complete set is included in Appendix A.",
    ),
    caption("Table 2.3: CRC Card \u2014 User Class"),
    buildCRCTable("User", [
      "Store Telegram identity, role, language, and profile fields",
      "Maintain mandatory documents (National ID, University ID, grade report)",
      "Track profile completion status",
      "Track employer verification status",
      "Maintain alert subscription preferences",
    ], ["Job (as employer)", "Application (as applicant)", "Subscription", "VerificationRequest", "Payment"]),
    caption("Table 2.4: CRC Card \u2014 Job Class"),
    buildCRCTable("Job", [
      "Store job metadata (title, subjects, location, salary, schedule, etc.)",
      "Track status (PENDING_PAYMENT, PENDING, APPROVED, REJECTED, CLOSED)",
      "Track positionsAvailable and filledPositions",
      "Store per-job applicationFee override",
      "Store payment screenshot and payment verification status",
    ], ["User (as employer)", "Application", "Payment", "Setting (for default fees)"]),
    caption("Table 2.5: CRC Card \u2014 Application Class"),
    buildCRCTable("Application", [
      "Link a student to a job with a status lifecycle",
      "Store application message and payment screenshot",
      "Track status: PENDING \u2192 ACCEPTED \u2192 PAYMENT_PENDING \u2192 HIRED (or REJECTED/CLOSED)",
      "Trigger notifications on status transitions",
    ], ["User (student)", "Job", "Payment"]),

    h3("2.5.4.3 Essential User Interface (UI) Prototype"),
    body(
      "An essential UI prototype was created using low-fidelity wireframes to validate the information architecture and navigation flow before high-fidelity implementation. The prototype consists of six primary screens: Home (job feed with search and filters), Job Detail (full job information with apply button), Post Job (form with payment screenshot upload), Applications (tabs for \u201Cmy applications\u201D as student and \u201Capplicants to my jobs\u201D as employer), Profile (with mandatory document upload), and Admin (tabs for pending jobs, payments, verifications, settings, stats). The wireframes are presented in Figure 2.5 and the high-fidelity implementation screenshots are included in Appendix B.",
    ),
    ...figureWithCaption("figure_2_5_ui_home.png", "Figure 2.5: Essential User Interface Prototype \u2014 Home View wireframe"),

    h3("2.5.4.4 User Interface (UI) Flow Diagram"),
    body(
      "The UI flow diagram captures how a user navigates between the six primary screens of the Mini App. From the Home screen, a user can tap any job card to enter the Job Detail screen, or use the bottom navigation bar to switch to Post Job, Applications, Profile, or Admin (admin tab visible only to administrators). The Job Detail screen has a back button that returns to Home. The Post Job screen redirects to Home after successful submission. The Applications screen has two internal tabs (Applicants / My Applications) for employer users. The Profile screen includes a verification form that appears when the user is not yet verified. The UI flow diagram is presented in Figure 2.6.",
    ),
    ...figureWithCaption("figure_2_6_ui_flow.png", "Figure 2.6: User Interface Flow Diagram"),

    // PART TWO
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING_15, before: 240, after: 120 },
      children: [textRun("PART TWO: SYSTEM ANALYSIS", { bold: true, size: 24 })],
      pageBreakBefore: true,
    }),

    h2("2.6 The Proposed System Models (in OO Approach)"),
    body(
      "Part Two of this chapter presents the system models for Temariware using the Object-Oriented approach. These models \u2014 system use case model, conceptual class model, sequence diagram, activity diagram, and user interface prototype \u2014 form the bridge between the requirements captured in Part One and the detailed design that will be presented in Chapter Three.",
    ),

    h3("2.6.1 System Use Case Model"),
    body(
      "The system use case model refines the essential use cases from Section 2.5.4.1 by adding system-level detail. The model is presented in Figure 2.7 and identifies four primary actors (Student, Employer, Administrator, Telegram Bot) and fifteen use cases. The Student actor is associated with Browse Job Feed, View Job Detail, Complete Profile, Apply to Job, Subscribe to Alerts, Upload Payment, and View My Applications. The Employer actor is associated with Post Job, Review Applicants, Accept Applicant, Reject Applicant, and Verify Employer. The Administrator actor is associated with Approve Job, Approve Payment, Approve Verification, and Configure Settings. The Telegram Bot actor is associated with Handle Slash Commands, Push Job Alerts, and Broadcast to Channel. Several include and extend relationships are modelled \u2014 for example, Apply to Job includes Check Profile Complete (a student cannot apply if their profile is incomplete), and Post Job extends Upload Payment Screenshot (the upload is only required when the jobPostFee is greater than zero).",
    ),
    ...figureWithCaption("figure_2_1_use_case.png", "Figure 2.7: System Use Case Model (refined)"),

    h3("2.6.2 Conceptual Class Model"),
    body(
      "The conceptual class model identifies the primary domain entities and their relationships at an analysis level, independent of implementation. The seven primary classes are User, Job, Application, Subscription, VerificationRequest, Setting, and Payment. A User has many Jobs (as employer), many Applications (as student), many Subscriptions, and may have one VerificationRequest. A Job has many Applications. An Application belongs to one User and one Job, and may have one associated Payment. A Setting is a singleton. The conceptual class diagram is presented in Figure 2.8.",
    ),
    ...figureWithCaption("figure_2_2_class_model.png", "Figure 2.8: Conceptual Class Model"),

    h3("2.6.3 Sequence Diagram"),
    body(
      "Sequence diagrams capture the time-ordered interactions between objects for the system's most important flows. Three sequence diagrams are presented: Apply to Job (Figure 2.9), Accept Applicant and Pay (Figure 2.10), and Approve Job and Broadcast (Figure 2.11). The Apply to Job flow involves the Student (Mini App), the Jobs API, the Applications API, the Database, and the Employer (via Telegram notification). The Accept Applicant and Pay flow involves the Employer, the Accept API, the Student (via Telegram notification), the Pay API, the Admin, and the Approve Payment API. The Approve Job and Broadcast flow involves the Admin, the Approve API, the Channel (via Telegram Bot API), and the Subscribers (via Telegram push).",
    ),
    ...figureWithCaption("figure_2_3_sequence_apply.png", "Figure 2.9: Sequence Diagram \u2014 Apply to Job flow"),
    ...figureWithCaption("figure_2_10_sequence_accept_pay.png", "Figure 2.10: Sequence Diagram \u2014 Accept Applicant and Pay flow"),
    ...figureWithCaption("figure_2_11_sequence_approve_broadcast.png", "Figure 2.11: Sequence Diagram \u2014 Approve Job and Broadcast flow"),

    h3("2.6.4 Activity Diagram"),
    body(
      "Activity diagrams capture the parallel and conditional flows within the system. The most important activity diagram is the Job Posting and Approval Flow (Figure 2.12), which shows the path from an employer submitting a job to the job being broadcast to the channel and alerts being sent to subscribers. The flow includes decision points for payment verification, content review, and broadcast success, with appropriate error paths. A second activity diagram captures the Application Lifecycle (Figure 2.13), showing the states an application passes through from PENDING to HIRED or CLOSED, including the auto-close trigger when positions are filled.",
    ),
    ...figureWithCaption("figure_2_4_activity_job_flow.png", "Figure 2.12: Activity Diagram \u2014 Job Posting and Approval Flow"),
    ...figureWithCaption("figure_2_13_activity_app_lifecycle.png", "Figure 2.13: Activity Diagram \u2014 Application Lifecycle"),

    h3("2.6.5 User Interface Prototype"),
    body(
      "The high-fidelity user interface prototype was implemented directly in React with Tailwind CSS and shadcn/ui components, following a Telegram-native visual design system. The prototype consists of six views: Home (job feed with debounced search and filter chips), Job Detail (structured facts grid with apply form), Post Job (full form with payment screenshot upload), Applications (tabbed view for students and employers), Profile (with mandatory document upload and image compression), and Admin (tabbed view with pending jobs, payments, verifications, settings, and stats). Screenshots of the implemented prototype are included in Appendix B.",
    ),
    ...figureWithCaption("figure_3_10_ui_home.png", "Figure 2.14: User Interface Prototype \u2014 Home View (implemented)"),
    ...figureWithCaption("figure_3_11_ui_detail.png", "Figure 2.15: User Interface Prototype \u2014 Job Detail View (implemented)"),
    ...figureWithCaption("figure_3_15_ui_admin.png", "Figure 2.16: User Interface Prototype \u2014 Admin Panel (implemented)"),
  ];
}

// =====================================================================
// CHAPTER THREE: DESIGN SPECIFICATION
// =====================================================================

function buildChapter3() {
  return [
    h1("Chapter Three: Design Specification"),

    // 3.1
    h2("3.1 Introduction/Overview"),
    body(
      "This chapter presents the design specification for the Temariware system, building on the requirements and analysis presented in Chapter Two. The chapter is organised into two main sections: Software Architecture (Section 3.2), which describes the high-level architectural style and presents the architecture using UML diagrams including class type architecture, component diagram, deployment diagram, and persistent diagram; and Detailed Design of the System (Section 3.3), which presents the design-level class diagram, collaboration diagram, state chart diagram, and user interface diagram. Together, these design artefacts provide a complete blueprint that can be handed off to the implementation team.",
    ),
    body(
      "The design follows the Object-Oriented paradigm consistently with the analysis in Chapter Two. The architecture is a modern variant of the classic Model-View-Controller (MVC) pattern, adapted to the Next.js App Router conventions where API routes serve as controllers and React components serve as views. The persistence layer is managed by Prisma ORM, which generates type-safe query builders from the Prisma schema and abstracts away the underlying PostgreSQL database.",
    ),

    // 3.2
    h2("3.2 Software Architecture"),
    h3("3.2.1 Architectural Styles"),
    body(
      "Several architectural styles were considered during the design phase. The selected style is a Layered Architecture with four layers: Presentation (React components), Application (Next.js API routes), Domain (Prisma models and business logic), and Persistence (PostgreSQL database on Neon). This style was chosen because it provides clear separation of concerns, matches the conventions of the Next.js framework, and is well-understood by the development team. Alternative styles considered included the Microkernel pattern (too complex for the current scope), Event-Driven Architecture (would introduce unnecessary complexity for the current scale), and the Serverless-First pattern (effectively a deployment-time choice rather than an architectural style, and already adopted via Vercel). The comparison of architectural styles is summarised in Table 3.1.",
    ),
    caption("Table 3.1: Software Architecture Styles Considered"),
    buildArchitectureStylesTable(),

    h3("3.2.2 Describing an Architecture using UML"),
    body(
      "This subsection describes the Temariware architecture using four UML diagrams: class type architecture, component diagram, deployment diagram, and persistent diagram. Each diagram captures a different view of the system and together they provide a complete architectural picture.",
    ),

    h3("3.2.2.1 Class Type Architecture"),
    body(
      "The class type architecture organises the system's classes into three types: Entity classes (User, Job, Application, Subscription, VerificationRequest, Setting, Payment) which represent persistent domain objects; Boundary classes (HomeView, JobDetailView, PostJobView, ApplicationsView, ProfileView, AdminView, BotWebhookHandler) which interact with external actors; and Control classes (AuthController, JobController, ApplicationController, PaymentController, AdminController, BotController) which orchestrate the business logic between entity and boundary classes. This separation follows the Entity-Boundary-Control (ECB) pattern, which is a refinement of MVC that is particularly well-suited to object-oriented systems with use-case-driven design. The class type architecture diagram is presented in Figure 3.1.",
    ),
    ...figureWithCaption("figure_3_1_class_type.png", "Figure 3.1: Class Type Architecture Diagram"),

    h3("3.2.2.2 Component Diagram"),
    body(
      "The component diagram shows the deployable software components and their dependencies. Temariware consists of five primary components: the Next.js Mini App (deployed on Vercel), the Telegram Bot Webhook (an API route within the Next.js app), the PostgreSQL Database (hosted on Neon), the Telegram Bot API (external, provided by Telegram), and the @TEMARIWARE Channel (external, owned by the project team). The Mini App component depends on the Database component (via Prisma ORM) and on the Telegram Bot API component (via HTTPS for sending messages and via initData validation for authenticating users). The Bot Webhook component depends on the Database and on the Telegram Bot API. The Telegram Bot API pushes updates to the Bot Webhook via HTTPS webhook. The component diagram is presented in Figure 3.2.",
    ),
    ...figureWithCaption("figure_3_2_component.png", "Figure 3.2: Component Diagram"),

    h3("3.2.2.3 Deployment Diagram"),
    body(
      "The deployment diagram shows the physical nodes on which the software components run and the communication paths between them. Temariware is deployed across three physical nodes: (1) the Vercel Edge Network, which runs the Next.js Mini App and Bot Webhook as serverless functions across multiple global regions; (2) the Neon Cloud, which runs the PostgreSQL database in the Frankfurt region (eu-central-1, selected for proximity to Ethiopia); and (3) the Telegram Cloud, which runs the Telegram Bot API and hosts the @TEMARIWARE channel. End users (students, employers, administrators) access the system through the Telegram client on their mobile or desktop devices, which communicates with the Telegram Cloud, which in turn communicates with the Vercel Edge Network via webhook and inline button URLs. The deployment diagram is presented in Figure 3.3.",
    ),
    ...figureWithCaption("figure_3_3_deployment.png", "Figure 3.3: Deployment Diagram"),

    h3("3.2.2.4 Persistent Diagram"),
    body(
      "The persistent diagram (also known as the data model or entity-relationship diagram) shows the structure of the database. Temariware's database consists of seven tables: User, Job, Application, Subscription, VerificationRequest, Setting, and Payment. The User table is central, with one-to-many relationships to Job (as employer), Application (as student), Subscription, VerificationRequest, and Payment. The Job table has a one-to-many relationship with Application and Payment. The Application table has a unique constraint on (jobId, userId) to prevent duplicate applications. The Setting table is a singleton (single row with id = 'singleton') that stores global configuration. The persistent diagram with full field-level detail is presented in Figure 3.4 and a summary of the tables is provided in Table 3.2.",
    ),
    ...figureWithCaption("figure_3_4_persistent.png", "Figure 3.4: Persistent Diagram (Entity-Relationship Diagram)"),
    caption("Table 3.2: Persistent Data Model Summary"),
    buildPersistentTable(),

    // 3.3 Detailed Design
    h2("3.3 Detailed Design of the System"),
    body(
      "This section presents the detailed design of the Temariware system, refining the conceptual models from Chapter Two into implementation-ready specifications. Four detailed design artefacts are presented: the design-level class diagram, the collaboration diagram, the state chart diagram, and the user interface diagram.",
    ),

    h3("3.3.1 Design Level Class Diagram"),
    body(
      "The design-level class diagram refines the conceptual class diagram from Section 2.6.2 by adding attributes, operations, visibility, and data types. Each class now includes its full set of fields with types (matching the Prisma schema), key methods (matching the API route handlers), and visibility markers (public for API-exposed operations, private for internal logic). For example, the User class includes attributes such as id (cuid), telegramId (string, unique), role (enum), verification (enum), and the seven mandatory document fields; it includes operations such as upsertUser(), authenticate(), and updateProfile(). The complete design-level class diagram is presented in Figure 3.5.",
    ),
    ...figureWithCaption("figure_3_5_design_class.png", "Figure 3.5: Design-Level Class Diagram"),

    h3("3.3.2 Collaboration Diagram"),
    body(
      "The collaboration diagram (also known as a communication diagram) shows the objects that collaborate to fulfil a specific use case, along with the messages passed between them. Three collaboration diagrams are presented: (1) Apply to Job (Figure 3.6), showing the collaboration between MiniApp, JobAPI, ApplicationAPI, Database, and EmployerNotification; (2) Post Job and Pay (Figure 3.7), showing the collaboration between EmployerMiniApp, JobsAPI, PaymentModel, Database, and AdminNotification; and (3) Approve Payment and Hire (Figure 3.8), showing the collaboration between AdminMiniApp, AdminAPI, ApplicationModel, JobModel, SubscriberNotification, and AutoCloseTrigger. The collaboration diagrams emphasise the structural relationships between objects while the sequence diagrams in Section 2.6.3 emphasise the time-ordering of messages.",
    ),
    ...figureWithCaption("figure_3_6_collab_apply.png", "Figure 3.6: Collaboration Diagram \u2014 Apply to Job"),
    ...figureWithCaption("figure_3_7_collab_post_pay.png", "Figure 3.7: Collaboration Diagram \u2014 Post Job and Pay"),
    ...figureWithCaption("figure_3_8_collab_hire.png", "Figure 3.8: Collaboration Diagram \u2014 Approve Payment and Hire"),

    h3("3.3.3 State Chart Diagram"),
    body(
      "The state chart diagram captures the lifecycle of the Application object, which is the most stateful entity in the system. An Application begins in the PENDING state when a student submits it. From PENDING, the employer can transition it to ACCEPTED (if they want to hire the student) or REJECTED (if they do not). From ACCEPTED, the student uploads a payment screenshot, transitioning the application to PAYMENT_PENDING. From PAYMENT_PENDING, the administrator can transition it to HIRED (if the payment is verified) or back to ACCEPTED (if the payment is rejected, allowing the student to re-upload). At any point before HIRED, the application can be transitioned to CLOSED if the job's positions are filled by other applicants. Once HIRED or CLOSED, no further transitions are possible. The state chart diagram is presented in Figure 3.9.",
    ),
    ...figureWithCaption("figure_3_9_state_chart.png", "Figure 3.9: State Chart Diagram \u2014 Application Lifecycle"),

    h3("3.3.4 User Interface Diagram"),
    body(
      "The user interface diagram shows the structure of each Mini App view in terms of its constituent UI components and their layout. The Home view consists of a search bar, filter chips, a job feed list, and a bottom navigation bar. The Job Detail view consists of a back button, a job title with badges, an employer row with avatar, a facts grid, a description card, an apply button (or status card if already applied), and the bottom navigation bar. The Post Job view consists of a fee notice card, a form card with multiple input fields grouped in a two-column grid, a payment screenshot uploader, and a submit button. The Applications view consists of a tabbed layout (Applicants / My Applications) with cards showing applicant or application summaries, and a sliding sheet for full applicant profile review. The Profile view consists of an identity header, language picker, verification status card, profile form, university form, mandatory documents card with three image uploaders, and alerts form. The Admin view consists of a five-tab layout (Jobs, Payments, Verifications, Settings, Stats) with appropriate content per tab. The user interface diagrams are presented in Figures 3.10 through 3.15.",
    ),
    ...figureWithCaption("figure_3_10_ui_home.png", "Figure 3.10: UI Diagram \u2014 Home View"),
    ...figureWithCaption("figure_3_11_ui_detail.png", "Figure 3.11: UI Diagram \u2014 Job Detail View"),
    ...figureWithCaption("figure_3_12_ui_post.png", "Figure 3.12: UI Diagram \u2014 Post Job View"),
    ...figureWithCaption("figure_3_13_ui_apps.png", "Figure 3.13: UI Diagram \u2014 Applications View"),
    ...figureWithCaption("figure_3_14_ui_profile.png", "Figure 3.14: UI Diagram \u2014 Profile View"),
    ...figureWithCaption("figure_3_15_ui_admin.png", "Figure 3.15: UI Diagram \u2014 Admin View"),
  ];
}

// =====================================================================
// TABLE BUILDERS
// =====================================================================

function buildFunctionalRequirementsTable() {
  const rows = [
    ["FR-01", "System shall authenticate users via Telegram WebApp initData HMAC-SHA256 validation"],
    ["FR-02", "System shall allow any user to browse approved jobs without authentication"],
    ["FR-03", "System shall allow users to filter jobs by subject, location, type, gender, and search query"],
    ["FR-04", "System shall allow students to upload National ID, University ID, and grade report with client-side compression"],
    ["FR-05", "System shall block applications from students with incomplete profiles"],
    ["FR-06", "System shall allow verified employers to post jobs with all metadata fields"],
    ["FR-07", "System shall require payment screenshot upload when jobPostFee > 0"],
    ["FR-08", "System shall allow administrators to approve or reject pending jobs with reason"],
    ["FR-09", "System shall broadcast approved jobs to @TEMARIWARE channel automatically"],
    ["FR-10", "System shall push job alerts to subscribers whose category matches the job type"],
    ["FR-11", "System shall allow employers to view applicant profiles including documents"],
    ["FR-12", "System shall allow employers to accept or reject applicants"],
    ["FR-13", "System shall notify students via Telegram when accepted, requesting payment"],
    ["FR-14", "System shall allow students to upload payment screenshots after acceptance"],
    ["FR-15", "System shall allow administrators to approve or reject payment screenshots"],
    ["FR-16", "System shall mark applicants as HIRED upon payment approval"],
    ["FR-17", "System shall auto-close jobs when filledPositions reaches positionsAvailable"],
    ["FR-18", "System shall allow administrators to configure fees and payment instructions"],
    ["FR-19", "System shall support English, Amharic, and Afaan Oromoo with runtime switching"],
    ["FR-20", "System shall handle bot slash commands: /start, /latest, /search, /subscribe, /unsubscribe, /myapps, /postjob, /admin, /help"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["ID", "Requirement"].map((h) =>
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
            children: [new Paragraph({ alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 22 })] })],
          }),
        ),
      })),
    ],
  });
}

function buildNonFunctionalRequirementsTable() {
  const rows = [
    ["NFR-01", "Performance", "API response time < 500ms for 95% of requests; Mini App first contentful paint < 2s on 3G"],
    ["NFR-02", "Security", "All API requests authenticated via HMAC-SHA256; no plaintext storage of payment data; HTTPS only"],
    ["NFR-03", "Usability", "Mini App usable on 360px-wide screens; 3 languages; touch targets >= 44px; haptic feedback on actions"],
    ["NFR-04", "Reliability", "99% uptime (Vercel SLA); graceful error handling with user-friendly messages; no silent failures"],
    ["NFR-05", "Scalability", "Serverless architecture scales to 1000 concurrent users on free tier; DB connection pooling via Neon"],
    ["NFR-06", "Maintainability", "TypeScript throughout; modular components; Prisma typed queries; 100% lint-clean; documented in this report"],
    ["NFR-07", "Compatibility", "Works in Telegram mobile (iOS, Android), Telegram Desktop, and Telegram Web; modern browser fallback"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["ID", "Category", "Requirement"].map((h) =>
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
            children: [new Paragraph({ alignment: i === 0 || i === 1 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 22 })] })],
          }),
        ),
      })),
    ],
  });
}

function buildCRCTable(className, responsibilities, collaborators) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header row with class name spanning both columns
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            columnSpan: 2,
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240 }, children: [textRun(`Class: ${className}`, { bold: true, size: 22 })] })],
          }),
        ],
      }),
      // Two-column row: Responsibilities | Collaborators
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [
              new Paragraph({ spacing: { line: 240 }, children: [textRun("Responsibilities:", { bold: true, size: 22 })] }),
              ...responsibilities.map((r) => new Paragraph({ spacing: { line: 240 }, children: [textRun(`\u2022  ${r}`, { size: 22 })] })),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [
              new Paragraph({ spacing: { line: 240 }, children: [textRun("Collaborators:", { bold: true, size: 22 })] }),
              ...collaborators.map((c) => new Paragraph({ spacing: { line: 240 }, children: [textRun(`\u2022  ${c}`, { size: 22 })] })),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildArchitectureStylesTable() {
  const rows = [
    ["Layered Architecture", "Separation of concerns, matches Next.js conventions, well-understood", "Selected"],
    ["Microkernel", "Highly extensible, supports plugins", "Too complex for current scope"],
    ["Event-Driven", "Loosely coupled, scalable", "Adds unnecessary complexity (Kafka, etc.)"],
    ["Serverless-First", "Auto-scaling, pay-per-use", "Already adopted at deployment level"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Style", "Pros", "Verdict"].map((h) =>
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
            children: [new Paragraph({ alignment: i === 0 || i === 2 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 22 })] })],
          }),
        ),
      })),
    ],
  });
}

function buildPersistentTable() {
  const rows = [
    ["User", "id, telegramId, username, role, language, profile fields, document fields, verification, isAdmin"],
    ["Job", "id, title, description, subjects, location, workType, salary, positionsAvailable, filledPositions, applicationFee, status, payment fields"],
    ["Application", "id, jobId, userId, message, status, paymentScreenshot, paymentStatus, hiredAt, createdAt"],
    ["Subscription", "id, userId, category"],
    ["VerificationRequest", "id, userId, companyName, contactTelegram, proofUrl, status"],
    ["Setting", "id (singleton), jobPostFee, applicationFee, paymentInstructions, telebirrNumber, cbeAccount, chapaEnabled"],
    ["Payment", "id, userId, jobId, type, applicationId, amount, screenshotUrl, status, reviewedBy"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Table", "Key Fields"].map((h) =>
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
            children: [new Paragraph({ alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 22 })] })],
          }),
        ),
      })),
    ],
  });
}

module.exports = { buildChapter2, buildChapter3 };
