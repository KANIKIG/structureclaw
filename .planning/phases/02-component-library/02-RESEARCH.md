# Phase 2: Component Library - Research

**Researched:** 2026-03-09
**Domain:** shadcn/ui component patterns, Radix UI primitives, micro-interactions
**Confidence:** HIGH

## Summary

Phase 2 builds a complete component library using shadcn/ui's copy-paste workflow with Radix UI primitives for accessibility. All components follow the established patterns from Phase 1: cva for variants, cn() utility for class composition, and CSS custom properties for theming. The command palette uses cmdk library with fuzzy search, and toast notifications use Sonner for a polished experience.

**Primary recommendation:** Use shadcn/ui CLI to scaffold components, then customize variants and styling to match the Linear/Notion aesthetic established in Phase 1.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use shadcn/ui for component primitives (copy-paste workflow, full control)
- Use Zustand with factory pattern for SSR-safe state management
- Build theme tokens from day one to avoid dark mode retrofit
- Use Vitest over Jest for ESM-native support and faster execution
- Use geist npm package with next/font optimization for zero layout shift
- Use HSL format for broader browser compatibility
- Follow shadcn/ui background/foreground pairing convention for semantic tokens
- Use next-themes for SSR-safe theme management with localStorage persistence
- Implement simplified cycling toggle instead of dropdown
- Use class-based dark mode to match Tailwind darkMode configuration
- Use Tailwind @apply for glassmorphism utilities in @layer components
- Use cva for type-safe component variants

### Claude's Discretion
- Component variant design (sizes, states beyond shadcn/ui defaults)
- Micro-interaction timing and easing curves
- Command palette item ordering and grouping

### Deferred Ideas (OUT OF SCOPE)
- Animation library integration (Framer Motion) - Phase 1 decided no animations
- Complex dropdown menus (shadcn/ui dropdown not yet available)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| COMP-01 | Button component with variants (default, destructive, outline, ghost) and sizes (sm, md, lg) | Already implemented in `components/ui/button.tsx` - extend with additional variants if needed |
| COMP-02 | Card component for content containers | Already implemented in `components/ui/card.tsx` - simple forwardRef pattern |
| COMP-03 | Input component with focus states and validation styling | shadcn/ui Input pattern with ring focus states |
| COMP-04 | Textarea component for multi-line input | shadcn/ui Textarea pattern, same focus states as Input |
| COMP-05 | Select component for dropdown selection | @radix-ui/react-select with shadcn/ui styling |
| COMP-06 | Dialog/Modal component with focus trapping | @radix-ui/react-dialog for accessibility, focus trap built-in |
| COMP-07 | Toast notifications with auto-dismiss | Sonner library with Toaster component |
| COMP-08 | Skeleton component for loading states | shadcn/ui Skeleton with pulse animation |
| COMP-09 | Badge component for status indicators | shadcn/ui Badge with variant styles |
| COMP-10 | Command palette with Cmd/Ctrl+K trigger | cmdk library with fuzzy search |
| COMP-11 | Micro-interactions (hover, click, focus) | Tailwind transitions with 200-300ms timing |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @radix-ui/react-dialog | ^1.0.0 | Modal/Dialog primitive | Accessible, handles focus trap, keyboard dismiss |
| @radix-ui/react-select | ^2.0.0 | Select dropdown primitive | Native select alternative with full accessibility |
| @radix-ui/react-slot | ^1.0.0 | Polymorphic component pattern | Used by shadcn/ui Button pattern |
| cmdk | ^1.0.0 | Command palette | Built-in fuzzy search, keyboard navigation |
| sonner | ^1.0.0 | Toast notifications | Polished animations, positioning, stacking |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | ^0.7.0 | Component variant definitions | All components with size/variant props |
| clsx | ^2.0.0 | Conditional class joining | Internal to cn() utility |
| tailwind-merge | ^2.0.0 | Tailwind class deduplication | Internal to cn() utility |
| lucide-react | ^0.400.0 | Icon library | Command palette icons, toast icons |

