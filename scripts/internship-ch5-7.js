// Internship Report — Chapter 5 (Collaboration) + Chapter 6 (Project Highlights) + Chapter 7 (Learning)

const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak, ShadingType,
} = require("docx");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  FONT, SIZE_BODY, LINE_SPACING_15,
} = require("./generate-project-doc.js");

// =====================================================================
// CHAPTER 5: COLLABORATION AND TEAMWORK
// =====================================================================

function buildChapter5() {
  return [
    h1("Chapter Five: Collaboration and Teamwork"),

    h2("5.1 Team Experience"),
    body(
      "My experience working with the team at Afronex was one of the most formative aspects of the internship. The team comprised some of my classmates from Dire Dawa University and students from other universities, including Haramaya University, who were assigned to Afronex for the same internship programme. The key team members and their responsibilities were set in an organised manner: work was assigned, tracked, reviewed, and integrated by the company to allow things to flow well across all interns, not just within each team.",
    ),
    body(
      "We were organised into pairs within each team, with each pair taking ownership of a specific feature based on their preference and closeness to each other. This pair-based ownership model allowed us to master the features we were responsible for while still being available to help other teams when they faced problems on their side. The cross-team help was particularly valuable during the integration phase, when Team 7 (Member Experience and Integration QA) needed support from every team to validate cross-module behaviour and catch regressions.",
    ),

    h2("5.2 Collaborative Tools and Methodologies"),
    body("Several collaborative tools and methodologies were used throughout the internship:"),
    body("\u2022  Telegram groups \u2014 the primary asynchronous communication channel for each team and for the broader intern cohort. Decisions, links, and quick questions were exchanged here, and the history served as an informal record of the team's reasoning."),
    body("\u2022  GitHub \u2014 used for code hosting, pull request review, issue tracking, and integration management. Each team had its own repository or branch structure, with shared contracts maintained in a common location accessible to all teams."),
    body("\u2022  Collaborative folders on AI agents \u2014 shared directories where AI agent outputs (such as generated code, test cases, and review notes) were stored for transparency and review by human team members."),
    body("\u2022  Physical discussions \u2014 in-person conversations at the company premises, used for complex design decisions, whiteboard sessions, and integration planning."),
    body("\u2022  Phone calls \u2014 used for urgent coordination outside of normal working hours, particularly during the final integration push before each presentation."),
    body("\u2022  Zoom meetings \u2014 used for synchronous discussions when team members were working remotely or when cross-university coordination was required."),

    h2("5.3 Achievements and Contributions"),
    body(
      "Through the team experience, I gained significant experience in teamwork, solving real-world problems, advancing my use of trending technologies (particularly agentic AI), and following the right software development life cycle from requirements through to production. The pair-based ownership model helped me understand how to balance individual mastery with cross-team collaboration, and the weekly supervision meetings taught me how to present progress, accept feedback, and incorporate review notes into the next iteration.",
    ),
    body(
      "A specific achievement worth highlighting was my selection, due to my commitment and communication skills, to participate in and contribute to real client-facing projects of the company that were still in development at the time of writing this report. This opportunity was extended to me based on the trust I had built through my work on the main team project and through my role as the communication lead on the interns' side. I am continuing to collaborate on these projects beyond the formal end of the internship.",
    ),

    h2("5.4 Disagreements, Misunderstandings, and Coordination Problems"),
    body(
      "Not every collaborative experience was smooth. A recurring challenge was that sometimes one of us would try to dominate the team's flow and work only as they wanted, thinking they were correct and others should follow their way. This tendency to set the path for others and insist on a single direction could create disagreements among teammates and slow down the broader effort.",
    ),
    body(
      "We resolved this type of problem through discussion, sometimes repeatedly, until we reached a shared understanding. If the disagreement was too far apart to be resolved internally, we would escalate to the company leadership to fix the issue and guide us on the best alternative. Through this process, we learned to value team spirit over individual preference, to separate the person from the technical position, and to make decisions based on evidence and shared contracts rather than on force of personality.",
    ),

    h2("5.5 Time Management, Deadlines, Priorities, Attendance, and Punctuality"),
    body(
      "My approach to time management was straightforward: if I had a task to do and I was not yet expert on it, I would first learn the unfamiliar aspects by managing my time and using any available resources, and then, after gaining sufficient experience, I would work on the actual project while keeping priority, time management, and punctuality in focus. The company's flexible working culture, which focused on project completion rather than on rigid attendance, supported this approach as long as the deliverables met the agreed deadlines.",
    ),
    body(
      "For each project, the company provided a final submission date and a presentation day, on which we would demonstrate the work, check integration issues, and fix any defects identified during review. I made a point of attending all scheduled meetings, arriving on time for presentations, and communicating any anticipated delays as early as possible. This discipline was particularly important given that other teams depended on the contracts I was responsible for: a delay on my side could cascade into delays for Teams 4, 5, and 7 during the integration phase.",
    ),

    h2("5.6 Feedback Received and How I Acted on It"),
    body(
      "I was appreciated by the company leadership for my activeness in utilising new technology advancements on our projects, particularly in artificial intelligence. The feedback specifically highlighted my willingness to deploy agentic AI systems for tasks outside our group's primary expertise, my role as the communication lead on the interns' side, and my contributions to the OCR-based payment screenshot verification flow.",
    ),
    body(
      "I acted on this feedback in two ways. First, I doubled down on AI-related work: I began exploring more advanced agentic AI patterns, I started using AI agents for security review of sensitive flows, and I developed personal projects (Azmera, in particular) that integrated AI more deeply than the company's main project required. Second, after receiving this feedback, I now plan to side with AI and AI engineering for my future specialisation, building on the foundation laid during the internship. The combination of positive reinforcement and clear direction from the company leadership helped me convert a general interest in AI into a concrete career orientation.",
    ),

    h2("5.7 Professional Behaviour, Workplace Ethics, and Communication Habits Developed"),
    body(
      "Several professional behaviours and workplace ethics were developed during the internship. Politeness was a baseline expectation: I learned to communicate respectfully with the company leadership, senior developers, fellow interns, and external stakeholders, regardless of the technical disagreement at hand. Team spirit was cultivated through the pair-based ownership model and through the shared accountability for cross-team integration.",
    ),
    body(
      "Communication was developed into a deliberate practice: I learned to translate between technical and non-technical stakeholders, to escalate issues with appropriate context and proposed solutions, and to document decisions so that they could be reviewed later. Team leadership emerged as an unexpected growth area: as the communication lead on the interns' side, I had to coordinate cross-team discussions, facilitate disagreement resolution, and ensure that every team's voice was heard in the broader planning process. These habits now form the foundation of how I approach professional software engineering work, and they will continue to shape my career beyond the internship.",
    ),
  ];
}

