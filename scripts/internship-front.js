// Temariware Internship Report — Front matter (cover, ack, acronyms, TOC) + Chapter 1 + Chapter 2
// Per Dire Dawa University Project Guideline (Times New Roman, A4, 1.5 spacing, custom margins)

const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak, ShadingType,
} = require("docx");
const {
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  FONT, SIZE_BODY, LINE_SPACING_15,
} = require("./generate-project-doc.js");

// =====================================================================
// COVER PAGE — per internship report cover format
// =====================================================================

function buildCover() {
  return [
    centered("DIRE DAWA UNIVERSITY", { bold: true, size: 28 }),
    centered("INSTITUTE OF TECHNOLOGY", { bold: true, size: 26 }),
    centered("SCHOOL OF COMPUTING", { bold: true, size: 26 }),
    centered("DEPARTMENT OF SOFTWARE ENGINEERING", { bold: true, size: 26 }),
    empty(),
    empty(),
    centered("INTERNSHIP REPORT", { bold: true, size: 36 }),
    empty(),
    centered("\u201CSoftware Engineering Internship Presentation\u201D", { bold: true, size: 28, italics: true }),
    empty(),
    empty(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun(
        "A report submitted to the Department of Software Engineering, School of Computing, Dire Dawa University Institute of Technology, in partial fulfillment of the requirements of the internship programme for the Degree of BSc in Software Engineering.",
        { size: 22 },
      )],
    }),
    empty(),
    empty(),
    // Student info table
    new Table({
      width: { size: 80, type: WidthType.PERCENTAGE },
      alignment: AlignmentType.CENTER,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      },
      rows: [
        coverRow("Student Name", "Nebiyu Tsegaye"),
        coverRow("Student ID", "1501332"),
        coverRow("Programme", "BSc in Software Engineering"),
        coverRow("Internship Organization", "Afronex Tech Company"),
        coverRow("Internship Period", "10/06/2018 E.C \u2013 10/10/2018 E.C (4 months)"),
        coverRow("Industry Supervisor", "Mr. Tsegaw (to be confirmed)"),
        coverRow("University Advisor", "[Advisor Name (Title)]"),
        coverRow("Submission Date", "10/01/2019 E.C"),
        coverRow("Presentation Date", "12/01/2019 E.C"),
      ],
    }),
    empty(),
    empty(),
    centered("Dire Dawa, Ethiopia", { size: 22, italics: true }),
  ];
}

function coverRow(label, value) {
  return new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        shading: { type: ShadingType.CLEAR, fill: "F2F2F2", color: "auto" },
        children: [new Paragraph({
          spacing: { line: 240 },
          children: [textRun(label, { bold: true, size: 22 })],
        })],
      }),
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({
          spacing: { line: 240 },
          children: [textRun(value, { size: 22 })],
        })],
      }),
    ],
  });
}

// =====================================================================
// ACKNOWLEDGMENT
// =====================================================================

function buildAcknowledgment() {
  return [
    h1NoBreak("Acknowledgment"),
    empty(),
    body(
      "I would like to express my sincere gratitude to Afronex Tech Company for accepting me as an intern and for creating an environment in which I could learn through meaningful software development activities. The company received us politely, demonstrated how things should be done well, and appreciated us to work collaboratively rather than in isolation. The leadership directed us on how to engage with new technology advancements, particularly in artificial intelligence, and provided us with structured communication channels with senior developers, mentors, and project stakeholders. Throughout the four-month programme, the company taught us how to use modern frameworks for our project work, assigned us real client-facing projects with clear expectations, followed our progress through weekly supervision, and continually encouraged us to advance in software development and AI usage.",
    ),
    body(
      "I am also grateful to my classmates at Dire Dawa University and the interns from other universities, including Haramaya University, who worked alongside me at Afronex. They contributed significantly to this achievement. We worked in collaboration, shared our experiences openly, appreciated each other's journeys, and invested our time and energy in disciplined discussions for every feature in our projects. The cross-university collaboration broadened my perspective on how engineers from different academic backgrounds approach the same problem, and the peer review culture we established improved the quality of every deliverable.",
    ),
    body(
      "I want to say thanks to all supervisors and advisors for their committed advice and supervision. Mr. Tsegaw, the leader of Afronex and a lecturer at Dire Dawa University, was particularly friendly with his students, appreciated us to advance on software development and AI usages given his software engineering background, and guided us patiently as his company shifted focus toward AI-driven solutions. His mentorship shaped my understanding of how technical decisions connect with business value.",
    ),
    body(
      "Finally, I thank my family and everyone who encouraged me throughout the internship. Their support helped me remain committed to learning, communicating respectfully, accepting feedback, and completing my responsibilities. This report is dedicated to all those who walked with me through this journey of growth, collaboration, and discovery.",
    ),
  ];
}

