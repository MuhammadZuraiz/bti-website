# Course Content Needed from BTI

The website now lists **101 courses** across 11 departments. **13 flagship
courses are fully detailed**; the remaining **88 publish with neutral
"available on request" placeholders** until BTI supplies the details below.

Run `pnpm courses:audit` for the live count of what's outstanding.

## What we need for each course

For every course awaiting content, please provide:

| Field | Example |
| ----- | ------- |
| Course overview (2–4 sentences) | What the course covers and who it's for |
| Duration | e.g. "5 days" or "6 weeks" |
| Training hours | e.g. "30 hours" |
| Delivery methods | Classroom / Live Online / One-to-One / Corporate In-House / Hybrid |
| Learning outcomes (4–6 bullets) | "By the end, learners can…" |
| Target audience (2–4 bullets) | Who should attend |
| Detailed course outline (modules/topics) | The syllabus, as a list |
| Certification | Certificate name and any exam/awarding body |
| Fees | Public fee, or confirm "on request" |

A simple way to send this: one short block per course with the nine fields above.

## Where it goes in the website

Each course lives in `src/content/catalogue/<department>.ts`. Adding details =
replacing a one-line entry with the full fields and setting
`contentStatus: "complete"`. No redesign is needed — the page and the PDF
brochure update automatically.

## Flagship courses already fully detailed (reference examples)

IELTS Preparation, General English, Business English, Leadership & Management,
PMP Preparation, Human Resource Management, ACCA Preparation, Six Sigma Green
Belt, Quantity Surveying, Primavera P6, Python Programming, Digital Marketing,
Medical Coding.

## Courses awaiting full content (by department)

Priority: start with the most-enquired courses in each department.

- **Languages**: General/Spoken/Academic English, English Communication Skills,
  TOEFL, CELTA, DELTA, English for Professionals, Corporate English, and the
  IELTS Test Centre services (registration support, speaking practice, mock
  tests, intensive, private coaching).
- **Business & Management**: Business Administration, Strategic Management,
  Executive Development, Customer Service Excellence, Administrative Skills,
  Office Management, Business Communication, Organizational Development,
  Performance Management.
- **Project Management**: CAPM, Agile PM, Risk Management, Project Planning &
  Scheduling, Project Controls, PMO Fundamentals, PRINCE2.
- **Human Resources**: Recruitment & Talent Acquisition, Employee Relations,
  L&D, HR Analytics, Performance Management, Compensation & Benefits, Strategic
  HR.
- **Accounting & Finance**: Financial/Management Accounting, Financial Analysis,
  IFRS, VAT, Internal Auditing, Budgeting & Cost Control, CMA, CPA, Finance for
  Non-Financial Managers.
- **Quality & Operational Excellence**: Six Sigma Yellow/Black Belt, Lean, TQM,
  Quality Assurance/Engineering, Continuous Improvement, ISO, ASQ programs.
- **Engineering**: Civil/Mechanical/Electrical Engineering, Construction
  Management, Health & Safety, Engineering Project Management.
- **Engineering Software & Design**: AutoCAD, Revit, SolidWorks, ETABS, STAAD
  Pro, Engineering Design Applications, BIM Fundamentals.
- **Information Technology**: Web Development, Software Development Fundamentals,
  Database Management, Data Analysis, AI, Cybersecurity, MS Office, Advanced
  Excel, Digital Transformation.
- **Digital Marketing**: SEO, Social Media Marketing, Google Ads, Content
  Marketing, Branding, Marketing Analytics, Digital Business Development.
- **Medical & Healthcare**: Healthcare Administration, Healthcare Quality
  Management, Professional Development for Healthcare Professionals, Healthcare
  Communication Skills.
