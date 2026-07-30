# Hospital Queue Management - Design System

This document describes the clinical design system implemented for the Hospital Queue Management application.

## Design Philosophy

**Clinical, Calm, Legible** — The interface prioritizes clarity and ease of scanning over decorative elements. Designed for healthcare professionals who need to quickly assess queue status and make decisions.

## Color Palette

### Primary Colors (Muted Slate/Blue)
- **Primary**: `#3b5998` - Main brand color, headers, primary actions
- **Primary Dark**: `#2d4373` - Hover states, emphasis
- **Secondary**: `#5a7ba8` - Supporting elements

### Background & Surface
- **Background**: `#f8f9fa` - Page background (light gray)
- **Surface**: `#ffffff` - Cards, forms, elevated elements
- **Border**: `#dce1e6` - Subtle borders, separators

### Status Colors (Color-Coded Pills)

#### Waiting Status
- **Background**: `#fef3c7` (Amber/Yellow - soft)
- **Text**: `#92400e` (Dark amber)
- **Usage**: Patients in waiting queue

#### In Consultation Status
- **Background**: `#dbeafe` (Blue - soft)
- **Text**: `#1e40af` (Dark blue)
- **Usage**: Patient currently with doctor

#### Completed Status
- **Background**: `#d1fae5` (Green - soft)
- **Text**: `#065f46` (Dark green)
- **Usage**: Completed consultations

#### Urgent Priority
- **Background**: `#fee2e2` (Red/Orange - soft)
- **Text**: `#991b1b` (Dark red)
- **Usage**: Urgent priority indicator (distinct red/orange tag)

### Text Colors
- **Primary Text**: `#1f2937` - Main content
- **Secondary Text**: `#6b7280` - Supporting text
- **Muted Text**: `#9ca3af` - Metadata, timestamps

## Typography

### Font Families

#### Sans-Serif (Primary)
```css
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```
**Usage**: All body text, buttons, headers, forms

#### Monospace (Data Display)
```css
"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", "Source Code Pro"
```
**Usage**: 
- Patient/Doctor IDs
- Timestamps
- Queue positions
- Numeric data

### Font Sizes
- **h1**: 2rem (32px) - Page titles
- **h2**: 1.5rem (24px) - Section headers
- **h3**: 1.25rem (20px) - Subsections
- **Body**: 1rem (16px) - Default
- **Small**: 0.875rem (14px) - Secondary text
- **Tiny**: 0.75rem (12px) - Status pills, labels

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Buttons, navigation
- **Semibold**: 600 - Headers, emphasis
- **Bold**: 700 - Queue positions, stat values

## Spacing System

Consistent spacing scale using CSS custom properties:

- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)

**Usage**: Apply consistently for padding, margins, gaps

## Components

### Status Pills

Small, color-coded badges for status display:

```css
.status-pill {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}
```

**Variants**:
- `.status-waiting` - Amber for waiting patients
- `.status-in-consultation` - Blue for active consultations
- `.status-completed` - Green for completed visits
- `.priority-urgent` - Red/orange for urgent cases

### Buttons

#### Primary Button
- **Color**: Primary blue
- **Usage**: Main actions (Check In, Start Consultation, Complete)
- **Hover**: Darkens slightly

#### Secondary Button
- **Color**: White with border
- **Usage**: Cancel, secondary actions
- **Hover**: Gray background

#### Danger Button
- **Color**: Red
- **Usage**: Destructive actions (if needed)

### Cards

Elevated containers for content sections:

```css
.card {
  background-color: white;
  border: 1px solid #dce1e6;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
```

**Usage**: Profile info, queue displays, forms

### Tables (Queue Display)

Clean, scannable tables with:
- Subtle borders
- Header row with gray background
- Hover effect on rows
- Monospace font for IDs and times
- Color-coded priority rows (yellow background for urgent)

### Stat Cards

Large numeric displays for analytics:

```css
.stat-card {
  text-align: center;
  padding: 24px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b5998;
  font-family: monospace; /* For precise alignment */
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
}
```

**Usage**: Analytics dashboard, doctor stats

### Forms

Clean, accessible form inputs:

```css
input, select, textarea {
  padding: 8px 16px;
  border: 1px solid #dce1e6;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus {
  border-color: #3b5998;
  outline: 2px solid rgba(59, 89, 152, 0.1);
}
```

**Features**:
- Clear focus states
- Proper label association
- Disabled states with reduced opacity

## Layout

### Whitespace

