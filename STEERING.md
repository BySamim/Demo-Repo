# Project Steering

Use this file as the project guide before planning or changing code. Update the checklist whenever meaningful work is completed or a new project task is discovered.

## How To Use This File

1. Read `README.md`, `STEERING.md`, and the files related to the requested change.
2. Confirm the change scope before editing.
3. Validate after edits with the narrowest useful checks.
4. Update the checklist when project status changes.
5. Summarize changed files and validation results.

## Product Direction

SharmaAI is an AI-assisted maths learning platform for CBSE Class X students using R.D. Sharma-style chapter progression.

The app should feel like a real learning product, not a marketing mockup. Prioritize student workflows:

- Resume learning quickly.
- Browse chapters and see progress.
- Watch topic lessons with solved examples.
- Submit exercise answers.
- Receive clear evaluation and remediation.
- Track progress and weak concepts.
- Let admins monitor learners, submissions, and content readiness.

## Technical Direction

- Framework: Static Vite React app with TanStack Router file-based routing in `src/routes`.
- UI: React 19, Tailwind CSS v4, shadcn-style primitives, lucide-react icons.
- Data: currently static mock data in `src/lib/mock-data.ts`.
- Routing: `src/routeTree.gen.ts` is generated and must not be edited manually.
- Shared navigation: `src/components/app-header.tsx`.
- Admin dashboard feature code: `src/features/admin/admin-dashboard.tsx`.
- Admin student management section: `src/features/admin/student-management.tsx`.
- Admin content management section: `src/features/admin/content-management.tsx`.
- Admin submission review queue: `src/features/admin/submission-review-queue.tsx`.
- Theme tokens and gradients: `src/styles.css`.
- Browser entry: `src/main.tsx`.
- Routing setup: `src/router.tsx` uses hash history for static hosting compatibility.
- Static output: `npm run build` writes deployable assets to `dist/`.
- Vite config: explicit TanStack Router, React, Tailwind, and tsconfig-paths plugins in `vite.config.ts`.

## Change Rules

- Read the relevant files before editing.
- Keep changes scoped to the user request.
- Follow existing component, route, and styling patterns.
- Use `apply_patch` for manual file edits.
- Do not edit generated files such as `src/routeTree.gen.ts`.
- Do not edit `node_modules` or `dist`.
- Do not introduce backend services, auth, storage, or paid APIs unless explicitly requested.
- Do not add platform-specific wrapper packages, metadata, error hooks, or generated platform config.
- Preserve mobile responsiveness and avoid text overflow.
- Prefer existing UI primitives from `src/components/ui`.
- Use lucide-react icons for UI actions when an icon is needed.
- Keep README and this steering file updated when the project structure or status changes.

## Validation Rules

Before making changes:

- Read the target files.
- Check for existing patterns and related types.
- Identify generated files that should not be edited.

After making changes:

- Run `npm run lint` when TypeScript, React, or route files change.
- Run `npm run build` when routing, config, static entry, or shared app behavior changes.
- For documentation-only changes, read the edited document back with `sed`.
- For visual/frontend changes, start or use the dev server and inspect the changed pages when practical.
- Report any validation command that could not be run.

## Done

- [x] Read the project structure and authored source files.
- [x] Created root `README.md`.
- [x] Documented tech stack, setup commands, routes, project structure, and limitations.
- [x] Created this `STEERING.md` project guide.
- [x] Added validation expectations for future changes.
- [x] Moved admin dashboard implementation into `src/features/admin/`.
- [x] Removed the previous platform-specific app code, metadata, and Vite wrapper usage.
- [x] Added admin Student Management section with filters, detail panel, support marking, and remediation assignment.
- [x] Added admin Content Management section with local CRUD, readiness, publish controls, and previews.
- [x] Added admin Submission Review Queue with OCR status, AI evaluation status, manual review, and side-by-side answer review.
- [x] Converted the app from a TanStack Start server app to a static Vite SPA.
- [x] Added `index.html` and `src/main.tsx` as the static browser entry.
- [x] Switched routing to hash history for GitHub Pages-compatible deep links.
- [x] Removed unused server entry, server function example, SSR fallback helpers, and Start/Nitro dependencies.
- [x] Removed stale Bun lock/config files; npm is the documented package manager via `package-lock.json`.

## To Do

- [ ] Replace static mock data with a real data source or typed adapter layer.
- [ ] Add authentication and student/admin roles.
- [ ] Implement real answer upload storage.
- [ ] Implement OCR and AI-based answer evaluation.
- [ ] Persist exercise status, scores, and mastery progress.
- [ ] Connect lesson content to real chapter/topic data.
- [ ] Implement real PDF downloads.
- [ ] Add automated tests for critical routes and workflows.
- [ ] Review and update metadata in `src/routes/__root.tsx`.
- [ ] Verify all core pages on mobile and desktop viewports.

## Current Known Limitations

- Student, chapter, exercise, and admin data are static demo values.
- Answer submission and evaluation are simulated in local state.
- Buttons for PDF download, camera, email submission, admin content generation, and notifications are placeholders.
- There is no persistence across refreshes.
- There is no user login or authorization.
- Static hosting uses hash URLs such as `/#/dashboard` to avoid server rewrite requirements.
