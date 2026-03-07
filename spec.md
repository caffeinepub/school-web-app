# School Web App – Dark Mode Theme Improvement

## Current State
The website uses a dark navy/gold theme. The base background tokens are:
- `--background: 0.175 0.038 268` (very dark navy)
- `--card: 0.215 0.042 265`
- `--muted: 0.235 0.048 265`

Inline section backgrounds in pages are set to extremely dark values:
- `oklch(0.135 0.035 266)` – too dark, hard to see cards
- `oklch(0.115 0.028 268)` – very dark, near black
- `oklch(0.155 0.04 267)` – barely distinguishable

Body text color `oklch(0.70 0.04 265)` and `oklch(0.72 0.04 265)` lack sufficient contrast against the dark backgrounds.

## Requested Changes (Diff)

### Add
- Slightly lighter, more distinguishable background gradient for dark mode (deep navy → dark slate feel, not near-black)
- Higher contrast body text tokens
- More visible card/section differentiation

### Modify
- `index.css` dark mode tokens: raise `--background`, `--card`, `--muted`, `--secondary` lightness values so content is clearly readable
- Inline `oklch(0.135...)` and `oklch(0.115...)` section backgrounds in all pages raised to ~0.18–0.20 range
- Inline `oklch(0.155...)` backgrounds raised to ~0.21–0.22
- Card backgrounds `oklch(0.195...)` raised to `oklch(0.225...)` for better pop against section bg
- Stat label text `oklch(0.72 0.04 265)` raised to `oklch(0.78 0.04 265)` for legibility
- Body text `oklch(0.70 0.04 265)` and similar raised to `oklch(0.78 0.04 265)`
- Bottom fade gradient in hero updated to match new background values
- Section border colors updated to match new background values

### Remove
- No sections, layout, or structure changes

## Implementation Plan
1. Update `index.css` dark mode design tokens:
   - `--background`: raise from `0.175` to `0.20`
   - `--card`: raise from `0.215` to `0.245`
   - `--secondary`: raise from `0.245` to `0.265`
   - `--muted`: raise from `0.235` to `0.255`
   - `--muted-foreground`: raise from `0.76` to `0.80`
   - `--border`: raise from `0.32` to `0.35`
   - `--input`: raise from `0.28` to `0.32`
   - `--primary`: raise from `0.275` to `0.30`

2. Update `index.css` `.bg-navy-gradient` utility to use the new brighter navy range

3. Update `HomePage.tsx` inline section backgrounds:
   - Stats section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Gallery section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Sports gallery: `oklch(0.155 0.04 267)` → `oklch(0.205 0.04 267)`
   - About section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Announcement bg: `oklch(0.195 0.038 265)` → `oklch(0.225 0.040 265)`
   - StatCard bg: `oklch(0.195 0.038 265)` → `oklch(0.245 0.042 265)`
   - Hero bottom fade: match new background value
   - Body text `oklch(0.70...)` → `oklch(0.78...)`; `oklch(0.72 0.04 265)` → `oklch(0.80 0.04 265)`

4. Update `TeachersPage.tsx` inline backgrounds:
   - Page header: `oklch(0.14 0.05 265)` → `oklch(0.20 0.05 265)`, `oklch(0.115 0.028 268)` → `oklch(0.185 0.035 268)`
   - Leadership section: `oklch(0.115 0.028 268)` → `oklch(0.185 0.035 268)`
   - Assistant teachers section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Stats band: `oklch(0.115 0.028 268)` → `oklch(0.185 0.035 268)`
   - Gallery section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Card bgs: `oklch(0.195 0.038 265)` → `oklch(0.245 0.042 265)`
   - Stat label text `oklch(0.72 0.04 265)` → `oklch(0.80 0.04 265)`

5. Update `AboutPage.tsx` inline backgrounds:
   - Page header gradient: `oklch(0.14 0.05 265)` → `oklch(0.20 0.05 265)`, `oklch(0.115 0.028 268)` → `oklch(0.185 0.035 268)`
   - Mission card: `oklch(0.21 0.05 265)` → `oklch(0.245 0.05 265)`, `oklch(0.195 0.038 265)` → `oklch(0.225 0.040 265)`
   - Highlights section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Highlight card bgs: `oklch(0.195 0.038 265)` → `oklch(0.245 0.042 265)`
   - Values card bgs: `oklch(0.195 0.038 265)` → `oklch(0.245 0.042 265)`
   - Gallery section: `oklch(0.135 0.035 266)` → `oklch(0.185 0.038 266)`
   - Body text `oklch(0.70 0.04 265)` / `oklch(0.75 0.04 265)` → `oklch(0.80 0.04 265)`

6. Update `StudentsPage.tsx` and `FeesPage.tsx` inline backgrounds similarly

7. Update `RootLayout.tsx` footer card background (uses CSS var but verify muted text colors)

8. Run validate to confirm no TypeScript/lint errors
