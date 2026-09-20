// Internship Report — Chapter 8 (Challenges) + Chapter 9 (Contribution) + Chapter 10 (Conclusion)
// + References + Appendices + Main Document Assembly

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  NumberFormat, SectionType, BorderStyle, ShadingType,
  convertInchesToTwip, TableOfContents,
  Table, TableRow, TableCell, WidthType,
} = require("docx");
const fs = require("fs");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  buildTOC,
  FONT, SIZE_BODY, SIZE_H1, SIZE_H2, SIZE_H3, LINE_SPACING_15,
  MARGIN_TOP, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_RIGHT,
  PAGE_WIDTH, PAGE_HEIGHT,
} = require("./generate-project-doc.js");
const { buildCover, buildAcknowledgment, buildAcronyms, buildChapter1, buildChapter2 } = require("./internship-front.js");
const { buildChapter3, buildChapter4 } = require("./internship-ch3-4.js");
const { buildChapter5, buildChapter6, buildChapter7 } = require("./internship-ch5-7.js");

// =====================================================================
// CHAPTER 8: CHALLENGES FACED AND SOLUTIONS
// =====================================================================

function buildChapter8() {
  return [
    h1("Chapter Eight: Challenges Faced and Solutions"),

    h2("8.1 Main Difficulties Encountered"),
    body(
      "Several difficulties were encountered during the internship, both technical and professional. The most significant technical challenge was working with frameworks that the company wanted me to use, particularly when I had previous experience with a different framework for the same problem domain. For example, my personal preference for the Django framework (because of its Python compatibility with the AI ecosystem) sometimes conflicted with the company's preference for React and TypeScript on the main project. Bridging this gap required me to invest additional time in learning the company's preferred stack to a production-ready level, while preserving my Django expertise for personal projects where it was the right tool.",
    ),
    body(
      "Other technical challenges commonly faced by interns, several of which I experienced personally, included: understanding and navigating large existing codebases with limited documentation; integrating features across module boundaries when shared contracts were still in flux; debugging issues that spanned frontend, backend, and database layers; managing environment configuration across development, staging, and production; and handling the inherent uncertainty of AI agent outputs when using them for code scaffolding and security review. Each of these challenges required a combination of independent problem-solving and timely escalation to senior developers when the issue exceeded my current expertise.",
    ),
    body(
      "On the professional side, the most significant challenge was the shift from a purely technical mindset to a business-aware mindset, as described in Chapter 7. Working for the business logic behind each feature required the most guidance for me, because my academic training had focused almost exclusively on the technical correctness of code rather than on its commercial viability. Additional professional challenges included managing communication across cross-functional teams with different working styles, handling disagreements constructively without dominating the discussion, and balancing the depth of feature ownership with the breadth of cross-team awareness required for effective integration.",
    ),

    h2("8.2 How I Overcame Them"),
    body(
      "I overcame these challenges through a combination of self-directed learning, structured mentorship, and disciplined practice. When I encountered an unfamiliar framework, I trained myself using the resources shared by the company: the developer-prompt.md file, the plan and checklist documents, internal code examples, and external documentation. I made a habit of reading the existing codebase before writing any new code, so that my contributions would be consistent with established conventions rather than introducing yet another style.",
    ),
    body(
      "When I encountered integration challenges across module boundaries, I escalated to the company leadership or to senior developers for guidance, while preparing a clear description of the problem and the options I had already considered. This preparation was important: it demonstrated that I had invested effort in solving the problem independently, and it allowed the senior developer to provide targeted guidance rather than a generic explanation. For AI agent outputs, I developed a validation pipeline: every AI-generated artefact was reviewed by a human team member, checked against the project's conventions, and only integrated after passing both automated and manual review.",
    ),
    body(
      "For the business-logic mindset shift, I sought out conversations with the company leadership about how each feature generated revenue or reduced operational effort. I made a point of asking \u201Cwhy does this feature matter to the client?\u201D during planning discussions, and I began to evaluate my own technical proposals against business criteria (cost, revenue, risk, operational efficiency) rather than only against technical criteria (correctness, performance, maintainability). Over the four months, this practice gradually shifted my default mindset, and I now evaluate technical decisions through both lenses by default.",
    ),

    h2("8.3 What I Learned from These Challenges"),
    body(
      "The challenges I faced during the internship taught me several durable lessons. First, the right framework for a project depends on the project's context, not on the developer's personal preference: a framework that is excellent for a personal AI project may be the wrong choice for a team-based membership management system. Second, integration is the hardest part of multi-team software development, and it is where most of the value of disciplined process (shared contracts, code review, acceptance criteria) becomes visible. Third, business awareness is not optional for a software engineer: code that is technically correct but commercially irrelevant is, in most professional contexts, a failure.",
    ),
    body(
      "Fourth, AI agents are powerful tools but they are not a substitute for engineering judgement: their output must be reviewed, validated, and integrated by a human who understands the project's context and conventions. Fifth, communication is a first-class engineering skill: the ability to describe a problem clearly, propose options, and accept feedback constructively is at least as valuable as the ability to write correct code. These lessons will shape my approach to software engineering for the remainder of my career.",
    ),

    h2("8.4 Risk Management and Decision-Making"),
    body(
      "An additional challenge worth noting is the risk-management decision we made as an intern cohort regarding the location of our internship. We were advised by the school to consider travelling to the capital city (Addis Ababa) and communicating with larger companies there. However, after weighing the additional challenges and risks of relocation (housing, cost of living, distance from family, unfamiliarity with the city), we chose to remain in Dire Dawa and join Afronex, which we assessed to be the best technology company in the region. In retrospect, this decision was correct: the quality of mentorship, the depth of the project work, and the cultural fit at Afronex all exceeded our expectations, and the risks we avoided by staying local were significant. The lesson here is that risk management in career decisions should consider not only the prestige of the opportunity but also the holistic fit with one's circumstances and learning goals.",
    ),
  ];
}