// =====================================================================
// LIST OF ACRONYMS
// =====================================================================

function buildAcronyms() {
  const acronyms = [
    ["AI", "Artificial Intelligence"],
    ["API", "Application Programming Interface"],
    ["ASP.NET", "Active Server Pages .NET"],
    ["BSc", "Bachelor of Science"],
    ["CBE", "Commercial Bank of Ethiopia"],
    ["CRC", "Class-Responsibility-Collaboration"],
    ["CRUD", "Create, Read, Update, Delete"],
    ["CV", "Curriculum Vitae"],
    ["DBMS", "Database Management System"],
    ["DDU", "Dire Dawa University"],
    ["Django", "Python web framework"],
    ["EC", "Ethiopian Calendar"],
    ["ERD", "Entity-Relationship Diagram"],
    ["ETB", "Ethiopian Birr"],
    ["Fayda", "Ethiopian National Digital ID"],
    ["FK", "Foreign Key"],
    ["HMAC", "Hash-based Message Authentication Code"],
    ["HTML", "Hypertext Markup Language"],
    ["HTTP", "Hypertext Transfer Protocol"],
    ["HTTPS", "Hypertext Transfer Protocol Secure"],
    ["ID", "Identification"],
    ["IDE", "Integrated Development Environment"],
    ["JSON", "JavaScript Object Notation"],
    ["JWT", "JSON Web Token"],
    ["MFA", "Multi-Factor Authentication"],
    ["MVP", "Minimum Viable Product"],
    ["MVC", "Model-View-Controller"],
    ["OCR", "Optical Character Recognition"],
    ["Odoo", "Open-source ERP framework (Python)"],
    ["OOP", "Object-Oriented Programming"],
    ["OTP", "One-Time Password"],
    ["ORM", "Object-Relational Mapping"],
    ["PDF", "Portable Document Format"],
    ["PK", "Primary Key"],
    ["PWA", "Progressive Web Application"],
    ["QA", "Quality Assurance"],
    ["REST", "Representational State Transfer"],
    ["SaaS", "Software-as-a-Service"],
    ["SDLC", "Software Development Life Cycle"],
    ["SQL", "Structured Query Language"],
    ["SRP", "Single Responsibility Principle"],
    ["TOTP", "Time-based One-Time Password"],
    ["UI", "User Interface"],
    ["URL", "Uniform Resource Locator"],
    ["UX", "User Experience"],
    ["VCS", "Version Control System"],
  ];

  return [
    h1NoBreak("List of Acronyms"),
    empty(),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      rows: acronyms.map(([abbr, full]) => new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            margins: { top: 30, bottom: 30, left: 60, right: 60 },
            children: [new Paragraph({
              spacing: { line: 240 },
              children: [textRun(abbr, { bold: true, size: 22 })],
            })],
          }),
          new TableCell({
            width: { size: 82, type: WidthType.PERCENTAGE },
            margins: { top: 30, bottom: 30, left: 60, right: 60 },
            children: [new Paragraph({
              spacing: { line: 240 },
              children: [textRun(full, { size: 22 })],
            })],
          }),
        ],
      })),
    }),
  ];
}

// =====================================================================
// CHAPTER 1: INTRODUCTION
// =====================================================================