// =====================================================================
// CHAPTER 6: PROJECT HIGHLIGHTS
// =====================================================================

function buildChapter6() {
  return [
    h1("Chapter Six: Project Highlights"),

    h2("6.1 Overview"),
    body(
      "During the internship period, I worked on three significant projects that demonstrated the range of skills I acquired and applied. The first is the membership management system modernisation at Afronex (the team project, described in Chapter 3 with confidentiality constraints). The second and third are my personal production-grade projects: Temariware, a Telegram Mini App for university student job matching, and Azmera, a full-stack agricultural marketplace platform for the Ethiopian market. Both personal projects are now live in production and represent the application of internship-learned skills to problems I am personally passionate about.",
    ),
    body(
      "This chapter highlights the two personal projects in detail. The company project cannot be described in the same level of detail due to confidentiality, but its key technical contributions were summarised in Chapter 3 (Section 3.3.2). For each personal project, I describe the problem it addresses, my role, the technologies used, the challenges faced, and how they were overcome.",
    ),

    h2("6.2 Personal Project Highlight: Temariware"),
    h3("6.2.1 Problem Statement"),
    body(
      "Youth unemployment is one of the most pressing socio-economic challenges facing Ethiopia today. University students often struggle to find part-time employment that matches their skills, despite a steady demand for tutoring, freelance, and part-time labour in cities and towns across the country. Although job opportunities are regularly broadcast through informal Telegram channels such as Afriwork and Yegna Tutors Harrar, the lack of a structured platform means that opportunities are easily missed, applicants cannot be reliably verified, and employers have no way to manage applications or collect fees in a transparent manner.",
    ),

    h3("6.2.2 Solution"),
    body(
      "Temariware is a Telegram Mini App combined with a Telegram Bot that addresses these gaps by providing a single, multilingual platform where Ethiopian university students can browse verified jobs, apply with their academic profile, and pay a confirmation fee through a screenshot-based verification flow, while employers can post jobs, review applicant documents (National ID, University ID, and last semester grade report), accept candidates, and have the platform automatically close positions once hiring targets are met. The bot, accessible as @temariwarebot, exposes slash commands and pushes instant job alerts to subscribers, while the @TEMARIWARE channel automatically receives richly-formatted job cards every time an administrator approves a new posting.",
    ),

    h3("6.2.3 Technologies Used"),
    body("The complete Temariware stack is built on free-tier infrastructure:"),
    body("\u2022  Mini App (UI): Next.js 16 with App Router, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui component library."),
    body("\u2022  Bot (alerts, commands): Telegram Bot API via webhook."),
    body("\u2022  Database: Prisma ORM 6 with PostgreSQL hosted on Neon (Frankfurt region, free 500 MB tier)."),
    body("\u2022  Hosting: Vercel free tier with global CDN and automatic HTTPS."),
    body("\u2022  Authentication: Telegram WebApp initData HMAC-SHA256 validation, ensuring every user is a real Telegram account holder."),
    body("\u2022  Languages: English, Amharic (\u1A0D\u121B\u129B), and Afaan Oromoo with runtime switching."),

    h3("6.2.4 My Role"),
    body(
      "Temariware is a solo project: I am the sole developer, designer, and operator. I designed the database schema (seven primary models: User, Job, Application, Subscription, VerificationRequest, Setting, Payment), implemented the full Mini App with six views (Home, Job Detail, Post Job, Applications, Profile, Admin), built the Telegram bot webhook with nine slash commands, configured the channel broadcast pipeline, and deployed the entire system to production on Vercel. The project is now live, accepting real users, and broadcasting approved jobs to the @TEMARIWARE channel automatically.",
    ),

    h3("6.2.5 Challenges Faced and Overcome"),
    body(
      "Several challenges were encountered during the development of Temariware. First, Telegram does not support web_app inline buttons in channel posts, only URL buttons; this constraint required redesigning the channel broadcast layout to use URL buttons that route users through the bot chat rather than directly into the Mini App. Second, the mandatory document upload (National ID, University ID, grade report) required client-side image compression to keep the database rows small; the solution was an HTML Canvas API-based compression helper that resizes images to a maximum of 800 pixels wide with JPEG quality 0.7, reducing image size from megabytes to approximately 50-150 kilobytes per image.",
    ),
    body(
      "Third, the screenshot-based payment verification flow required careful design to balance user friction with auditability: the flow was structured as a multi-step state machine (PENDING \u2192 ACCEPTED \u2192 PAYMENT_PENDING \u2192 HIRED), with each transition triggering appropriate notifications to the affected parties. Fourth, the automatic job closure when positions are filled required transactional logic to ensure that the filledPositions counter could not be exceeded even under concurrent payment approvals. All four challenges were overcome and the system is now in production.",
    ),

    h2("6.3 Personal Project Highlight: Azmera"),
    h3("6.3.1 Problem Statement"),
    body(
      "The Ethiopian agricultural sector employs a significant portion of the population, yet the supply chain between farmers and buyers is fragmented, opaque, and dominated by middlemen who capture a disproportionate share of the value. Farmers often lack access to fair market prices, buyers struggle to source produce reliably, and supporting actors such as transporters, storage providers, educators, and tool sellers have no unified platform to offer their services. The result is significant inefficiency and lost value across the agricultural ecosystem.",
    ),

    h3("6.3.2 Solution"),
    body(
      "Azmera is a full-stack, production-grade agritech platform built for the Ethiopian market. It connects farmers, buyers, transporters, storage providers, educators, and tool sellers on a single digital ecosystem. The core mission is to eliminate middlemen, ensure fair pricing, and digitise the end-to-end agricultural supply chain. The platform supports seven distinct user roles, each with a dedicated dashboard: Farmer (list produce, track sales, use AI advisor, manage IoT devices), Buyer (browse market, place orders, join group purchases, track deliveries), Transporter (accept delivery jobs, manage routes, get verified via license/documents), Storage Provider (list cold storage/warehouse facilities, manage bookings), Educator (create courses, offer consultations, earn from teaching), Tool Seller (list agricultural equipment and tools), and Admin (full platform governance, user verification, dispute resolution). Role switching is supported with an approval workflow in which the admin reviews role change requests.",
    ),

    h3("6.3.3 Technologies Used"),
    body("Azmera is built on a modern, production-grade technology stack:"),
    body("\u2022  Framework: Next.js 15 with App Router and Turbopack."),
    body("\u2022  Language: TypeScript."),
    body("\u2022  Database: PostgreSQL via Prisma ORM (SQLite for local development)."),
    body("\u2022  Authentication: NextAuth v4 with Prisma adapter, bcrypt, two-factor authentication using TOTP via Speakeasy."),
    body("\u2022  AI: Google Genkit and @genkit-ai/googleai, LangChain, and Anthropic integrations."),
    body("\u2022  Payments: Chapa (primary), Telebirr, and a custom escrow engine."),
    body("\u2022  UI: Radix UI, Tailwind CSS, and the shadcn/ui component library."),
    body("\u2022  State and Data Fetching: TanStack Query v5."),
    body("\u2022  Charts: Recharts."),
    body("\u2022  Internationalisation: next-intl with five languages."),
    body("\u2022  Email: Resend with React Email templates."),
    body("\u2022  OCR: Tesseract.js."),
    body("\u2022  PWA: next-pwa with Workbox."),
    body("\u2022  Containerisation: Docker and Docker Compose (development and production configurations)."),
    body("\u2022  Logging: Pino and Winston."),

    h3("6.3.4 My Role"),
    body(
      "Azmera is also a solo project in which I am the sole developer and architect. I designed the multi-role data model, implemented the seven role-specific dashboards, integrated the Chapa and Telebirr payment flows with a custom escrow engine, built the AI advisor feature using Google Genkit, and configured the containerisation pipeline for both development and production. The platform is currently in live production and is being refined based on user feedback.",
    ),

    h3("6.3.5 Challenges Faced and Overcome"),
    body(
      "The most significant challenge in Azmera was designing a single data model that could serve seven distinct user roles without becoming unwieldy. The solution was a polymorphic user model in which a single User record could hold one or more role profiles (Farmer, Buyer, Transporter, etc.), with role switching gated by an admin approval workflow. A second challenge was the escrow engine: holding funds in a neutral state until delivery confirmation required careful transactional design to prevent double-spending and to handle refund scenarios. A third challenge was internationalisation across five languages, which required externalising all UI strings and ensuring that the layout could accommodate languages with significantly different text lengths.",
    ),
  ];
}