// =====================================================================
// CHAPTER 9: CONTRIBUTION TO THE ORGANIZATION
// =====================================================================

function buildChapter9() {
  return [
    h1("Chapter Nine: Contribution to the Organization"),

    h2("9.1 Recommended Features Now in Use"),
    body(
      "Several recommended features I proposed during the internship, both on the projects we were working on and on the way the company acts, are now in use by the organisation. These recommendations ranged from specific feature ideas for the membership management system to broader suggestions for how the company could integrate AI more deeply into its development workflow. The fact that these recommendations were adopted and are now being tested for production validates the value of the internship programme not only as a learning experience for the intern but also as a source of fresh perspectives and innovations for the host company.",
    ),
    body(
      "Specific examples of adopted recommendations, while kept general for confidentiality, include: improvements to the manual payment confirmation workflow that reduced the time required for review; refinements to the OCR-based screenshot verification pipeline that improved extraction accuracy; and suggestions for how agentic AI could be deployed for selected development activities in a way that preserved human oversight. These contributions demonstrate that interns can add real value to a host organisation when they are given ownership of meaningful features and a structured process for proposing improvements.",
    ),

    h2("9.2 Production-Ready Code and Deliverables"),
    body(
      "The code I wrote during the internship, particularly within Team 6 (Payments and Subscriptions), is now being tested by the company for production deployment. The deliverables I handed over included: the frontend implementation of the manual payment confirmation workflow; the integration code for the OCR-based screenshot verification pipeline; the design and implementation of the payment status normalization rules; documentation of the payment audit trail; and plan and checklist documents that other team members and future interns could reference. The code followed the company's established conventions for branching, review, and integration, and it passed the acceptance criteria defined by Team 7 (Member Experience and Integration QA) during the integration phase.",
    ),
    body(
      "Beyond the code itself, I contributed to the organisation's knowledge base through the documentation I produced. The plan and checklist documents I authored for my feature areas were structured to be reusable by future interns, with clear descriptions of the problem, the chosen solution, the alternatives considered, and the acceptance criteria. This documentation represents a form of organisational memory that will outlast my internship and will help future team members understand the reasoning behind the implementation decisions I made.",
    ),

    h2("9.3 Ongoing Collaboration Beyond the Internship"),
    body(
      "For my commitment and communication during the internship, I was given the opportunity to participate in and contribute to real client-facing projects of the company that are still in development at the time of writing this report. I am continuing to collaborate on these projects beyond the formal end of the internship, which represents an extension of the trust the company placed in me based on my performance. This ongoing collaboration is, in my view, the strongest evidence that my contributions added genuine value to the organisation, and it provides a pathway for continued professional growth as I transition from intern to contributing engineer.",
    ),

    h2("9.4 Documentation and Knowledge Transfer"),
    body(
      "In addition to the feature-specific documentation mentioned above, I contributed to the broader knowledge transfer within the intern cohort. As the communication lead on the interns' side, I prepared general presentations to show our progress and achievements to the company leadership and to fellow interns. These presentations served not only as progress reports but also as opportunities for cross-team learning: when one team presented their approach to a difficult problem, other teams could adopt or adapt the same approach for their own work. I also participated in onboarding discussions with new interns who joined the cohort after me, sharing the conventions, tools, and lessons I had learned to help them ramp up more quickly.",
    ),
  ];
}