function buildChapter1() {
  return [
    h1("Chapter One: Introduction"),

    h2("1.1 Background"),
    body(
      "Software engineering education becomes more meaningful when theoretical knowledge is connected to authentic development situations. During my three years of study at Dire Dawa University, I studied requirements engineering, analysis and design, programming, databases, architecture, security, networking, mobile development, and software engineering tools and practices. During the internship at Afronex Tech Company, those subjects became practical responsibilities: requirements became feature plans, architecture became shared contracts, programming became maintainable components, databases became business records, and security became a consideration in sensitive workflows such as payment verification and member authentication.",
    ),
    body(
      "My internship at Afronex marked a transition from primarily academic exercises to participation in a professional development environment. I had to understand incomplete requirements, work with other people's code and decisions, communicate clearly, test behaviour, accept review comments, and contribute to a system that could be evaluated beyond my individual contribution. The experience reshaped my initial assumption that building a complete system would be given to me alone and integrated directly into production; instead, I learned that real software engineering is fundamentally about teamwork, role specialisation, and disciplined collaboration across module boundaries.",
    ),

    h2("1.2 Purpose of the Internship"),
    body(
      "The purpose of my internship was to acquire practical software engineering experience by participating in real projects, collaborating with developers and fellow interns, and applying academic knowledge to user-facing and business-oriented systems. I aimed to understand the complete delivery process: studying an existing codebase, interpreting requirements, implementing within an assigned boundary, connecting layers, testing, presenting, revising, and integrating. Beyond technical exposure, I sought to build communication skills by engaging with senior developers, cross-team collaborators, and the company's leadership on a regular basis.",
    ),
    body(
      "The internship programme at Dire Dawa University is structured as a full-semester industrial placement, typically completed after the third year of study. Its purpose is to bridge the gap between classroom learning and professional practice by exposing students to real client requirements, real deadlines, real code review, and real production considerations. For me specifically, the programme aligned with my personal interests in web development and artificial intelligence, both of which I had the opportunity to explore in depth during the four months at Afronex.",
    ),

    h2("1.3 Personal Learning Objectives"),
    body(
      "My personal learning objectives at the beginning of the internship were intentionally broad: to learn anything useful for the project we were working on, to strengthen my full-stack web development skills, to gain practical exposure to payment and subscription workflows, to improve my debugging and testing habits, and to explore the responsible use of AI-assisted engineering. I also wanted to understand how a complex product is divided among task-based teams, how cross-team integration actually works in practice, and how technical decisions create or reduce business value.",
    ),
    body(
      "An additional, unstated objective was to learn how to monitor and direct agentic AI systems when performing tasks outside my primary area of expertise. This objective shaped many of my decisions during the internship, including my preference for the Django framework on personal projects (because it is Python-based and therefore compatible with the broader AI ecosystem), my active role as the company's communication lead on the interns' side, and my frequent use of AI agents to scaffold unfamiliar code, generate test cases, and review security-sensitive flows.",
    ),

    h2("1.4 Relationship to Software Engineering Education"),
    body(
      "The internship related directly to my university coursework. Over the preceding three years, I had completed courses in Operating Systems, Data Structures and Algorithms, Object-Oriented System Analysis and Design, Advanced Software Engineering, Fundamentals of Database Systems, Digital Logic Design, Object-Oriented Programming, Software Engineering Tools and Practices, Design and Analysis of Algorithms, Software Requirements Engineering, Data Communication and Computer Networks, Computer Organization and Architecture, Advanced Database Systems, System Programming, Internet Programming, Mobile Application Development, Advanced Programming, Software Architecture and Design, and Software Security, among others as per the DDU curriculum.",
    ),
    body(
      "During the internship, I drew on these foundations daily. Object-Oriented System Analysis and Design informed the way I read existing class diagrams and proposed refinements. Advanced Database Systems guided my work on the persistent data model for the membership management system, particularly around subscription state machines and payment audit trails. Software Architecture and Design shaped my understanding of why the company had split the modernisation effort across seven task-based teams. Software Security informed my approach to payment screenshot handling, OTP confirmation flows, and the manual payment confirmation workflow. Internet Programming and Advanced Programming were directly applied in the React frontend and the supporting API layer.",
    ),

    h2("1.5 Initial Assumptions and How They Changed"),
    body(
      "Before joining Afronex, I assumed that building the whole system would be given to me to do as the company wanted, and that the work would be integrated and deployed directly into production. This assumption made me nervous, because I feared that any mistake I made would have immediate real-world consequences. The reality was very different: the work was fundamentally about teamwork, with each intern assigned to a specific role based on their strengths and preferences, and integration happened only after multiple rounds of review, testing, and cross-team coordination.",
    ),
    body(
      "This realisation was one of the most important shifts in my professional mindset during the internship. I learned that production readiness is not the responsibility of a single developer but the collective outcome of a disciplined team process: shared contracts, code review, integration testing, acceptance criteria, and stakeholder sign-off. I also learned that asking a precise question early was often more efficient than implementing an assumption and discovering later that it conflicted with another module's expectations.",
    ),

    h2("1.6 Planned Schedule, Onboarding, and First Assignment"),
    body(
      "I made myself busy from the first day with learning and implementing until I reached the level expected of me and could perform the tasks given to me. There was no rigid schedule that framed my working days and rest days; instead, we were advised to manage our own time while ensuring that project milestones were met. The company provided a final submission date and a presentation day for each project, on which we would demonstrate the work, check integration issues, and fix any defects identified during review.",
    ),
    body(
      "Onboarding consisted of reading shared documentation including developer-prompt.md, team-ownership-matrix.md, delivery-roadmap.md, gap-analysis.md, and the team-allocation file that assigned each intern to one of seven teams. My first assignment was to read the team-allocation document, locate my team (Team 6: Payments and Subscriptions), read my feature plan and checklist, and keep the developer-prompt.md file open at all times as the authoritative reference for shared conventions. We were supervised through weekly meetings with the company, with no fixed dates or frequency, scheduled instead around project progress and integration needs.",
    ),
  ];
}

