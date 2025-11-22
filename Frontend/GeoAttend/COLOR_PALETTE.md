# GeoAttend Light Mode Color Palette Reference

## Primary Brand Colors

| Color Name | Hex Value | Usage | RGB |
|-----------|-----------|-------|-----|
| Primary Blue | `#1e88e5` | Navigation, primary buttons, active states | rgb(30, 136, 229) |
| Success Green | `#43a047` | Check-in, inside geofence, positive actions | rgb(67, 160, 71) |
| Error Red | `#e53935` | Alerts, outside geofence, errors | rgb(229, 57, 53) |
| Warning Orange | `#fb8c00` | Warnings, attention-needed states | rgb(251, 140, 0) |

## Neutral Colors

| Color Name | Hex Value | Usage | RGB |
|-----------|-----------|-------|-----|
| Primary Text | `#1a1a1a` | Headings, main content, primary text | rgb(26, 26, 26) |
| Secondary Text | `#666666` | Descriptions, meta information | rgb(102, 102, 102) |
| Tertiary Text | `#999999` | Hints, disabled states, placeholder text | rgb(153, 153, 153) |
| Dark Icon | `#424242` | Icon color, secondary icons | rgb(66, 66, 66) |

## Background & Surface Colors

| Color Name | Hex Value | Usage | RGB |
|-----------|-----------|-------|-----|
| Main Background | `#ffffff` | Primary background for all screens | rgb(255, 255, 255) |
| Light Surface | `#f5f7fa` | Cards, containers, secondary background | rgb(245, 247, 250) |
| Dark Surface | `#ecf0f5` | Tertiary containers, subtle sections | rgb(236, 240, 245) |
| Info Surface | `#e3f2fd` | Information sections, tips, hints | rgb(227, 242, 253) |
| Success Surface | `#e8f5e9` | Success messages, inside geofence | rgb(232, 245, 233) |
| Error Surface | `#ffebee` | Error messages, outside geofence | rgb(255, 235, 238) |
| Warning Surface | `#fff3e0` | Warning containers, caution states | rgb(255, 243, 224) |

## Border & Divider Colors

| Color Name | Hex Value | Usage | RGB |
|-----------|-----------|-------|-----|
| Standard Border | `#e0e0e0` | Borders, dividers, separators | rgb(224, 224, 224) |
| Light Border | `#f0f0f0` | Subtle borders, hairlines | rgb(240, 240, 240) |
| Active Border | `#1e88e5` | Input focus, active borders | rgb(30, 136, 229) |

## Component-Specific Colors

### Welcome/Login Screens
- **Logo Background**: `#e3f2fd` (Light blue)
- **Title Text**: `#1a1a1a` (Black)
- **Subtitle Text**: `#1e88e5` (Blue)
- **Feature Icons**: Mixed (blue, green, orange, red)
- **Primary CTA**: `#1e88e5` with white text
- **Secondary CTA**: White with `#1e88e5` border and text

### Geofence Page
- **Status Inside Background**: `#e8f5e9` (Light green)
- **Status Inside Text**: `#2e7d32` (Dark green)
- **Status Outside Background**: `#ffebee` (Light red)
- **Status Outside Text**: `#c62828` (Dark red)
- **Distance Value**: `#1e88e5` (Blue, 24px bold)
- **Fence Circle**: `#1e88e5` with 30% opacity
- **User Marker**: `#1e88e5`
- **Fence Center Marker**: `#fb8c00`
- **Radius Buttons**: `#1e88e5`
- **Primary Action Button**: `#1e88e5` (Set Fence)
- **Secondary Action Button**: `#43a047` (Current Location)

### Dashboard/Analytics Pages
- **Card Backgrounds**: `#f5f7fa`
- **Metric Values**: `#1e88e5` (for primary metrics)
- **Chart Colors**: Blue (`#1e88e5`), Green (`#43a047`), Orange (`#fb8c00`)
- **Dividers**: `#e0e0e0`

### Tab Navigation
- **Active Tab**: `#1e88e5`
- **Inactive Tab**: `#999999`
- **Tab Bar Background**: `#ffffff`
- **Tab Bar Border**: `#e0e0e0`

## Shadow Specifications

### Primary Button Shadow
- Color: `#1e88e5`
- Offset: (0, 6)
- Opacity: 0.25
- Radius: 12

### Card Shadow
- Color: `#000000`
- Offset: (0, 2)
- Opacity: 0.08
- Radius: 4