// =====================================================================
// CHAPTER 10: CONCLUSION AND RECOMMENDATIONS
// =====================================================================

function buildChapter10() {
  return [
    h1("Chapter Ten: Conclusion and Recommendations"),

    h2("10.1 Summary of Overall Experience"),
    body(
      "The four-month internship at Afronex Tech Company was a transformative experience that bridged the gap between my academic training at Dire Dawa University and the practical demands of professional software engineering. I worked on a real client-facing project (the membership management system modernisation), contributed to additional company projects (an AI care system in Django and an accounting and inventory subsystem in Odoo), developed two personal production-grade projects (Temariware and Azmera), participated in a hackathon at Haramaya University, and built durable professional relationships with the company leadership, senior developers, and fellow interns.",
    ),
    body(
      "The most significant learning outcomes were: the shift from a purely technical mindset to a business-aware mindset; the development of communication and leadership skills through my role as the interns' communication lead; the practical experience of working within an Agile, multi-team development process with shared contracts and dependency-ordered team allocation; and the confidence that comes from having one's code tested for production deployment. The experience also confirmed my interest in artificial intelligence and agentic AI systems, which I now plan to pursue as my primary specialisation going forward.",
    ),

    h2("10.2 Suggestions for Improving Future Internship Programmes"),
    body(
      "Based on my experience, I offer the following suggestions for improving future internship programmes, both at Afronex and at the university level. First, the university could provide more structured guidance on company selection, including a curated list of partner companies with documented track records of accepting interns and providing meaningful work. While we made a good decision in joining Afronex, the decision was made with limited information, and a more structured process would reduce the risk for future cohorts.",
    ),
    body(
      "Second, the university could establish a formal feedback loop between interns and the host companies, in which mid-internship and end-of-internship feedback is collected from both sides and used to improve the programme. Third, the host company could formalise the onboarding process for interns by providing a written guide to its conventions, tools, and expectations on the first day, rather than relying on interns to absorb this information through observation over the first few weeks. Fourth, both the university and the host company could provide more structured opportunities for cross-cohort networking, so that interns can learn from the experiences of those who came before them.",
    ),

    h2("10.3 Recommendations for Future Interns"),
    body(
      "For future interns who will follow me at Afronex or at similar companies, I offer the following recommendations based on what I learned. First, do not wait to be told what to do: take ownership of your learning from day one, read the shared documentation, and ask questions early. The company's flexible working culture rewards initiative but penalises passivity. Second, balance depth with breadth: master the features you own, but also understand how they connect to the broader system. Third, cultivate a business-aware mindset from the beginning: ask why each feature matters, not just how to implement it.",
    ),
    body(
      "Fourth, embrace AI as a tool but do not abdicate engineering judgement to it: review every AI-generated artefact, validate it against the project's conventions, and integrate it only when you are confident it is correct. Fifth, communicate proactively: if you are stuck, say so early; if you see a problem, raise it with a proposed solution; if you have an idea, share it. Sixth, document your work as if a future intern will need to understand it without your help, because they probably will. Finally, build personal projects outside of the company's work, because they are where you can apply your skills to problems you are personally passionate about and where you can experiment with technologies that the company's main project may not yet require.",
    ),

    h2("10.4 How This Internship Will Impact My Future Career"),
    body(
      "I had very important communication with the company and with others during the internship, and I gained practical experience of working in teams on real-world problems. As a result, I am sure that something interesting is coming in the future. The internship has shaped my career direction in three concrete ways. First, it has confirmed my interest in artificial intelligence and agentic AI systems, and I now plan to specialise in AI engineering for my future career. Second, it has given me the confidence that I can build production-grade software from scratch, as demonstrated by my two live personal projects (Temariware and Azmera). Third, it has given me a professional network that I will continue to draw on as I progress in my career.",
    ),
    body(
      "In the immediate term, I plan to continue my collaboration with Afronex on the client-facing projects I am currently contributing to, while further developing my personal projects and exploring deeper AI integrations. In the medium term, I plan to pursue graduate studies or professional certifications in AI engineering, building on the foundation laid during the internship. In the long term, I aspire to build a technology company of my own in Ethiopia, applying the lessons learned at Afronex about how to combine technical depth, business awareness, and a culture of mentorship. The internship has been the single most formative experience of my undergraduate education, and its impact will be felt for many years to come.",
    ),
  ];
}