### Already Installed (Phase 1)
| Library | Purpose |
|---------|---------|
| class-variance-authority | cva for glassVariants |
| clsx + tailwind-merge | cn() utility |
| next-themes | ThemeProvider |
| vitest + @vitest/ui | Test framework |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sonner | react-hot-toast | Sonner has better animations and positioning API |
| cmdk | react-cmdk | cmdk is the shadcn/ui recommended library |
| Radix UI | Headless UI | Radix has better composition patterns for shadcn/ui |

**Installation:**
```bash
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slot cmdk sonner
```

## Architecture Patterns

### Recommended Project Structure
```
frontend/src/
├── components/
│   ├── ui/                    # shadcn/ui components (copy-paste)
│   │   ├── button.tsx         # Already exists
│   │   ├── card.tsx           # Already exists
│   │   ├── input.tsx          # New - COMP-03
│   │   ├── textarea.tsx       # New - COMP-04
│   │   ├── select.tsx         # New - COMP-05
│   │   ├── dialog.tsx         # New - COMP-06
│   │   ├── toast.tsx          # New - COMP-07 (Sonner wrapper)
│   │   ├── skeleton.tsx       # New - COMP-08
│   │   ├── badge.tsx          # New - COMP-09
│   │   └── command.tsx        # New - COMP-10
│   ├── theme-provider.tsx     # Already exists
│   └── theme-toggle.tsx       # Already exists
├── lib/
│   └── utils.ts               # cn(), glassVariants - Already exists
└── app/
    ├── providers.tsx          # Add Toaster here
    └── globals.css            # Design tokens - Already exists
```

### Pattern 1: Component with cva Variants
**What:** Define component variants using cva for type-safe props
**When to use:** Components with multiple visual states (Button, Badge)
**Example:**
```typescript
// Source: Existing frontend/src/components/ui/button.tsx pattern
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### Pattern 2: Simple ForwardRef Component
**What:** Components without variants use simple forwardRef with cn()
**When to use:** Static components like Card, Skeleton
**Example:**
```typescript
// Source: Existing frontend/src/components/ui/card.tsx pattern
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"
```

### Pattern 3: Radix UI Primitive Wrapper
**What:** Wrap Radix primitives with shadcn/ui styling
**When to use:** Dialog, Select (complex interactive components)
**Example:**
```typescript
// Source: shadcn/ui Dialog pattern
import * as DialogPrimitive from "@radix-ui/react-dialog"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName
```

### Pattern 4: Command Palette with cmdk
**What:** Command palette with fuzzy search and keyboard navigation
**When to use:** COMP-10 command palette
**Example:**
```typescript
// Source: shadcn/ui Command pattern
import { Command as CommandPrimitive } from "cmdk"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

// Usage with keyboard shortcut
import { CommandDialog } from "@/components/ui/command"

// In component:
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen((open) => !open)
    }
  }
  document.addEventListener("keydown", down)
  return () => document.removeEventListener("keydown", down)
}, [])
```

### Pattern 5: Sonner Toast Integration
**What:** Toast notifications with Sonner
**When to use:** COMP-07 toast notifications
**Example:**
```typescript
// Source: shadcn/ui Sonner pattern
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// In providers.tsx, add Toaster
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

### Anti-Patterns to Avoid
- **Hardcoded colors:** Never use hex values directly; use CSS variables (--background, --primary, etc.)
- **Inline styles for theming:** Use Tailwind classes that reference CSS variables
- **Custom focus states:** Use the shadcn/ui focus-visible:ring pattern for consistency
- **Skipping accessibility:** Always use Radix primitives for interactive components
- **Animation on initial render:** Avoid animate-in on first paint to prevent flash

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Focus trapping in modals | Custom focus management | @radix-ui/react-dialog | Handles edge cases, screen readers, escape key |
| Dropdown keyboard navigation | Custom select with JS | @radix-ui/react-select | Type-ahead, arrow keys, screen reader announcements |
| Toast positioning/stacking | Custom toast system | Sonner | Multi-toaster positioning, pause on hover, swipe to dismiss |
| Command palette fuzzy search | Custom filter logic | cmdk | Built-in fuzzy matching, keyboard navigation, grouping |
| Class composition with conflicts | String concatenation | cn() with clsx + tailwind-merge | Handles Tailwind class conflicts correctly |