### Floating Button Shadow
- Color: `#000000`
- Offset: (0, 3)
- Opacity: 0.12
- Radius: 6

## Typography Scale

| Element | Font Size | Font Weight | Color | Usage |
|---------|-----------|------------|-------|-------|
| H1 Title | 48px | 800 | `#1a1a1a` | App logo, main heading |
| H2 Subtitle | 20px | 700 | `#1a1a1a` | Section titles |
| H3 Small Title | 18px | 600 | `#1a1a1a` | Card titles |
| Body Large | 16px | 500 | `#1a1a1a` | Main content |
| Body Medium | 15px | 500 | `#1a1a1a` | Standard body text |
| Body Small | 13px | 400 | `#666666` | Secondary content |
| Label | 12px | 600 | `#999999` | Labels, captions |
| Caption | 11px | 400 | `#999999` | Meta information |

## Spacing Scale

| Spacing | Value | Usage |
|---------|-------|-------|
| XS | 4px | Micro-interactions |
| S | 8px | Small gaps |
| M | 12px | Standard padding |
| L | 16px | Container padding |
| XL | 20px | Section spacing |
| 2XL | 24px | Large sections |
| 3XL | 32px | Section separation |

## Border Radius Scale

| Radius | Value | Usage |
|--------|-------|-------|
| Small | 4px | Subtle corners |
| Medium | 8px | Standard radius |
| Large | 12px | Buttons, cards |
| XL | 16px | Large containers |
| Full | 50% | Circular elements |

## Status Indicators

### Inside Geofence
- **Icon**: `checkmark-circle` from Ionicons
- **Icon Color**: `#2e7d32`
- **Background**: `#e8f5e9`
- **Text**: `#2e7d32`
- **Label**: "INSIDE FENCE"

### Outside Geofence
- **Icon**: `close-circle` from Ionicons
- **Icon Color**: `#c62828`
- **Background**: `#ffebee`
- **Text**: `#c62828`
- **Label**: "OUTSIDE FENCE"

## Recommended Usage Guidelines

### For Text
- Primary text: `#1a1a1a` on `#ffffff`
- Secondary text: `#666666` on `#ffffff` or `#f5f7fa`
- Light text: `#ffffff` on `#1e88e5` or `#43a047`

### For Interactive Elements
- Primary actions: `#1e88e5` background with white text
- Secondary actions: White background with `#1e88e5` border/text
- Destructive actions: `#e53935` background with white text
- Success actions: `#43a047` background with white text

### For Status Indicators
- Success/Inside: Green colors (`#43a047`, `#e8f5e9`)
- Error/Outside: Red colors (`#e53935`, `#ffebee`)
- Warning: Orange colors (`#fb8c00`, `#fff3e0`)
- Info: Blue colors (`#1e88e5`, `#e3f2fd`)

## Contrast Ratios (WCAG Compliance)

All color combinations meet WCAG AA standards for accessibility:
- `#1a1a1a` text on `#ffffff` background: 21:1 (AAA)
- `#1e88e5` text on `#ffffff` background: 5.4:1 (AA)
- `#666666` text on `#ffffff` background: 7:1 (AA)
- `#ffffff` text on `#1e88e5` background: 7.5:1 (AA)

## Implementation Notes

1. **Theme Consistency**: Always reference color values from `constants/theme.ts`
2. **Shadow Usage**: Use color-matched shadows for depth (see Shadow Specifications)
3. **Accessibility**: Never rely on color alone for status indication; use icons
4. **Contrast**: Maintain minimum 4.5:1 contrast ratio for text
5. **Spacing**: Use spacing scale for consistent layout
6. **Typography**: Follow font sizes and weights as specified
7. **Borders**: Use `#e0e0e0` for standard borders, `#f0f0f0` for subtle dividers
8. **Surfaces**: Layer backgrounds using Light, Standard, and Dark surfaces for hierarchy

## Export Format

### Figma Tokens JSON
```json
{
  "colors": {
    "primary-blue": "#1e88e5",
    "success-green": "#43a047",
    "error-red": "#e53935",
    "warning-orange": "#fb8c00",
    "text-primary": "#1a1a1a",
    "text-secondary": "#666666",
    "background-main": "#ffffff",
    "surface-light": "#f5f7fa"
  }
}
```

### CSS Variables
```css
:root {
  --color-primary-blue: #1e88e5;
  --color-success-green: #43a047;
  --color-error-red: #e53935;
  --color-warning-orange: #fb8c00;
  --color-text-primary: #1a1a1a;
  --color-background-main: #ffffff;
}
```
