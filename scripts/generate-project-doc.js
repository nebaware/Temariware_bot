// Temariware — Senior Project Document
// Dire Dawa University, Department of Information Technology
// Following the university's Project Guideline (Times New Roman, A4, 1.5 spacing,
// custom margins Top 1"/Bottom 1"/Left 1.25"/Right 1", Roman→Arabic page numbering)

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  TableOfContents, NumberFormat, SectionType, ShadingType,
  LevelFormat, convertInchesToTwip, HeightRule,
  ImageRun,
} = require("docx");
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size").default || require("image-size");

// =====================================================================
// CONSTANTS — Dire Dawa University formatting per the guideline
// =====================================================================

// Custom margins: Top 1", Bottom 1", Left 1.25", Right 1"
const MARGIN_TOP = convertInchesToTwip(1);       // 1440 twips
const MARGIN_BOTTOM = convertInchesToTwip(1);    // 1440 twips
const MARGIN_LEFT = convertInchesToTwip(1.25);   // 1800 twips
const MARGIN_RIGHT = convertInchesToTwip(1);     // 1440 twips

// A4 page size (8.27" x 11.69")
const PAGE_WIDTH = 11906;  // 210mm in twips
const PAGE_HEIGHT = 16838; // 297mm in twips

// Line spacing 1.5 = 360 (in 240ths of a line; 240 = single, 360 = 1.5x)
const LINE_SPACING_15 = 360;

// Font: Times New Roman throughout
const FONT = "Times New Roman";

// Font sizes (in half-points; 24 = 12pt, 28 = 14pt, 26 = 13pt)
const SIZE_BODY = 24;        // 12pt
const SIZE_H1 = 28;          // 14pt (Major Heading)
const SIZE_H2 = 26;          // 13pt (Second Order Heading)
const SIZE_H3 = 24;          // 12pt (Third Order Heading)
const SIZE_TITLE = 28;       // 14pt for title page content (consistent with H1)
const SIZE_COVER_TITLE = 32; // 16pt for main project title on cover
const SIZE_FOOTER = 20;      // 10pt for page numbers
const SIZE_HEADER = 20;      // 10pt for headers

// =====================================================================
// HELPERS
// =====================================================================

function textRun(text, opts = {}) {
  return new TextRun({
    text,
    font: { ascii: FONT, hAnsi: FONT, cs: FONT },
    size: opts.size || SIZE_BODY,
    bold: opts.bold || false,
    italics: opts.italics || false,
    underline: opts.underline ? { type: "single" } : undefined,
    color: opts.color || "000000",
    allCaps: opts.allCaps || false,
  });
}

// Body paragraph: justified, 1.5 line spacing, no indent (per guideline 2.4)
function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: LINE_SPACING_15, after: 0, before: 0 },
    children: [textRun(text, opts)],
  });
}

// Body with mixed runs (for bold inline)
function bodyMixed(runs, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
    spacing: { line: LINE_SPACING_15, after: 0, before: 0 },
    children: runs,
  });
}

// Major Heading (H1): 14pt bold UPPER CASE, centered, on new page
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    pageBreakBefore: true,
    spacing: { line: LINE_SPACING_15, before: 0, after: 240 },
    children: [new TextRun({
      text: text.toUpperCase(),
      font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H1,
      bold: true,
      color: "000000",
    })],
  });
}

// H1 without page break (for use after a page break already happened)
function h1NoBreak(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_SPACING_15, before: 0, after: 240 },
    children: [new TextRun({
      text: text.toUpperCase(),
      font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H1,
      bold: true,
      color: "000000",
    })],
  });
}

// Second Order Heading (H2): 13pt bold, left
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { line: LINE_SPACING_15, before: 240, after: 120 },
    children: [new TextRun({
      text,
      font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H2,
      bold: true,
      color: "000000",
    })],
  });
}

// Third Order Heading (H3): 12pt bold, left
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { line: LINE_SPACING_15, before: 180, after: 60 },
    children: [new TextRun({
      text,
      font: { ascii: FONT, hAnsi: FONT, cs: FONT },
      size: SIZE_H3,
      bold: true,
      color: "000000",
    })],
  });
}

// Empty paragraph (single line spacing for spacing)
function empty(line = LINE_SPACING_15) {
  return new Paragraph({
    spacing: { line, after: 0, before: 0 },
    children: [],
  });
}

// Centered text (for cover page)
function centered(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: LINE_SPACING_15, after: opts.after !== undefined ? opts.after : 0, before: opts.before || 0 },
    children: [textRun(text, opts)],
  });
}

// Figure/table caption (centered, can be 1 line spacing per guideline)
function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 240, after: 120, before: 60 },
    children: [textRun(text, { size: 22, italics: false })], // 11pt
  });
}