**Key insight:** Radix UI and cmdk handle accessibility edge cases that are easy to miss: focus restoration, escape key propagation, screen reader announcements, type-ahead search, and keyboard navigation.

## Common Pitfalls

### Pitfall 1: Missing forwardRef displayName
**What goes wrong:** React DevTools shows "Anonymous" instead of component name
**Why it happens:** Forgetting to set displayName after forwardRef
**How to avoid:** Always add `Component.displayName = "ComponentName"` after each forwardRef
**Warning signs:** DevTools debugging confusion, component stack traces unclear

### Pitfall 2: Toast Not Appearing
**What goes wrong:** toast() calls don't show any notification
**Why it happens:** Toaster component not rendered in provider tree
**How to avoid:** Add `<Toaster />` to providers.tsx after ThemeProvider
**Warning signs:** No toast UI, but toast.success() calls in code

### Pitfall 3: Dialog Focus Trap Issues
**What goes wrong:** Tab escapes dialog, focus goes to background elements
**Why it happens:** Not using DialogPortal or incorrect z-index
**How to avoid:** Use full shadcn/ui Dialog pattern with Portal and Overlay
**Warning signs:** Tab navigation leaves dialog, screen reader reads background

### Pitfall 4: Command Palette Not Opening
**What goes wrong:** Cmd/Ctrl+K doesn't trigger command palette
**Why it happens:** Event listener not attached, or event.preventDefault() missing
**How to avoid:** Use useEffect with cleanup, check e.metaKey || e.ctrlKey
**Warning signs:** Keyboard shortcut does nothing, or triggers browser search

### Pitfall 5: Theme Mismatch in Components
**What goes wrong:** Component colors don't update when theme changes
**Why it happens:** Using hardcoded colors instead of CSS variables
**How to avoid:** Always use Tailwind classes that reference CSS variables (bg-background, text-foreground)
**Warning signs:** Dark mode shows light colors, or vice versa

### Pitfall 6: Animation Flash on Page Load
**What goes wrong:** Components animate in on initial render
**Why it happens:** data-[state=open]:animate-in applied without state management
**How to avoid:** Only use animate-in for state transitions, not initial render
**Warning signs:** Content animates in when page first loads

## Code Examples

Verified patterns from official sources:

### Input Component (COMP-03)
```typescript
// Source: https://ui.shadcn.com/docs/components/input
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }
```

### Select Component (COMP-05)
```typescript
// Source: https://ui.shadcn.com/docs/components/select
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
```

### Skeleton Component (COMP-08)
```typescript
// Source: https://ui.shadcn.com/docs/components/skeleton
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
export { Skeleton }
```

### Badge Component (COMP-09)
```typescript
// Source: https://ui.shadcn.com/docs/components/badge
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
export { Badge, badgeVariants }
```

