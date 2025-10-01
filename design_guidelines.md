# Design Guidelines: PPID Kabupaten Sorong

## Design Approach

**Reference-Based with Cultural Integration**: Drawing inspiration from modern Indonesian government portals (Jakarta Smart City, Bandung Command Center) combined with tasteful Papua cultural elements. The design balances professional government standards with regional identity.

## Core Design Principles

1. **Cultural Respect**: Papua motifs as subtle accents, never overpowering
2. **Professional Authority**: Clean, trustworthy, government-appropriate
3. **Accessibility First**: High contrast, clear hierarchy, readable typography
4. **Consistency**: Single design system across all pages - no variations

## Color Palette

### Primary Colors (from Kabupaten Sorong Logo)
- **Primary Blue**: 214 88% 51% (Deep royal blue - main brand color)
- **Primary Blue Light**: 217 91% 60% (Interactive states)
- **Primary Blue Dark**: 213 94% 41% (Headers, emphasis)

### Secondary Colors (from Logo Crown)
- **Gold Accent**: 38 92% 50% (Sparingly used for calls-to-action)
- **Gold Light**: 43 96% 56% (Hover states on gold elements)

### Papua Cultural Accents
- **Earth Terracotta**: 14 65% 48% (Subtle borders, dividers)
- **Ochre Warm**: 32 88% 55% (Papua pattern fills)
- **Deep Brown**: 25 35% 25% (Footer, text on light backgrounds)

### Neutrals (Dark Mode Optimized)
- **Background**: 220 15% 8% (Deep navy-black)
- **Surface**: 220 13% 12% (Card backgrounds)
- **Surface Elevated**: 220 12% 16% (Modals, elevated cards)
- **Border**: 220 10% 25% (Dividers)
- **Text Primary**: 0 0% 98% (Main content)
- **Text Secondary**: 220 5% 65% (Supporting text)

## Typography

**Font Stack**: 'Inter' for UI, 'Poppins' for headings (professional, excellent readability)

**Scale**:
- Display (Hero): 3.5rem / 700 weight
- H1: 2.5rem / 700 weight
- H2: 2rem / 600 weight
- H3: 1.5rem / 600 weight
- H4: 1.25rem / 600 weight
- Body: 1rem / 400 weight
- Small: 0.875rem / 400 weight
- Caption: 0.75rem / 500 weight

**Line Heights**: 1.5 for body, 1.2 for headings

## Layout System

**Spacing Units**: Tailwind scale focused on 2, 4, 6, 8, 12, 16, 20, 24 for consistency

**Container Widths**:
- Full-width sections: `w-full` with inner `max-w-7xl`
- Content sections: `max-w-6xl`
- Text content: `max-w-4xl`
- Tight content: `max-w-2xl`

**Grid System**:
- Desktop (lg): Up to 3-4 columns for cards/features
- Tablet (md): 2 columns maximum
- Mobile: Single column stack

## Component Library

### Navigation
- **Sticky header** with blur backdrop
- Logo left, navigation center, language/search right
- Dropdown menus on hover with subtle Papua pattern border accent
- Mobile: Hamburger menu with slide-in drawer

### Hero Section
**Large hero image** featuring Kabupaten Sorong landscape (mountains, coastline, or cultural site)
- Gradient overlay: `from-blue-900/90 to-blue-800/60`
- Centered content with display typography
- Two-button CTA layout (primary gold, secondary outline with blur backdrop)
- Subtle Papua geometric pattern as SVG background layer (10% opacity)

### Cards
- Dark surface background with subtle border
- Hover: Slight elevation with blue glow shadow
- Icon/image top, title, description, optional CTA
- Papua pattern as thin accent line on top edge

### Forms
- Dark input backgrounds with light borders
- Focus: Blue ring with slight glow
- Labels above inputs, helper text below
- File upload areas with Papua pattern border on drag-over
- Validation states: Green for success, red for error with icons

### Data Display
- Tables: Striped dark rows, sticky headers
- Statistics: Large numbers with subtle gold accents
- Status badges: Rounded pills with semantic colors
- Document lists: Icon left, metadata right, download button