// Embed an image centered, preserving aspect ratio.
// `maxWidthInches` defaults to 6.0" (fits within A4 with 1.25" left + 1" right margins).
const FIG_DIR = "/home/z/my-project/download/figures";

function figure(filename, maxWidthInches = 6.0) {
  const fullPath = path.join(FIG_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 240, after: 120, before: 120 },
      children: [textRun(`[Image not found: ${filename}]`, { italics: true, color: "AA0000", size: 22 })],
    });
  }
  const buf = fs.readFileSync(fullPath);
  const dims = sizeOf(buf);
  const maxWidthPx = maxWidthInches * 96; // 96 dpi reference
  let width = dims.width;
  let height = dims.height;
  if (width > maxWidthPx) {
    const ratio = maxWidthPx / width;
    width = maxWidthPx;
    height = Math.round(height * ratio);
  }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: 240, after: 120, before: 120 },
    children: [new ImageRun({
      data: buf,
      transformation: { width, height },
      type: "png",
    })],
  });
}

// Figure = image + caption combined
function figureWithCaption(filename, captionText, maxWidthInches = 6.0) {
  return [
    figure(filename, maxWidthInches),
    caption(captionText),
  ];
}

// =====================================================================
// SECTION 1: COVER (TITLE PAGE) — per Appendix II
// =====================================================================

function buildCover() {
  return [
    // Top: institution info
    centered("DIRE DAWA UNIVERSITY", { bold: true, size: SIZE_H1 }),
    centered("DIRE DAWA INSTITUTE OF TECHNOLOGY", { bold: true, size: SIZE_H2 }),
    centered("SCHOOL OF COMPUTING", { bold: true, size: SIZE_H2 }),
    centered("DEPARTMENT OF SOFTWARE ENGINEERING", { bold: true, size: SIZE_H2 }),
    empty(),
    empty(),
    centered("PROJECT PROPOSAL", { bold: true, size: SIZE_COVER_TITLE }),
    centered("ON", { bold: true, size: SIZE_H2 }),
    empty(),
    // Project title in quotes
    centered("\u201CDesign and Implementation of Temariware:", { bold: true, size: SIZE_COVER_TITLE }),
    centered("A Telegram Mini App for University Student", { bold: true, size: SIZE_COVER_TITLE }),
    centered("Job Matching in Ethiopia\u201D", { bold: true, size: SIZE_COVER_TITLE }),
    empty(),
    empty(),
    // Submission paragraph
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun(
        "A Proposal Submitted to the Dire Dawa University Institute of Technology School of Computing Department of Software Engineering of Dire Dawa University in Partial Fulfilment of the Requirements for the Degree of BSc in Software Engineering",
        { size: SIZE_BODY },
      )],
    }),
    empty(),
    empty(),
    // Group members
    centered("BY:", { bold: true, size: SIZE_H2 }),
    centered("Nebiyu Tsegaye                        ID: 1501332", { size: SIZE_BODY }),
    empty(),
    empty(),
    centered("ADVISOR:", { bold: true, size: SIZE_H2 }),
    centered("[Advisor Name (Title)]", { size: SIZE_BODY }),
    empty(),
    empty(),
    empty(),
    centered("[Month, Year]", { bold: true, size: SIZE_H2 }),
    centered("Dire Dawa, Ethiopia", { size: SIZE_BODY }),
  ];
}

// =====================================================================
// SECTION 2: CERTIFICATE
// =====================================================================

function buildCertificate() {
  return [
    h1NoBreak("Certificate"),
    empty(),
    body(
      "This is to certify that the project proposal entitled \u201CDesign and Implementation of Temariware: A Telegram Mini App for University Student Job Matching in Ethiopia\u201D has been carried out by Nebiyu Tsegaye (ID: 1501332) under my supervision and guidance as a partial fulfilment of the requirements for the Degree of BSc in Software Engineering at the Department of Software Engineering, School of Computing, Dire Dawa Institute of Technology, Dire Dawa University.",
    ),
    empty(),
    body(
      "To the best of my knowledge, the work presented in this proposal is original, has not been submitted elsewhere for the award of any other degree or diploma, and the contributions of others have been appropriately acknowledged through citations and references.",
    ),
    empty(),
    empty(),
    empty(),
    // Signature line (right aligned)
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun("_______________________________", { size: SIZE_BODY })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun("[Advisor Name (Title)]", { bold: true, size: SIZE_BODY })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun("Senior Project Advisor", { size: SIZE_BODY })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun("Department of Information Technology", { size: SIZE_BODY })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun("Dire Dawa University", { size: SIZE_BODY })],
    }),
    empty(),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { line: LINE_SPACING_15, after: 0 },
      children: [textRun("Date: ____________________", { size: SIZE_BODY })],
    }),
  ];
}

// =====================================================================
// SECTION 3: ACKNOWLEDGMENT
// =====================================================================

