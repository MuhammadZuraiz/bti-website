# Project Playbook

## Agile Rhythm

Use one-week sprints until launch because the team is small and business risk is immediate.

Weekly cycle:

- Monday: sprint planning and priority confirmation
- Tuesday to Thursday: delivery, review and stakeholder checks
- Friday: demo, bug triage and retrospective

Daily standup:

- What did I finish?
- What will I finish next?
- What is blocked?
- Which decision do I need today?

## Ticket Hierarchy

Epic examples:

- Rebuild BTI public website
- Configure Odoo admissions CRM
- Stabilise domain and email identity
- Prepare launch compliance baseline

Story example:

`As a prospective IELTS learner, I want to find IELTS preparation details and request a callback so that admissions can advise me.`

Task examples:

- Add course catalogue filters
- Map enquiry form to Odoo-ready payload
- Draft privacy notice
- Configure canonical metadata

Subtask examples:

- Add required phone validation
- Add Arabic translation
- Test mobile layout
- Confirm CRM field name

## Git Workflow

Use:

- `main` for production-ready work
- `staging` for UAT
- `feature/*` for features
- `fix/*` for bug fixes
- `chore/*` for setup and maintenance

Examples:

```bash
git checkout -b feature/course-catalogue
git status
git add index.html styles.css scripts.js
git commit -m "feat: add bilingual course catalogue"
git push origin feature/course-catalogue
```

Good branch names:

- `feature/admissions-lead-form`
- `feature/arabic-rtl-layout`
- `fix/mobile-navigation`
- `chore/seo-files`

Good commits:

- `feat: add placement test enquiry flow`
- `fix: preserve selected course after language switch`
- `docs: add Odoo field mapping`
- `chore: add sitemap and robots`

## Pull Request Checklist

Before requesting review:

- Page works on mobile and desktop
- Arabic layout is checked if text changed
- Forms have labels and validation
- No secrets or credentials are committed
- New content has an owner or review note
- Accessibility focus states still work
- Screenshots or test notes are added to the PR

## Junior Developer Routine

Start of day:

- Pull latest branch
- Read assigned ticket and acceptance criteria
- Confirm any blocker early

During work:

- Make one focused change at a time
- Test before committing
- Ask seniors about architecture, data and security decisions

End of day:

- Push branch
- Update ticket status
- Note what is done, blocked and next

## Questions to Ask

Manager:

- What is the business priority this week?
- Who approves this page or workflow?
- What is out of scope for launch?
- What decision is blocking delivery?

Designer:

- Which design file is the source of truth?
- What should happen on small mobile screens?
- Are Arabic layouts reviewed?
- What are the empty, loading and error states?

Product manager:

- Who is the primary user?
- What user action counts as success?
- What data must be captured?
- What legal or business wording must be approved?

Senior developer:

- Which existing pattern should I follow?
- Where should this code live?
- What should I test?
- What is the riskiest part of this change?