// =====================================================================
// REFERENCES
// =====================================================================

function buildReferences() {
  return [
    h1("References"),
    empty(),
    body("[1]  Afronex Tech Company. (2018 E.C). Internal Developer Documentation: Membership Management System Modernisation. [Internal document, generalised for confidentiality]."),
    body("[2]  Afronex Tech Company. (2018 E.C). Team Allocation and Ownership Matrix. [Internal document: team-allocation-7-teams.md]."),
    body("[3]  Afronex Tech Company. (2018 E.C). Developer Prompt: Shared Conventions and Standards. [Internal document: developer-prompt.md]."),
    body("[4]  Afronex Tech Company. (2018 E.C). Delivery Roadmap: Membership Management System. [Internal document: delivery-roadmap.md]."),
    body("[5]  Afronex Tech Company. (2018 E.C). Payments and Subscriptions Plan. [Internal document: payments-subscriptions-plan.md]."),
    body("[6]  Dire Dawa University. (2024). Project Guideline for Industrial Project. Department of Information Technology, School of Computing, Dire Dawa University Institute of Technology."),
    body("[7]  Telegram. (2024). Telegram Bot API Documentation. [Online]. Available: https://core.telegram.org/bots/api [Accessed: 10/10/2018 E.C]."),
    body("[8]  Telegram. (2024). Telegram Mini Apps \u2014 Web Apps. [Online]. Available: https://core.telegram.org/bots/webapps [Accessed: 10/10/2018 E.C]."),
    body("[9]  Vercel Inc. (2024). Next.js 16 Documentation. [Online]. Available: https://nextjs.org/docs [Accessed: 10/10/2018 E.C]."),
    body("[10] Prisma. (2024). Prisma ORM Documentation. [Online]. Available: https://www.prisma.io/docs [Accessed: 10/10/2018 E.C]."),
    body("[11] Django Software Foundation. (2024). Django Documentation. [Online]. Available: https://docs.djangoproject.com [Accessed: 10/10/2018 E.C]."),
    body("[12] Odoo S.A. (2024). Odoo Documentation. [Online]. Available: https://www.odoo.com/documentation [Accessed: 10/10/2018 E.C]."),
    body("[13] React. (2024). React 19 Documentation. [Online]. Available: https://react.dev [Accessed: 10/10/2018 E.C]."),
    body("[14] Microsoft. (2024). TypeScript Handbook. [Online]. Available: https://www.typescriptlang.org/docs/handbook [Accessed: 10/10/2018 E.C]."),
    body("[15] Tailwind Labs. (2024). Tailwind CSS Documentation. [Online]. Available: https://tailwindcss.com/docs [Accessed: 10/10/2018 E.C]."),
    body("[16] GitHub. (2024). GitHub Documentation: Pull Requests and Code Review. [Online]. Available: https://docs.github.com [Accessed: 10/10/2018 E.C]."),
    body("[17] Smith, T. (2023). Tesseract OCR: Open Source Optical Character Recognition. [Online]. Available: https://github.com/tesseract-ocr/tesseract [Accessed: 10/10/2018 E.C]."),
    body("[18] EasyOCR. (2023). Ready-to-use OCR with 80+ supported languages. [Online]. Available: https://github.com/JaidedAI/EasyOCR [Accessed: 10/10/2018 E.C]."),
    body("[19] Ethio Telecom. (2024). Telebirr Mobile Payment Service. [Online]. Available: https://www.ethiotelecom.et/telebirr [Accessed: 10/10/2018 E.C]."),
    body("[20] National ID Program Ethiopia. (2024). Fayda: Ethiopia's National Digital ID. [Online]. Available: https://id.et [Accessed: 10/10/2018 E.C]."),
    body("[21] Chapa Financial Technologies. (2024). Chapa Payment API Documentation. [Online]. Available: https://developer.chapa.co [Accessed: 10/10/2018 E.C]."),
    body("[22] Pressman, R. S. (2014). Software Engineering: A Practitioner's Approach (8th ed.). McGraw-Hill Education, New York."),
    body("[23] Sommerville, I. (2015). Software Engineering (10th ed.). Pearson, Boston."),
    body("[24] Booch, G., Rumbaugh, J., and Jacobson, I. (2005). The Unified Modeling Language User Guide (2nd ed.). Addison-Wesley Professional, Boston."),
    body("[25] Beck, K. et al. (2001). Manifesto for Agile Software Development. [Online]. Available: https://agilemanifesto.org [Accessed: 10/10/2018 E.C]."),
    body("[26] Fowler, M. (2002). Patterns of Enterprise Application Architecture. Addison-Wesley Professional, Boston."),
    body("[27] Hoffer, J. A., Venkataraman, R., and Topi, H. (2016). Modern Database Management (12th ed.). Pearson, Boston."),
    body("[28] Lewis, M. P. (Ed). (2009). Ethnologue: Languages of the World (Sixteenth edition). [Online]. Available: https://www.ethnologue.com [Accessed: 10/10/2018 E.C]."),
    body("[29] World Bank. (2023). Ethiopia Economic Update: The Role of Digital Technology in Youth Employment. [Online]. Available: https://www.worldbank.org/en/country/ethiopia [Accessed: 10/10/2018 E.C]."),
    body("[30] Nebiyu Tsegaye. (2018 E.C). Temariware: A Telegram Mini App for University Student Job Matching in Ethiopia. [Personal project]. Available: https://t.me/temariwarebot."),
  ];
}