function buildAcknowledgment() {
  return [
    h1NoBreak("Acknowledgment"),
    empty(),
    body(
      "First and foremost, we would like to express our deepest gratitude to our project advisor, [Advisor Name (Title)], for the unwavering guidance, constructive feedback, and continuous encouragement throughout the course of this project. His/her insights into software engineering principles and Telegram Mini App development were instrumental in shaping the direction of this work, and his/her patience in reviewing multiple drafts of this proposal significantly improved its quality.",
    ),
    body(
      "We also extend our sincere thanks to the academic staff of the Department of Information Technology, School of Computing, Dire Dawa Institute of Technology, for the foundational knowledge they imparted during our studies. The courses on database management systems, software engineering, web application development, and human-computer interaction provided the theoretical and practical grounding necessary to undertake a project of this scope. We are particularly grateful to the department head and the project coordinator for organising the industrial project programme and for making the project guideline document available, which served as the structural backbone of this proposal.",
    ),
    body(
      "Our appreciation also goes to the broader Ethiopian Telegram developer community, whose open-source examples of Telegram Bot API integrations and Mini App implementations were valuable references during our research. Finally, we acknowledge the love, patience, and financial support of our families throughout our university education; without their encouragement, completing this project would not have been possible. Any remaining errors or omissions in this document are solely our responsibility.",
    ),
  ];
}

// =====================================================================
// SECTION 4: ABSTRACT
// =====================================================================

function buildAbstract() {
  return [
    h1NoBreak("Abstract"),
    empty(),
    body(
      "Youth unemployment is one of the most pressing socio-economic challenges facing Ethiopia today, with university graduates often struggling to find employment that matches their skills despite a steady demand for tutoring, freelance, and part-time labour in cities and towns across the country. Although job opportunities are regularly broadcast through informal Telegram channels such as Afriwork and Yegna Tutors Harrar, the lack of a structured platform means that opportunities are easily missed, applicants cannot be reliably verified, and employers have no way to manage applications or collect fees in a transparent manner. This project, Temariware, proposes the design and implementation of a Telegram Mini App combined with a Telegram Bot that addresses these gaps by providing a single, multilingual platform where Ethiopian university students can browse verified jobs, apply with their academic profile, and pay a confirmation fee through a screenshot-based verification flow, while employers can post jobs, review applicant documents (National ID, University ID, and last semester grade report), accept candidates, and have the platform automatically close positions once hiring targets are met.",
    ),
    body(
      "The system is built using a modern full-stack architecture: a Next.js 16 web application with React 19 and TypeScript serves as the Mini App frontend, a Prisma-managed PostgreSQL database hosted on Neon stores all user, job, application, and payment records, and the application is deployed on Vercel's free tier. Authentication is performed through Telegram's WebApp initData HMAC-SHA256 validation, ensuring that every user is a real Telegram account holder. The bot, accessible as @temariwarebot, exposes slash commands (/start, /latest, /search, /subscribe, /postjob, /admin) and pushes instant job alerts to subscribers, while the @TEMARIWARE channel automatically receives richly-formatted job cards every time an administrator approves a new posting.",
    ),
    body(
      "The proposed system is expected to reduce the friction of job discovery for students, increase trust between employers and applicants through mandatory document verification, and provide a sustainable revenue model through configurable per-job application fees. The complete software stack operates on free-tier services, making the platform accessible to students without any upfront cost. This proposal document presents the problem background, objectives, scope, methodology, system requirements, analysis, and preliminary design of Temariware in accordance with the Dire Dawa University industrial project guideline.",
    ),
    empty(),
    // Keywords
    bodyMixed([
      textRun("Keywords: ", { bold: true }),
      textRun("Telegram Mini App, Job Matching, University Students, Ethiopia, Next.js, Prisma, Neon Postgres, Telegram Bot API, Payment Verification, Document Verification."),
    ]),
  ];
}

// =====================================================================
// SECTION 5: TABLE OF CONTENTS
// =====================================================================