### Papua Cultural Elements Integration

**Motif Application** (Subtle & Tasteful):
1. **Asmat Woodcarving Pattern**: Simplified geometric version as:
   - Border accents on section dividers (1px, 20% opacity)
   - Background pattern on hero overlay (5-10% opacity)
   - Decorative element in footer

2. **Tifa Drum Pattern**: Abstract circular motifs as:
   - Corner decorations on cards (very subtle)
   - Loading spinner design
   - Bullet points in lists

3. **Traditional Weaving Pattern**: Linear geometric designs as:
   - Horizontal dividers between sections
   - Sidebar decorative elements
   - Table header backgrounds (very subtle)

**Implementation Rules**:
- Never use bright colors for Papua patterns - always ochre, terracotta, or brown at low opacity
- Patterns as SVG for crisp rendering
- Maximum 2 pattern types per page to avoid visual clutter
- Patterns should complement, never compete with content

## Page-Specific Layouts

### Homepage
1. **Hero**: Full viewport with Sorong landscape image, overlay, centered CTA
2. **Quick Access**: 3-card grid with icons (Permohonan, Track, DIP)
3. **Info Categories**: 4-column grid with Papua pattern borders
4. **Statistics Dashboard**: 4 metrics in card layout with gold accent numbers
5. **Recent News**: 3-column card grid with images
6. **Footer**: 4-column layout (About, Services, Legal, Contact) with subtle pattern background

### Information Pages (Berkala, Serta Merta, etc.)
- **Sidebar filter** (left): Categories, years, document types
- **Main content** (right): Card grid of documents
- Each card: Document icon, title, metadata, download button
- Pagination at bottom

### Form Pages (Permohonan)
- **Two-column layout** on desktop: Form left, info/help right
- **Progress indicator** at top for multi-step forms
- **Large input fields** with clear labels
- **File upload zones** with drag-drop and Papua pattern border animation

### Admin Dashboard
- **Sidebar navigation** (fixed left): Menu with Papua divider patterns
- **Top bar**: Breadcrumbs, user profile, notifications
- **Main content**: Grid of metric cards, charts, recent activity
- **Tables**: Sortable, filterable, with action buttons

## Images

### Required Images
1. **Hero Image**: Panoramic Kabupaten Sorong landscape (coast, mountains, or Raja Ampat vista) - high quality, 1920x800px minimum
2. **Section Backgrounds**: Subtle texture images of Papua traditional materials (woven patterns, wood grain) at 10% opacity
3. **Document Icons**: PDF, Excel, Word icons in brand colors
4. **Placeholder Avatar**: For admin profiles

### Image Treatment
- All images have slight blue color overlay for brand consistency
- Lazy loading for performance
- WebP format with JPG fallback
- Responsive srcset for different viewport sizes

## Animations

Use **very sparingly** - government sites need stability:
- Card hover: Subtle lift (translate-y: -2px) with shadow
- Button hover: Slight scale (1.02) with color shift
- Page transitions: Fade only, no slides
- Loading states: Papua-inspired circular spinner

## Accessibility

- WCAG AA minimum contrast ratios (dark mode optimized)
- Focus indicators: Blue ring with 2px offset
- Skip to main content link
- Alt text on all images
- ARIA labels on interactive elements
- Keyboard navigation for all features

## Responsive Breakpoints

- Mobile: < 640px (1 column, stacked)
- Tablet: 640px - 1024px (2 columns max)
- Desktop: 1024px - 1280px (3-4 columns)
- Wide: > 1280px (max-width containers)

## Design Consistency Checklist

✅ All buttons use same primary/secondary/outline variants
✅ All cards have same elevation and border treatment
✅ All forms use same input styling
✅ Papua patterns limited to 2 types per page, low opacity only
✅ Color palette strictly adhered to - no ad-hoc colors
✅ Spacing uses defined scale only (no random margins)
✅ Typography uses defined scale only (no random font sizes)

This single design system will be applied consistently across all pages to prevent template duplication.