// =====================================================================
// APPENDICES
// =====================================================================

function buildAppendices() {
  return [
    h1("Appendices"),
    empty(),

    h2("Appendix A: Weekly Log Summary"),
    body(
      "This appendix summarises the weekly activities during the four-month internship period. The summary is organised by month, with key milestones and deliverables noted for each week. A detailed daily log is available separately as a supplementary document.",
    ),
    // Appendix A — Weekly log table
    caption("Table A.1: Weekly Activity Log Summary"),
    buildWeeklyLogTable(),

    h2("Appendix B: Certificate of Participation"),
    body(
      "This appendix contains the certificate of participation awarded for the Cursor Hackathon held at Haramaya University during the internship period. The certificate recognises participation in the competitive software development event alongside students from multiple universities across Ethiopia.",
    ),
    body("[Insert certificate image here \u2014 the certificate is a scanned PDF/PNG document that should be embedded at this location in the final printed report.]"),

    h2("Appendix C: Personal Project \u2014 Temariware Architecture"),
    body(
      "This appendix contains a brief architectural summary of the Temariware personal project, including the deployment topology and the data model. A complete senior project proposal document for Temariware is available separately.",
    ),
    body("\u2022  Bot: @temariwarebot on Telegram (live, accepting users)"),
    body("\u2022  Channel: @TEMARIWARE (broadcasts working)"),
    body("\u2022  Mini App URL: https://temariware-rouge.vercel.app (Vercel production)"),
    body("\u2022  Database: Neon Postgres (Frankfurt, eu-central-1 region)"),
    body("\u2022  Hosting: Vercel free tier with global CDN"),
    body("\u2022  Authentication: Telegram WebApp initData HMAC-SHA256 validation"),
    body("\u2022  Languages supported: English, Amharic (\u1A0D\u121B\u129B), Afaan Oromoo"),
    body("\u2022  Total monthly cost: 0 ETB (entirely free-tier infrastructure)"),
    body("\u2022  Data model: 7 primary entities (User, Job, Application, Subscription, VerificationRequest, Setting, Payment)"),
    body("\u2022  Mini App views: 6 (Home, Job Detail, Post Job, Applications, Profile, Admin)"),
    body("\u2022  Bot commands: 9 (/start, /latest, /search, /subscribe, /unsubscribe, /myapps, /postjob, /admin, /help)"),

    h2("Appendix D: Personal Project \u2014 Azmera Architecture"),
    body(
      "This appendix contains a brief architectural summary of the Azmera personal project, including the technology stack and the supported user roles.",
    ),
    body("\u2022  Framework: Next.js 15 with App Router and Turbopack"),
    body("\u2022  Language: TypeScript"),
    body("\u2022  Database: PostgreSQL via Prisma ORM (SQLite for local development)"),
    body("\u2022  Authentication: NextAuth v4 with Prisma adapter, bcrypt, 2FA (TOTP via Speakeasy)"),
    body("\u2022  AI: Google Genkit and @genkit-ai/googleai, LangChain/Anthropic integrations"),
    body("\u2022  Payments: Chapa (primary), Telebirr, custom escrow engine"),
    body("\u2022  UI: Radix UI + Tailwind CSS + shadcn/ui component library"),
    body("\u2022  State and Data Fetching: TanStack Query v5"),
    body("\u2022  Charts: Recharts"),
    body("\u2022  Internationalisation: next-intl with 5 languages"),
    body("\u2022  Email: Resend with React Email templates"),
    body("\u2022  OCR: Tesseract.js"),
    body("\u2022  PWA: next-pwa with Workbox"),
    body("\u2022  Containerisation: Docker and Docker Compose (dev and prod configurations)"),
    body("\u2022  Logging: Pino + Winston"),
    body("\u2022  User roles supported: 7 (Farmer, Buyer, Transporter, Storage Provider, Educator, Tool Seller, Admin)"),

    h2("Appendix E: Recommended Images to Include"),
    body(
      "The following images are recommended for inclusion in the final printed and bound version of this report. Each recommendation includes the suggested location and a brief description of what the image should show.",
    ),
    body("\u2022  [Cover page] \u2014 University logo and department logo (already on cover page)."),
    body("\u2022  [Chapter 2, Section 2.3] \u2014 Organisation chart showing the seven-team allocation structure (Figure 2.1)."),
    body("\u2022  [Chapter 3, Section 3.3.2] \u2014 Screenshot of the manual payment confirmation workspace (generalised for confidentiality)."),
    body("\u2022  [Chapter 3, Section 3.3.2] \u2014 Flow diagram of the OCR-based payment screenshot verification pipeline."),
    body("\u2022  [Chapter 6, Section 6.2] \u2014 Screenshots of the Temariware Mini App (Home, Job Detail, Admin views) \u2014 these can be captured from the live deployment at https://temariware-rouge.vercel.app."),
    body("\u2022  [Chapter 6, Section 6.3] \u2014 Architecture diagram of the Azmera platform showing the 7 user roles and their dashboards."),
    body("\u2022  [Appendix B] \u2014 Scan of the Cursor Hackathon certificate of participation."),
    body("\u2022  [Appendix C] \u2014 Deployment diagram of Temariware showing Vercel, Neon, and Telegram Cloud nodes."),
    body("\u2022  [Appendix D] \u2014 Component diagram of Azmera showing the Next.js app, Prisma ORM, PostgreSQL, Chapa, and AI integrations."),
  ];
}