// =====================================================================
// CHAPTER 7: LEARNING AND GROWTH
// =====================================================================

function buildChapter7() {
  return [
    h1("Chapter Seven: Learning and Growth"),

    h2("7.1 New Skills Acquired"),
    body(
      "During the four-month internship at Afronex, I acquired a broad range of new skills spanning technical, methodological, and professional dimensions. Technically, I deepened my proficiency in React and TypeScript, learned the Django and Odoo frameworks for Python-based web development, became familiar with the Telegram Bot API and Mini App framework, and gained practical experience with Prisma ORM and PostgreSQL database design. I also developed practical skills in AI-assisted engineering: prompt engineering for code scaffolding, agentic AI deployment for scoped tasks, and the use of OCR libraries for payment verification.",
    ),
    body(
      "Methodologically, I learned how an Agile development process actually works in a professional environment: iterative development with weekly review, shared contracts across teams, dependency-ordered team allocation, and structured pull request review. I learned how to write plan and checklist documents that other teams could rely on as authoritative references, and I learned how to participate constructively in cross-team integration sessions.",
    ),
    body(
      "Professionally, I developed communication skills through my role as the company's communication lead on the interns' side, leadership skills through coordinating cross-team discussions and facilitating disagreement resolution, and time management skills through the company's flexible working culture. I also developed a business-aware mindset that now shapes how I evaluate technical decisions, as described in the next section.",
    ),

    h2("7.2 The Shift from Code Correctness to Business Logic Thinking"),
    body(
      "The most significant intellectual growth during the internship was a shift in my mindset from asking \u201Cis the system running without errors?\u201D to asking \u201Chow can I generate income or build the business logic behind each feature of the project?\u201D This shift was prompted by the guidance I received from the company leadership, particularly Mr. Tsegaw, who consistently challenged me to consider the business value of my technical decisions rather than just their technical correctness.",
    ),
    body(
      "Working on the business logic behind each feature required the most guidance for me. Before the internship, I had focused almost exclusively on whether the system ran without errors: if the code compiled, the tests passed, and the UI rendered correctly, I considered the work done. Through the guidance I received, I learned to ask additional questions: who pays for this feature, and how? What happens if the payment fails? What audit trail is required for compliance? How does this feature reduce operational effort for the client? After receiving this guidance, I am now somewhat business-minded while coding, and I evaluate technical decisions not only for their correctness but also for their contribution to the business. This shift is, in my view, the single most valuable learning outcome of the internship.",
    ),

    h2("7.3 Independent Ability Demonstrated"),
    body(
      "Three tasks best demonstrate my independent ability during the internship. First, researching and advancing features: when I encountered a feature area that was unfamiliar, I would independently research the available options, propose an implementation approach, and advance the feature through review. Second, developing and monitoring agentic AI to perform specific tasks: I deployed AI agents for scoped activities such as code scaffolding and security review, monitored their output, and integrated the validated results into the team's work. Third, checking for security issues like confidentiality: I developed a habit of reviewing sensitive flows, particularly around payment handling and member data, for potential confidentiality breaches and proposing mitigations.",
    ),

    h2("7.4 Hackathon Participation"),
    body(
      "During the internship period, I participated in the Cursor Hackathon held at Haramaya University, which brought together participants from multiple universities across Ethiopia. The hackathon was a high-intensity, time-boxed competition that tested my ability to apply software engineering skills under pressure and to collaborate with peers I had not worked with before. I received a certificate of participation for this event, which is included in the appendices. The hackathon experience reinforced several lessons from the internship: the value of clear communication under time pressure, the importance of prioritising features that deliver value quickly, and the satisfaction of building something that works end-to-end within a constrained timeframe.",
    ),

    h2("7.5 Workshops, Training, and Continuous Learning"),
    body(
      "Beyond the hackathon, there were no formal certifications or structured training programmes during the internship. However, learning was continuous and informal: weekly supervision meetings served as training sessions in which the company leadership reviewed our work and shared insights from their own experience; code review feedback from senior developers served as on-the-job training in best practices; and presentation review sessions helped me develop the skill of communicating technical work to non-technical audiences. In addition, I engaged in self-directed learning throughout the internship, particularly in the area of agentic AI, where I explored patterns for deploying and monitoring AI agents in software development workflows. This self-directed learning directly informed my personal projects, both of which integrate AI capabilities that go beyond what the company's main project required.",
    ),
  ];
}

module.exports = { buildChapter5, buildChapter6, buildChapter7 };
