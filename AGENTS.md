# Admin Panel Guidelines & Standards

These rules are strictly enforced across the `lms-admin-panel` codebase:

---

## 1. Modular Architecture (Small Sub-Components)
- Always break down pages, layouts, and complex forms into small, focused sub-components.
- Keep page files (`page.tsx`) lightweight, using them primarily to assemble sub-components and bind page-level state.
- Extract form fields, badges, summary cards, and action bars into dedicated files in `src/components/`.

---

## 2. Design System: Strict `globals.css` Tokens for Typography & Colors
- All text styles, fonts, weights, and colors MUST strictly use the predefined classes in `src/app/globals.css`.
- **Typography Tokens**:
  - Headings: `heading-display-h1`, `heading-h1-bold`, `heading-h2-bold`, `heading-h3`, `heading-h4`, `heading-h5`, `heading-h6`.
  - Body: `body-xl-regular`, `body-l-medium`, `body-regular`, `body-medium`, `body-sm-medium`, `body-sm-regular`, `body-xsm-medium`, `body-xsm-regular`, `body-2xsm-regular`.
  - Titles & Labels: `title-bold`, `title-medium`, `title-sm`.
- **Color Tokens**:
  - Brand: `text-brand-orange`, `text-brand-orange-hover`, `bg-brand-orange`, `bg-brand-orange-light`, `border-brand-orange`.
  - Neutral / Text: `text-primary-500` (#0F172A), `text-primary-400` (#334155), `text-primary-300` (#64748B), `subtext-500`.
  - Status: `text-red`, `text-red-dark`, `bg-red-14`, `text-green`, `bg-green-bg`, `text-blue`, `bg-blue-14`.
  - Borders & Cards: `border-dash`, `dashboard-card`, `edupro-glow-btn`.
- **Strict Prohibition**: Never use arbitrary Tailwind classes or inline colors when corresponding tokens exist in `globals.css`.

---

## 3. Reusable Components First
- Prioritize reusable components located in `src/components/ui/`, `src/components/common/`, and `src/components/layout/`.
- Every shared component must have typed TypeScript props and sensible defaults.
- Prevent duplicate implementations of buttons, inputs, alerts, modals, and badges.

---

## 4. Proper Frontend Validation
- All forms must use `react-hook-form` with `zod` schemas via `@hookform/resolvers/zod`.
- Show immediate, human-readable error messages below each input field.
- Form submit buttons must indicate loading state and be disabled while submitting.

---

## 5. Proper Toast Notifications
- Use `sonner` (`toast`) for all asynchronous actions.
- Implement the complete lifecycle: `toast.loading(...)` -> `toast.success(...)` or `toast.error(...)`.
- Format backend API error messages into clear, friendly English before displaying.

---

## 6. Proper Skeleton Loading
- When loading data or navigating async views, render animated skeleton placeholders matching the exact shape of the layout.
- Use `animate-pulse` with rounded borders matching the design system (`rounded-xl`, `bg-slate-100` / `bg-slate-200`).
- Avoid empty white screens or bare spinning icons without layout structure.

---

## 7. Single Language Policy
- **English Only**: The entire user interface must always remain in English.
- **No Language Toggler/Selector**: NEVER include any language selector, dropdown, toggle button, or globe icon anywhere in the application.