// =====================================================================
// CHAPTER 2: COMPANY BACKGROUND
// =====================================================================

function buildChapter2() {
  return [
    h1("Chapter Two: Company Background"),

    h2("2.1 Organizational Overview"),
    body(
      "Afronex Tech Company is located in Dire Dawa city, Ethiopia, near Dire Dawa University. The company is known for delivering real-time technology solutions for real-world problems across multiple domains including system development, web development, artificial intelligence, and technology skills development. Its client base spans the eastern region of Ethiopia and the wider national market, with a particular focus on serving government institutions, membership-based organisations, and small-to-medium enterprises that require custom software solutions.",
    ),
    body(
      "Afronex is led by Mr. Tsegaw, who is also a lecturer at Dire Dawa University. His academic background in software engineering informs the company's working culture, which combines discipline with mentorship. He was friendly with his students, including me, and continually encouraged us to advance our skills in software development and AI usage. Under his leadership, the company is currently focusing its strategic direction on AI-driven products, building on its existing portfolio of web-based systems and exploring agentic AI for selected development activities.",
    ),
    body(
      "A notable characteristic of Afronex is its willingness to work with beginner developers, including university interns. The company runs Afronex Tech Hub, a skills-development initiative that teaches practical software engineering to early-career developers. This culture of openness and mentorship made the internship programme particularly valuable: rather than being treated as observers, interns were integrated into active project teams, given ownership of specific features, and held accountable for delivery in the same way as full-time engineers.",
    ),

    h2("2.2 Services and Technology Orientation"),
    body(
      "The internship environment reflected the needs of modern digital services: accessible interfaces, responsive workflows, secure handling of sensitive data, integration between modules, and adaptability to changing requirements. Afronex's service portfolio spans custom web application development, membership management systems, AI-driven care solutions, accounting and inventory subsystems (built on Odoo), and a growing set of AI product initiatives. Because the projects involved confidential organisational and client information, all references in this report have been generalised to protect sensitive identifiers, URLs, screenshots, and implementation specifics.",
    ),
    body(
      "The company's technology orientation favours mature, well-supported frameworks with strong ecosystem backing. For frontend work, React was the dominant choice, complemented by TypeScript for type safety. For backend work, both Python-based frameworks (Django) and the Odoo ERP framework were used depending on the project's domain. For AI work, the company explored agentic AI patterns in which AI agents were assigned specific, scoped tasks under human supervision. For version control and collaboration, GitHub was used throughout, with structured branching and review conventions documented in shared markdown files.",
    ),

    h2("2.3 Organizational Structure and Intern Placement"),
    body(
      "Interns were assigned across all project groups according to the tasks and ownership areas defined for the product. I was mainly assigned to Team 6, the Payments and Subscriptions team, but my work was not limited to a single layer of the system. I contributed to understanding workflows, shaping status rules, connecting user interfaces with business logic, reviewing integration behaviour, and communicating requirements with other teams. The team structure was designed so that no single team owned an entire vertical slice in isolation; instead, each team owned a horizontal capability and depended on shared contracts defined by Team 1 (Platform Foundation and Security).",
    ),
    body(
      "The full team structure for the main project comprised seven teams, each with a clearly defined ownership area and a set of plan and checklist documents. The teams, their roles, and their main responsibilities are summarised in Table 2.1 below. The complete allocation, including assignment order and dependency rules, was documented in shared markdown files that all teams were required to read before starting implementation.",
    ),
    caption("Table 2.1: Team Allocation for the Membership Management System Modernisation"),
    buildTeamTable(),
    body(
      "The assignment order followed a strict dependency chain: Team 1 started first to lock the shared platform contracts; Teams 2 and 3 started after Team 1's contracts were stable; Teams 4, 5, and 6 started after the shared API and status rules were finalised; and Team 7 ran across the integration phase to validate cross-module behaviour and catch regressions. This sequencing ensured that downstream teams never had to guess at the contracts they depended on.",
    ),

    h2("2.4 Working Culture"),
    body(
      "The working culture at Afronex emphasised communication, peer support, iterative improvement, and practical completion. Work was organised around expected deliverables, demonstrations, integration milestones, and issue correction rather than rigid daily stand-ups or fixed working hours. This required independence in time management but also accountability to the team: if a feature I owned was delayed, the downstream teams that depended on my API contracts would be affected, and I was expected to communicate the delay early and propose a mitigation.",
    ),
    body(
      "Progress was demonstrated through presentations to the company leadership and to fellow interns after the completion of each feature or task. After each presentation, comments and review notes were collected, prioritised, and incorporated into the next iteration of work. We were also encouraged to come forward with new feature recommendations on the project we were working on and on the working environment of the company itself. Several recommendations I made during the internship were subsequently adopted, as described in Chapter 9.",
    ),

    h2("2.5 Leadership and Mentorship"),
    body(
      "Mr. Tsegaw, the company leader, was actively involved in intern supervision despite his dual role as a university lecturer. His mentorship style combined technical depth with business awareness: he would review our code and design decisions, but he would also challenge us to consider how each feature generated revenue, reduced operational effort, or created strategic value for the client. This dual focus significantly influenced my own development, as described in Chapter 7 (Learning and Growth), and shifted my mindset from \u201Cdoes the system run without errors?\u201D to \u201Chow does this feature contribute to the business?\u201D",
    ),
    body(
      "Technical supervision was provided by senior developers within the company, who led architecture discussions, established conventions, and provided feedback during review sessions. The combination of strategic mentorship from the leadership and tactical mentorship from the technical supervisors created a structured learning environment in which interns could progress from understanding requirements to delivering production-ready features over the course of the four-month programme.",
    ),
  ];
}