function buildTOC() {
  return [
    h1NoBreak("Table of Contents"),
    empty(),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    // Refresh hint
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { line: 240, before: 240 },
      children: [new TextRun({
        text: "[Right-click the table above and choose \u201CUpdate Field\u201D to refresh page numbers after editing.]",
        font: { ascii: FONT, hAnsi: FONT, cs: FONT },
        size: 20,
        italics: true,
        color: "808080",
      })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// =====================================================================
// SECTION 6: LIST OF FIGURES / TABLES / ACRONYMS
// =====================================================================

function buildListsAndAcronyms() {
  // Acronyms table
  const acronyms = [
    ["API", "Application Programming Interface"],
    ["BSc", "Bachelor of Science"],
    ["CBE", "Commercial Bank of Ethiopia"],
    ["CRC", "Class-Responsibility-Collaboration"],
    ["CV", "Curriculum Vitae"],
    ["DBMS", "Database Management System"],
    ["ETB", "Ethiopian Birr"],
    ["HMAC", "Hash-based Message Authentication Code"],
    ["HTML", "Hypertext Markup Language"],
    ["HTTP", "Hypertext Transfer Protocol"],
    ["ID", "Identification"],
    ["IDE", "Integrated Development Environment"],
    ["JSON", "JavaScript Object Notation"],
    ["JWT", "JSON Web Token"],
    ["MVC", "Model-View-Controller"],
    ["OOP", "Object-Oriented Programming"],
    ["ORM", "Object-Relational Mapping"],
    ["PDF", "Portable Document Format"],
    ["PNG", "Portable Network Graphics"],
    ["REST", "Representational State Transfer"],
    ["SDK", "Software Development Kit"],
    ["SHA", "Secure Hash Algorithm"],
    ["SQL", "Structured Query Language"],
    ["TCP", "Transmission Control Protocol"],
    ["UI", "User Interface"],
    ["URL", "Uniform Resource Locator"],
    ["UX", "User Experience"],
    ["VPS", "Virtual Private Server"],
    ["WAF", "Web Application Firewall"],
    ["XML", "Extensible Markup Language"],
  ];

  return [
    h1NoBreak("List of Figures"),
    empty(),
    body("[Figure 2.1: Essential Use Case Diagram of Temariware ............................ Error! Bookmark not defined.]"),
    body("[Figure 2.2: Conceptual Class Model ...................................................... Error! Bookmark not defined.]"),
    body("[Figure 2.3: Sequence Diagram \u2014 Apply to Job ...................................... Error! Bookmark not defined.]"),
    body("[Figure 2.4: Activity Diagram \u2014 Job Posting & Approval Flow ............... Error! Bookmark not defined.]"),
    body("[Figure 2.5: Essential User Interface Prototype \u2014 Home View .............. Error! Bookmark not defined.]"),
    body("[Figure 3.1: Component Diagram of Temariware .................................... Error! Bookmark not defined.]"),
    body("[Figure 3.2: Deployment Diagram ............................................................ Error! Bookmark not defined.]"),
    body("[Figure 3.3: Design-Level Class Diagram ............................................... Error! Bookmark not defined.]"),
    body("[Figure 3.4: State Chart Diagram \u2014 Application Lifecycle ..................... Error! Bookmark not defined.]"),
    body("[Figure 3.5: User Interface Diagram \u2014 Job Detail View ........................ Error! Bookmark not defined.]"),
    new Paragraph({ children: [new PageBreak()] }),

    h1NoBreak("List of Tables"),
    empty(),
    body("[Table 1.1: Project Work Breakdown Structure ..................................... Error! Bookmark not defined.]"),
    body("[Table 1.2: Feasibility Analysis Summary .............................................. Error! Bookmark not defined.]"),
    body("[Table 2.1: Functional Requirements ...................................................... Error! Bookmark not defined.]"),
    body("[Table 2.2: Non-Functional Requirements .............................................. Error! Bookmark not defined.]"),
    body("[Table 2.3: CRC Card \u2014 User Class ...................................................... Error! Bookmark not defined.]"),
    body("[Table 3.1: Software Architecture Styles Considered ........................... Error! Bookmark not defined.]"),
    body("[Table 3.2: Persistent Data Model Summary ......................................... Error! Bookmark not defined.]"),
    new Paragraph({ children: [new PageBreak()] }),

    h1NoBreak("Acronyms"),
    empty(),
    // Two-column table for acronyms
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
            width: { size: 20, type: WidthType.PERCENTAGE },
            margins: { top: 40, bottom: 40, left: 60, right: 60 },
            children: [new Paragraph({
              spacing: { line: 240 },
              children: [textRun(abbr, { bold: true })],
            })],
          }),
          new TableCell({
            width: { size: 80, type: WidthType.PERCENTAGE },
            margins: { top: 40, bottom: 40, left: 60, right: 60 },
            children: [new Paragraph({
              spacing: { line: 240 },
              children: [textRun(full)],
            })],
          }),
        ],
      })),
    }),
  ];
}

module.exports = {
  // Export helpers + section builders
  textRun, body, bodyMixed, h1, h1NoBreak, h2, h3, empty, centered, caption,
  figure, figureWithCaption,
  buildCover, buildCertificate, buildAcknowledgment, buildAbstract, buildTOC, buildListsAndAcronyms,
  // Constants
  FONT, SIZE_BODY, SIZE_H1, SIZE_H2, SIZE_H3, LINE_SPACING_15,
  MARGIN_TOP, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_RIGHT,
  PAGE_WIDTH, PAGE_HEIGHT,
};
