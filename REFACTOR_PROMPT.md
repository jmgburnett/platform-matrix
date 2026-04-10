# Refactor: Platform Matrix to Gloo Design System

## Goal
Refactor `src/components/matrix-org.jsx` (rename to `.tsx`) to use the Gloo design system components that are already installed in this project.

## Available Gloo Components
All installed in `src/components/`:
- **Button** (`button.tsx`) - variants: primary, secondary, ghost, destructive, link. Sizes: sm, md, lg. Shapes: round, square.
- **TabGroup** (`tab-group.tsx`) - animated segmented control with sliding indicator. Use for the Matrix/Layers/Agentic OS view switcher.
- **Avatar** (`avatar.tsx`) - with gradient fallback, initials, seeds. Use for the person chips.
- **Card** (`card.tsx`) - slot-based card system. Use for the JD modals, layer description cards, and section panels.
- **Input** (`ui/input.tsx`) - styled text input. Use for editable text fields.
- **Separator** (`ui/separator.tsx`) - divider lines.

## What to Refactor
1. **View switcher** (currently custom buttons) → Use `TabGroup` + `TabGroupItem`
2. **All buttons** (Add Column, Add Row, Add Person, etc.) → Use Gloo `Button` with appropriate variants
3. **Person chips** (the role/name badges in cells) → Use `Avatar` for the initials circle + styled chip
4. **Modals** (JD Modal, Add Column, Add Row, Assign Rows) → Use `Card` for the modal content panels
5. **Editable text inputs** → Use Gloo `Input` component
6. **Inline styles** → Convert to Tailwind CSS classes wherever possible
7. **Color system** → Keep the existing accent color system but use Tailwind utilities for standard colors (backgrounds, text, borders)

## Rules
- Keep ALL existing functionality intact — editing, adding/removing rows/columns, JD modals, layer view, agentic OS view, drag/hover behaviors
- Keep the dark theme aesthetic — this is meant to look like a premium dark dashboard
- The data model (JDS, layerDescriptions, initData) should remain unchanged
- Convert from `.jsx` to `.tsx` with proper TypeScript types
- Use `cn()` from `@/lib/utils` for class merging
- The component must still `export default function MatrixOrg()`

## Don't
- Don't simplify or remove any features
- Don't change the data structures
- Don't remove the inline editing capability
- Don't break the responsive layout