// Helper: Team allocation table
function buildTeamTable() {
  const rows = [
    ["Team 1", "Platform Foundation and Security", "Auth, roles, permissions, route guards, API response format, error handling, sensitive-data flows"],
    ["Team 2", "Super Admin and Organization Governance", "Super admin dashboard, organizations management, org admin oversight, platform-level control"],
    ["Team 3", "Organization Admin Dashboard and Member Management", "Member CRUD, add/edit/remove flows, import/export, bulk actions, member moderation"],
    ["Team 4", "Event Management and Public Registration", "Event CRUD, list/calendar views, attendee management, public discovery, registration flow"],
    ["Team 5", "Blog, Announcements, and Content Workflow", "Blog and announcements modules, post CRUD, draft/publish workflow, category/status filters"],
    ["Team 6", "Payments and Subscriptions (my team)", "Payment transactions, subscription plans and billing state, manual payment recording, invoices and receipts, payment status normalization and auditability"],
    ["Team 7", "Member Experience and Integration QA", "Cross-module integration validation, regression catching, acceptance criteria validation, release-readiness"],
  ];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: ["Team", "Role", "Key Responsibilities"].map((h) =>
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
            children: [new Paragraph({ alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { line: 240 }, children: [textRun(cell, { size: 20, bold: i === 0 })] })],
          }),
        ),
      })),
    ],
  });
}

module.exports = {
  buildCover, buildAcknowledgment, buildAcronyms,
  buildChapter1, buildChapter2,
};