// Helper: Weekly log table
function buildWeeklyLogTable() {
  const rows = [
    ["Month 1 (Sene 2018 EC)", "Onboarding, reading shared documentation, joining Team 6, first feature assignments, learning React + TypeScript conventions"],
    ["Month 2 (Hamle 2018 EC)", "Manual payment confirmation workflow implementation, invoice and receipt workspace, first cross-team integration"],
    ["Month 3 (Nehase 2018 EC)", "OCR-based screenshot verification pipeline, payment status normalization rules, Cursor Hackathon participation"],
    ["Month 4 (Meskerem 2019 EC)", "Integration testing with Team 7, presentation preparation, documentation handover, ongoing client project collaboration"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Period", "Key Activities and Milestones"].map((h) =>
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
            children: [new Paragraph({ alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 22, bold: i === 0 })] })],
          }),
        ),
      })),
    ],
  });
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

function buildEmptyHeader() { return new Header({ children: [new Paragraph({ children: [] })] }); }
function buildEmptyFooter() { return new Footer({ children: [new Paragraph({ children: [] })] }); }

// =====================================================================
// MAIN DOCUMENT ASSEMBLY
// =====================================================================

const REPORT_TITLE = "Software Engineering Internship Report \u2014 Nebiyu Tsegaye (ID 1501332)";

const doc = new Document({
  creator: "Nebiyu Tsegaye",
  title: "Software Engineering Internship Report",
  description: "Internship report submitted to the Department of Software Engineering, Dire Dawa University, in partial fulfillment of the BSc in Software Engineering internship programme.",
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

    // SECTION 2: FRONT MATTER — Roman numerals starting from i
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
        ...buildAcknowledgment(),
        ...buildAcronyms(),
        ...buildTOC(),
      ],
    },

    // SECTION 3: BODY (Chapters 1-10) — Arabic numerals from 1
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
        ...buildChapter4(),
        ...buildChapter5(),
        ...buildChapter6(),
        ...buildChapter7(),
        ...buildChapter8(),
        ...buildChapter9(),
        ...buildChapter10(),
      ],
    },

    // SECTION 4: REFERENCES & APPENDICES — Arabic continued
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
const OUTPUT_PATH = "/home/z/my-project/download/Internship_Report_Nebiyu_Tsegaye.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`\u2713 Document generated: ${OUTPUT_PATH}`);
  console.log(`  Size: ${(stats.size / 1024).toFixed(1)} KB`);
}).catch((err) => {
  console.error("\u2717 Generation failed:", err);
  process.exit(1);
});
