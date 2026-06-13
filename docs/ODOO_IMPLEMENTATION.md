# Odoo Implementation Blueprint

## Recommended Platform

Use Odoo 19 Enterprise on Odoo.sh with Cloudflare in front of the public website and canonical domain. Start configuration-first and add custom modules only where Odoo-native objects cannot represent the admissions workflow.

## Phase 1 Apps

- Contacts
- CRM
- Sales
- Invoicing
- Website
- Documents or Sign, if admissions paperwork is approved

## Phase 2 Apps

- eLearning
- Email Marketing or Marketing Automation
- Events for placement tests, workshops and open days
- Employees, Recruitment and Leaves for basic HR

## Core Roles

- System Administrator: full technical ownership, MFA required
- CRM Manager: stages, assignment rules, lead reporting
- Admissions Officer: leads, calls, consultations, placement-test booking
- Finance Officer: quotations, invoices, receipts, VAT checks
- Academic Coordinator: course, intake, trainer and cohort data
- Marketing/Content Editor: website pages, blog/news, campaign copy
- Instructor: course/cohort visibility and learner completion updates
- HR Manager: employee and leave records

## CRM Lead Fields

Add these fields to `crm.lead` or map them through Studio/custom module:

| Field | Type | Purpose |
| --- | --- | --- |
| `x_enquiry_type` | Selection | course, callback, placement, corporate, guardian |
| `x_course_interest` | Selection/Many2one | Course/product requested |
| `x_preferred_schedule` | Selection | any, weekday morning, weekday evening, weekend |
| `x_source_channel` | Selection | website, WhatsApp, phone, Facebook, Instagram, LinkedIn, partner |
| `x_consent_status` | Selection | granted, withdrawn, pending |
| `x_language_preference` | Selection | English, Arabic |
| `x_assigned_counsellor` | Many2one user | Admissions owner |

## Contact Model

Use `res.partner` with tags or types:

- Student
- Guardian
- Corporate Contact
- Trainer
- Alumni

For minors or family-based communication, add either parent/child contact relationships or a light custom `bti.student.guardian.relation` model.

## Course and Enrolment Model

Use `product.template` as the pricing and sales object for course offerings. Use Website/eLearning content for public presentation.

Create a light custom model for cohorts:

| Field | Purpose |
| --- | --- |
| Course | Link to product/course |
| Start date | Intake start |
| End date | Intake end |
| Schedule | Days/times |
| Mode | On campus, hybrid, online |
| Seat cap | Capacity |
| Trainer | Instructor |
| Status | Draft, open, full, active, complete, cancelled |

Create a light enrolment state on sales order or a related model:

- Draft enquiry
- Quoted
- Confirmed
- Paid or payment plan
- Active
- Completed
- Cancelled

## Website Form Mapping

The static website prepares this `crm.lead` mapping:

| Website value | Odoo target |
| --- | --- |
| Full name | `contact_name` |
| Phone | `phone` |
| Email | `email_from` |
| Enquiry type | `x_enquiry_type` |
| Course interest | `x_course_interest` |
| Preferred schedule | `x_preferred_schedule` |
| Consent | `x_consent_status` |
| Message | `description` |

Recommended production path:

1. Website form submits to a secure middleware endpoint.
2. Middleware validates payload and rate limits submissions.
3. Middleware creates `crm.lead` through Odoo API.
4. Odoo assignment rules route lead to admissions owner.
5. Email/notification confirms receipt internally.

## CRM Stages

- New website enquiry
- Contact attempted
- Consultation scheduled
- Placement test needed
- Quote sent
- Awaiting payment
- Enrolled
- Won/completed
- Lost/not suitable

## Migration Steps

1. Inventory spreadsheets, inboxes, WhatsApp exports and social leads.
2. Assign owners for admissions, finance and content data.
3. Deduplicate contacts by phone and email.
4. Normalise UAE phone numbers.
5. Map courses to products.
6. Import a small test batch.
7. Validate CRM, quotation and invoice output.
8. Import remaining records only after UAT sign-off.

## Non-Negotiable Controls

- Named users only
- MFA for administrators
- No shared admin credentials
- Daily backups
- Monthly restore test
- SPF/DKIM/DMARC before CRM email automation
- Course-level VAT review before invoicing
