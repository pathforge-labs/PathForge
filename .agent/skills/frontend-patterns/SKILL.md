---
name: frontend-patterns
description: Frontend development patterns for React and modern frameworks, with Vercel web interface guidelines
triggers: [context, frontend, react, component, ui]
---

# Frontend Patterns Skill

> **Purpose**: Apply modern frontend development patterns and production-grade web interface guidelines

---

## Overview

This skill provides best practices for building maintainable, performant frontend applications. Includes React patterns and [Vercel Labs web interface guidelines](https://github.com/vercel-labs/web-interface-guidelines) for production correctness.

---

## Component Architecture

### Atomic Design

```
atoms/          → Button, Input, Label
molecules/      → FormField, SearchInput
organisms/      → LoginForm, Header
templates/      → PageLayout, DashboardLayout
pages/          → LoginPage, DashboardPage
```

### Feature-Based Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── index.ts
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── App.tsx
```

---

## React Patterns

### Custom Hooks

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Compound Components

```tsx
<Select value={selected} onChange={setSelected}>
  <Select.Trigger>Choose option</Select.Trigger>
  <Select.Options>
    <Select.Option value="a">Option A</Select.Option>
    <Select.Option value="b">Option B</Select.Option>
  </Select.Options>
</Select>
```

### Render Props

```tsx
<DataFetcher url="/api/users">
  {({ data, loading, error }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
</DataFetcher>
```

---

## State Management

| Solution    | Use Case              |
| :---------- | :-------------------- |
| useState    | Local component state |
| useReducer  | Complex local state   |
| Context     | Theme, auth, i18n     |
| Zustand     | Simple global state   |
| Redux       | Complex global state  |
| React Query | Server state          |

---

## Performance

### Memoization

```tsx
// Expensive calculation
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items],
);

// Callback stability
const handleClick = useCallback(() => {
  onClick(id);
}, [id, onClick]);

// Component memoization
const UserCard = memo(({ user }) => <div>{user.name}</div>);
```

---

## Quick Reference

| Pattern      | Usage                  |
| :----------- | :--------------------- |
| Custom Hooks | Reusable logic         |
| Compound     | Flexible APIs          |
| Render Props | Dynamic rendering      |
| HOC          | Cross-cutting concerns |
| Context      | Global state           |
| Memoization  | Performance            |

---

## Web Interface Guidelines

> Inspired by [Vercel Labs web-design-guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines). Production-grade rules for building correct, accessible, performant web interfaces.

### Focus States

- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent
- Never `outline-none` / `outline: none` without a focus replacement
- Use `:focus-visible` over `:focus` (avoid focus ring on click)
- Group focus with `:focus-within` for compound controls

### Forms

- Inputs need `autocomplete` and meaningful `name` attributes
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- Never block paste (`onPaste` + `preventDefault`)
- Labels must be clickable (`htmlFor` or wrapping the control)
- Disable spellcheck on emails, codes, usernames (`spellCheck={false}`)
- Checkboxes/radios: label + control share single hit target (no dead zones)
- Submit button stays enabled until request starts; show spinner during request
- Errors inline next to fields; focus first error on submit
- Placeholders end with `…` and show example pattern
- `autocomplete="off"` on non-auth fields to avoid password manager triggers
- Warn before navigation with unsaved changes (`beforeunload` or router guard)

### Animation

- Honor `prefers-reduced-motion` (provide reduced variant or disable)
- Animate `transform`/`opacity` only (compositor-friendly)
- Never `transition: all` — list properties explicitly
- Set correct `transform-origin`
- SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`
- Animations must be interruptible — respond to user input mid-animation

### Typography (Micro-Rules)

- Use `…` not `...` (proper ellipsis character)
- Use curly quotes `""` not straight `""`
- Non-breaking spaces: `10 MB`, `⌘ K`, brand names
- Loading states end with `…`: `"Loading…"`, `"Saving…"`
- `font-variant-numeric: tabular-nums` for number columns/comparisons
- Use `text-wrap: balance` or `text-pretty` on headings (prevents widows)

### Content Handling

- Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0` to allow text truncation
- Handle empty states — don't render broken UI for empty strings/arrays
- User-generated content: anticipate short, average, and very long inputs

### Images

- `<img>` needs explicit `width` and `height` (prevents CLS)
- Below-fold images: `loading="lazy"`
- Above-fold critical images: `priority` or `fetchpriority="high"`

### Performance (Extended)

- Large lists (>50 items): virtualize (`virtua`, `content-visibility: auto`)
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `scrollTop`)
- Batch DOM reads/writes; avoid interleaving
- Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke
- Add `<link rel="preconnect">` for CDN/asset domains
- Critical fonts: `<link rel="preload">` with `font-display: swap`

### Navigation & State

- URL reflects state — filters, tabs, pagination, expanded panels in query params
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click, middle-click support)
- Deep-link all stateful UI (if uses `useState`, consider URL sync via `nuqs` or similar)
- Destructive actions need confirmation modal or undo window — never immediate

### Touch & Interaction

- `touch-action: manipulation` (prevents double-tap zoom delay)
- `-webkit-tap-highlight-color` set intentionally
- `overscroll-behavior: contain` in modals/drawers/sheets
- During drag: disable text selection, `inert` on dragged elements
- `autoFocus` sparingly — desktop only, single primary input; avoid on mobile

### Safe Areas & Layout

- Full-bleed layouts need `env(safe-area-inset-*)` for notches
- Avoid unwanted scrollbars: `overflow-x-hidden` on containers, fix content overflow
- Flex/grid over JS measurement for layout

### Dark Mode & Theming

- `color-scheme: dark` on `<html>` for dark themes (fixes scrollbar, inputs)
- `<meta name="theme-color">` matches page background
- Native `<select>`: explicit `background-color` and `color` (Windows dark mode)

### Locale & i18n

- Dates/times: use `Intl.DateTimeFormat` — never hardcoded formats
- Numbers/currency: use `Intl.NumberFormat` — never hardcoded formats
- Detect language via `Accept-Language` / `navigator.languages`, not IP

### Hydration Safety (React/Next.js)

- Inputs with `value` need `onChange` (or use `defaultValue` for uncontrolled)
- Date/time rendering: guard against hydration mismatch (server vs client)
- `suppressHydrationWarning` only where truly needed

### Hover & Interactive States

- Buttons/links need `hover:` state (visual feedback)
- Interactive states increase contrast: hover/active/focus more prominent than rest

### Content & Copy

- Active voice: "Install the CLI" not "The CLI will be installed"
- Title Case for headings/buttons (Chicago style)
- Numerals for counts: "8 deployments" not "eight"
- Specific button labels: "Save API Key" not "Continue"
- Error messages include fix/next step, not just the problem
- Second person; avoid first person
- `&` over "and" where space-constrained

---

## Anti-Patterns — Flag These

These patterns should be flagged during code review:

| Anti-Pattern                                        | Why It's Bad                                    |
| --------------------------------------------------- | ----------------------------------------------- |
| `user-scalable=no` or `maximum-scale=1`             | Disables zoom — accessibility violation         |
| `onPaste` with `preventDefault`                     | Blocks paste — hostile UX                       |
| `transition: all`                                   | Animates everything — performance killer        |
| `outline-none` without `:focus-visible` replacement | Invisible focus — keyboard users can't navigate |
| Inline `onClick` navigation without `<a>`           | Breaks Cmd/Ctrl+click, middle-click, crawlers   |
| `<div>` or `<span>` with click handlers             | Should be `<button>` — no keyboard/a11y support |
| Images without `width`/`height`                     | Causes CLS (layout shift)                       |
| Large arrays `.map()` without virtualization        | Performance crash on 50+ items                  |
| Form inputs without labels                          | Screen readers can't identify the field         |
| Icon buttons without `aria-label`                   | No accessible name                              |
| Hardcoded date/number formats                       | Breaks in non-US locales — use `Intl.*`         |
| `autoFocus` without justification                   | Disorienting on mobile, hijacks scroll          |
