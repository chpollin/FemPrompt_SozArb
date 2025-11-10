# Design System - SozArb Research Vault

Professional academic web interface for systematic literature review.

## Design Principles

1. **Professional** - Academic research tool aesthetic
2. **Functional** - Content-first, minimal decoration
3. **Neutral** - Grayscale foundation with blue accent
4. **Clear** - Strong hierarchy, readable typography
5. **Accessible** - WCAG AA compliant contrast ratios

## Color Palette

### Primary Colors
```css
--primary: #1e40af        /* Professional blue - primary actions */
--primary-dark: #1e3a8a   /* Hover states */
--primary-light: #3b82f6  /* Accents */
--secondary: #0f172a      /* Supporting elements */
```

### Semantic Colors
```css
--success: #10b981   /* Include decision */
--warning: #f59e0b   /* Unclear decision */
--danger: #ef4444    /* Critical actions */
--info: #3b82f6      /* Informational */
```

### Decision Colors
```css
--decision-include: #10b981   /* Green - included papers */
--decision-exclude: #6b7280   /* Gray - excluded papers */
--decision-unclear: #f59e0b   /* Orange - unclear status */
```

### Neutral Scale
```css
--gray-50: #fafaf9   /* Background */
--gray-100: #f5f5f4  /* Secondary background */
--gray-200: #e7e5e4  /* Borders */
--gray-300: #d6d3d1  /* Disabled */
--gray-400: #a8a29e  /* Placeholder */
--gray-500: #78716c  /* Secondary text */
--gray-600: #57534e  /* Body text */
--gray-700: #44403c  /* Emphasis */
--gray-800: #292524  /* Headings */
--gray-900: #1c1917  /* Header background */
```

## Typography

### Font Families
```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Scale
- **Display (h1):** 2rem (32px), weight 700
- **Heading (h2):** 1.5rem (24px), weight 600
- **Subheading (h3):** 1.125rem (18px), weight 600
- **Body:** 1rem (16px), weight 400
- **Small:** 0.875rem (14px), weight 400
- **Caption:** 0.75rem (12px), weight 600, uppercase

### Line Heights
- **Tight:** 1.2 (headings)
- **Normal:** 1.6 (body text)
- **Relaxed:** 1.8 (long-form content)

## Spacing

8px base unit system:
```
--space-1: 0.5rem   (8px)
--space-2: 1rem     (16px)
--space-3: 1.5rem   (24px)
--space-4: 2rem     (32px)
--space-6: 3rem     (48px)
--space-8: 4rem     (64px)
```

## Shadows

Subtle elevation system:
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

## Components

### Paper Cards
- White background with subtle shadow
- 8px border-radius
- High-relevance: 3px blue left border
- Hover: Elevated shadow, scale 1.01
- Decision badge: Top-right, colored by status

### Buttons & Navigation
- Primary: Blue background, white text
- Secondary: White background, blue border
- Tab active: Blue bottom border (3px)
- Hover: Slight darkening, no dramatic effects

### Relevance Indicators
- Progress bar: Blue fill on gray background
- Stars: FontAwesome solid/regular icons
- Score: Bold blue number

### Modal
- Backdrop: rgba(0, 0, 0, 0.75)
- Content: White with large padding
- Close: Top-right X button
- Max-width: 800px

## Icons

**FontAwesome 6.5.1** (no emojis)

### Decision Icons
- Include: `fas fa-check-circle` (green)
- Exclude: `fas fa-times-circle` (gray)
- Unclear: `fas fa-question-circle` (orange)

### Dimension Icons
- AI Literacy: `fas fa-robot`
- Vulnerable Groups: `fas fa-shield-alt`
- Bias Analysis: `fas fa-balance-scale`
- Practical Implementation: `fas fa-tools`
- Professional Context: `fas fa-users`

### UI Icons
- Search: `fas fa-search`
- Filter: `fas fa-filter`
- Relevance: `fas fa-chart-line`
- Star (filled): `fas fa-star`
- Star (empty): `far fa-star`

## Layout

### Container Widths
- Max content width: 1400px
- Modal max width: 800px
- Card minimum: 300px

### Grid Systems
- Stats bar: Auto-fit, min 180px
- Papers grid: 3 columns (desktop), 2 (tablet), 1 (mobile)
- Dashboard charts: 2 columns (desktop), 1 (mobile)

### Responsive Breakpoints
```css
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Mobile */ }
```

## Accessibility

- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus indicators: 2px blue outline
- Keyboard navigation: All interactive elements
- ARIA labels: Modal, navigation, buttons
- Semantic HTML: header, nav, main, section

## Performance

- CSS Variables for theming
- No JavaScript for styling
- Minimal animations (hover only)
- Lazy graph initialization
- Efficient DOM updates

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE11 support

## File Organization

```
docs/css/research.css
├── Variables (lines 1-46)
├── Reset & Base (47-62)
├── Header (64-92)
├── Stats Bar (94-132)
├── Navigation (134-180)
├── Search & Filters (182-268)
├── Papers Grid (270-380)
├── Paper Cards (382-480)
├── Modal (482-560)
├── Dashboard (562-620)
├── Graph (622-650)
└── Responsive (652-674)
```

## Design Rationale

**Why neutral colors?**
Academic context requires professional, distraction-free interface. Blue conveys trust and authority.

**Why FontAwesome?**
Consistent icon system, professional appearance, better rendering than emojis.

**Why minimal shadows?**
Flat design trend in academic tools, reduces visual noise, improves focus on content.

**Why Inter font?**
Excellent readability, neutral character, widely used in academic/technical interfaces.

## Future Considerations

- Dark mode (invert gray scale, adjust blues)
- Print stylesheet for paper export
- High contrast mode for accessibility
- Custom color themes for other research projects