Generous whitespace for clinical clarity:
- Large margins between sections (24-32px)
- Consistent padding inside cards (24px)
- Grid gaps (24px) for dashboard cards

### Grid System

Responsive grid for dashboard cards:

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
```

**Behavior**: Cards stack vertically on mobile, expand horizontally on desktop

### Header

Sticky header with:
- White background
- Subtle shadow
- Logo/title on left
- User info and logout on right
- Role badge next to title

## Visual Hierarchy

### Priority Indicators

1. **Urgent cases** stand out with:
   - Red/orange URGENT pill
   - Yellow row background in tables
   - Positioned first in queue (via algorithm)

2. **Status** clearly visible with color-coded pills

3. **Queue position** displayed as large, bold monospace numbers

### Scanning Optimization

- **Left-aligned** tables for easier scanning
- **Monospace fonts** for data columns (IDs, times)
- **Clear headers** with uppercase labels
- **Consistent spacing** between rows

## Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:
- Status pills: High contrast text on colored backgrounds
- Primary button: White text on blue (#3b5998)
- Text: Dark gray (#1f2937) on white/light gray

### Font Sizes

- Minimum body text: 16px
- Minimum UI text: 14px
- Status pills: 12px (bold, uppercase for legibility)

### Focus States

All interactive elements have clear focus indicators:
- Inputs: Blue border + subtle shadow
- Buttons: Visible outline
- Links: Underline on focus

## Responsive Design

### Breakpoint: 768px

**Desktop (> 768px)**:
- Multi-column grids
- Side-by-side forms
- Full table display

**Mobile (≤ 768px)**:
- Single column layout
- Stacked form fields
- Horizontal scroll for tables
- Larger touch targets

## Animation & Transitions

Subtle animations for better UX:

```css
transition: all 0.2s;
```

**Applied to**:
- Button hover states
- Card hover effects
- Focus states

**Philosophy**: Animations are subtle and functional, not decorative

## Best Practices

### Do's ✓
- Use status pills for all status displays
- Use monospace font for IDs and timestamps
- Maintain generous whitespace
- Color-code urgent cases distinctly
- Keep tables clean and scannable

### Don'ts ✗
- Don't use more than 3-4 colors per view
- Don't overcrowd the interface
- Don't use decorative animations
- Don't make text smaller than 14px
- Don't rely on color alone (use text labels too)

## Component Usage Examples

### Status Display
```jsx
<span className="status-pill status-waiting">Waiting</span>
<span className="status-pill priority-urgent">URGENT</span>
```

### Stat Card
```jsx
<div className="stat-card">
  <div className="stat-value">23</div>
  <div className="stat-label">Currently Waiting</div>
  <div className="stat-sublabel">across all doctors</div>
</div>
```

### Queue Position
```jsx
<div className="queue-position">1</div>
```

### Patient Info
```jsx
<div className="patient-info">
  <div className="patient-name">John Doe</div>
  <div className="patient-details">45y • Male • 555-0123</div>
</div>
```

### Time Display
```jsx
<span className="time-info">14:23</span>
```

## Implementation Notes

All styles use **CSS Custom Properties** (CSS variables) defined in `:root` for:
- Easy theming
- Consistent values across components
- Simple maintenance

**File Structure**:
- `index.css` - Global styles, variables, utilities
- `Layout.css` - Header, footer, main layout
- `Auth.css` - Login/signup pages
- `Dashboard.css` - Dashboard components, tables, grids

## Design Rationale

### Why Muted Colors?
Clinical environments benefit from calmer color palettes. Bright, saturated colors can be fatiguing during long shifts.

### Why Monospace for Data?
Monospace fonts align numerical data vertically, making it easier to compare values at a glance.

### Why Color-Coded Status?
Color coding allows instant recognition of status without reading text - critical for quick scanning in busy environments.

### Why Large Whitespace?
Adequate whitespace reduces cognitive load and helps healthcare workers focus on the information that matters.

## Future Enhancements

Potential additions while maintaining the clinical aesthetic:

1. **Dark Mode**: Muted slate/blue dark theme for night shifts
2. **Data Visualizations**: Simple bar charts for analytics (avoid complexity)
3. **Print Styles**: Queue printouts for physical boards
4. **High Contrast Mode**: Enhanced accessibility option
5. **Colorblind-Safe Palette**: Alternative color scheme for colorblind users

---

**Design Version**: 1.0  
**Last Updated**: 2026-07-30  
**Target Audience**: Healthcare professionals, hospital staff, patients