### Command Palette Keyboard Shortcut (COMP-10)
```typescript
// Source: https://ui.shadcn.com/docs/components/command
"use client"

import * as React from "react"
import { CommandDialog } from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* Command items */}
    </CommandDialog>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom toast systems | Sonner library | 2023+ | Better positioning, animations, accessibility |
| Custom command palette | cmdk library | 2022+ | Built-in fuzzy search, keyboard navigation |
| react-hot-toast | Sonner | shadcn/ui default | Cleaner API, better animations |
| Manual focus management | Radix UI primitives | 2022+ | Accessibility built-in, less code |

**Deprecated/outdated:**
- Reach UI: Use Radix UI instead (same team, newer API)
- react-aria-menu: Use @radix-ui/react-select instead

## Micro-Interaction Guidelines (COMP-11)

### Animation Timing
| Interaction | Duration | Easing | Properties |
|-------------|----------|--------|------------|
| Hover color change | 150ms | ease-in-out | background-color, color, border-color |
| Click/tap feedback | 100ms | ease-out | transform: scale(0.98) |
| Focus ring | 0ms (instant) | - | box-shadow |
| Modal open | 200ms | ease-out | opacity, transform (scale 0.95 -> 1) |
| Modal close | 150ms | ease-in | opacity, transform (scale 1 -> 0.95) |
| Toast enter | 200ms | ease-out | opacity, transform (translateY) |
| Toast exit | 150ms | ease-in | opacity, transform |

### Implementation Pattern
```typescript
// Add to Tailwind classes for interactive elements
const interactionClasses = cn(
  // Base transition
  "transition-all duration-150 ease-in-out",
  // Hover state
  "hover:bg-accent hover:text-accent-foreground",
  // Active/click state
  "active:scale-[0.98]",
  // Focus state (instant for accessibility)
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
)
```

### CSS Custom Properties for Consistent Timing
```css
/* Add to globals.css if custom timing needed */
:root {
  --transition-fast: 100ms;
  --transition-normal: 150ms;
  --transition-slow: 200ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

## Open Questions

1. **Should we use shadcn/ui CLI or manual copy-paste?**
   - What we know: CLI installs dependencies and creates files automatically
   - What's unclear: Whether project has custom component paths configured
   - Recommendation: Use CLI with `npx shadcn-ui@latest add <component>`, then customize

2. **Toast position preference?**
   - What we know: ROADMAP specifies "bottom-right"
   - What's unclear: Whether this applies to all toasts or is configurable
   - Recommendation: Default to bottom-right as specified, can be overridden per-toast

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (from Phase 1) |
| Config file | frontend/vitest.config.ts |
| Quick run command | `npm run test -- --run` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COMP-01 | Button renders with variants | unit | `vitest run button.test.tsx` | ❌ Wave 0 |
| COMP-02 | Card renders children | unit | `vitest run card.test.tsx` | ❌ Wave 0 |
| COMP-03 | Input handles focus states | unit | `vitest run input.test.tsx` | ❌ Wave 0 |
| COMP-04 | Textarea handles focus states | unit | `vitest run textarea.test.tsx` | ❌ Wave 0 |
| COMP-05 | Select keyboard navigation | unit | `vitest run select.test.tsx` | ❌ Wave 0 |
| COMP-06 | Dialog focus trap | integration | `vitest run dialog.test.tsx` | ❌ Wave 0 |
| COMP-07 | Toast auto-dismiss | unit | `vitest run toast.test.tsx` | ❌ Wave 0 |
| COMP-08 | Skeleton pulse animation | visual | manual | N/A |
| COMP-09 | Badge variant styles | unit | `vitest run badge.test.tsx` | ❌ Wave 0 |
| COMP-10 | Command palette keyboard shortcut | integration | `vitest run command.test.tsx` | ❌ Wave 0 |
| COMP-11 | Micro-interaction timing | visual | manual | N/A |

### Sampling Rate
- **Per task commit:** `npm run test -- --run`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `frontend/src/components/ui/__tests__/button.test.tsx` — Button variant rendering
- [ ] `frontend/src/components/ui/__tests__/input.test.tsx` — Input focus states
- [ ] `frontend/src/components/ui/__tests__/dialog.test.tsx` — Dialog open/close
- [ ] `frontend/src/components/ui/__tests__/command.test.tsx` — Command palette keyboard
- [ ] `frontend/src/components/ui/__tests__/toast.test.tsx` — Toast rendering

## Sources

### Primary (HIGH confidence)
- shadcn/ui docs - Input, Select, Dialog, Command, Sonner, Skeleton, Badge components
- https://ui.shadcn.com/docs/components/input
- https://ui.shadcn.com/docs/components/select
- https://ui.shadcn.com/docs/components/dialog
- https://ui.shadcn.com/docs/components/command
- https://ui.shadcn.com/docs/components/sonner
- https://ui.shadcn.com/docs/components/skeleton
- https://ui.shadcn.com/docs/components/badge
- Existing project files: button.tsx, card.tsx, utils.ts, globals.css

### Secondary (MEDIUM confidence)
- Radix UI documentation for accessibility patterns
- cmdk library README for command palette API
- Sonner documentation for toast positioning

### Tertiary (LOW confidence)
- Web search for micro-interaction timing best practices (verified against multiple sources)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - shadcn/ui has established patterns, existing code shows cva/cn usage
- Architecture: HIGH - Phase 1 established patterns, shadcn/ui provides clear structure
- Pitfalls: HIGH - Common issues documented in shadcn/ui docs and community

**Research date:** 2026-03-09
**Valid until:** 30 days (shadcn/ui patterns are stable)
