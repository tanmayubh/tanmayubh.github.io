# Copilot Instructions for tanmayubh.github.io

## Project Purpose
Personal portfolio website showcasing backend, DevOps, and data-driven systems expertise. This is a GitHub Pages site (static hosting) that dynamically connects project cards to actual GitHub repositories using the GitHub API.

## Architecture

### Three-Layer Structure
1. **Static Markup** ([index.html](../index.html)): Semantic HTML with section-based navigation (hero, about, projects, stack, contact)
2. **Styling** ([style.css](../style.css)): CSS custom properties with dark theme, glassmorphism effects, and responsive design using CSS clamp()
3. **Client-Side Logic** ([script.js](../script.js)): Intersection Observer API for scroll-based navigation/reveal animations, GitHub API integration for dynamic project matching

### Key Component: Dynamic Project Linking
The `.project-card` elements in the projects section use keyword matching (`data-project-query` attribute) to find and link relevant repositories from the `tanmayubh` GitHub user account via `https://api.github.com/users/tanmayubh/repos`. The `scoreRepo()` function ranks matches by relevance (name matches weighted 4x, description 2x). Cards gracefully degrade if the API is unavailable.

## Conventions & Patterns

### Naming & Attribution
- **Design System Tokens**: CSS variables in `:root` use double-dash naming (`--bg`, `--primary`, `--radius-lg`) for consistent scaling
- **Cards**: `.project-card`, `.stack-card` reuse flex/grid layout and `.reveal` animation pattern
- **Interactive Elements**: `.btn-primary`, `.btn-secondary` follow semantic button naming

### Content Structure
- **Featured Projects**: Limited to 4 items (Miami Housing, Car Resale, PM Tool, Regression Suite); images stored in `images/` and referenced as `images/{Name}.png`
- **Tech Stack**: Three categories (Backend & APIs, Data & Databases, Cloud & DevOps) with icon pairs stored in `images/`
- **Keywords**: Tags like "Network Discovery," "B2B Growth," "Operational Visibility" appear in hero and README sections—maintain alignment when updating

### Animation & Interactivity Patterns
- **Intersection Observer for Nav**: Activates `.active` class on nav links as sections enter viewport (rootMargin offsets at -40% top, -45% bottom)
- **Reveal Animation**: `.reveal` class + `visible` class triggers CSS fade-in (check `style.css` for `@keyframes` definition)
- **Card Interactivity**: `makeCardInteractive()` adds role="link" and keyboard support (Enter/Space) to card elements that should be clickable

### Theme & Visual Identity
- **Dark theme** with teal accent (`--primary: #39d2b4`) and warm secondary (`--secondary: #ffc857`)
- **Typography**: Space Grotesk for headers, IBM Plex Sans for body text (Google Fonts)
- **Glassmorphism**: Sticky nav uses `backdrop-filter: blur(14px)` with semi-transparent background
- **Background Orbs**: Fixed position radial gradients (`.bg-orb-a` and `.bg-orb-b`) provide ambient visual depth

## Development Workflow

### Static Site (No Build Step)
- No build tool required. Direct updates to `.html`, `.css`, `.js` files are reflected on push to main branch
- Version query strings on CSS/JS imports (`?v=20260309-2`) prevent caching issues—increment timestamp after significant changes

### GitHub API Integration
- Called on page load via `connectProjectCardsToGitHub()`
- Handles rate limits gracefully (falls back to generic GitHub profile link if API fails)
- Filters out forks and the portfolio repo itself to avoid self-linking

### Testing Patterns
- **Navigation**: Open DevTools, scroll between sections, verify `.active` class moves on nav links
- **API Fallback**: Temporarily disable network in DevTools to confirm graceful degradation of project card stats
- **Responsive**: Use Device Emulation to test `clamp()` breakpoint logic (e.g., `clamp(16px, 4vw, 48px)` for padding)

## When Making Changes

### Adding a New Featured Project
1. Add new `.project-card` article with `data-project-query` attribute (space-separated keywords from repo name/description)
2. Add corresponding image to `images/` folder (follow existing naming: `{ProjectName}.png`)
3. Update `README.md` Featured Projects section to match portfolio content

### Updating Colors or Spacing
- Edit CSS custom properties in `:root` block (top of `style.css`)
- Use `clamp()` for responsive scaling rather than breakpoint-heavy media queries
- Test across viewport sizes to ensure visual hierarchy remains intact

### GitHub Repo Disconnection
If a repository is renamed, archived, or the project query no longer matches:
- Update the `data-project-query` attribute in the card or
- Let it gracefully display "No strong match found" and link to the GitHub profile as fallback

## Key Files
- [index.html](../index.html): All markup sections (hero, about, projects, stack, contact)
- [style.css](../style.css): Complete design system; search for `:root` for tokens, `@keyframes reveal` for animations
- [script.js](../script.js): Intersection Observers, GitHub API fetch, keyboard accessibility for cards
- [README.md](../README.md): Source of truth for project descriptions, tech keywords, engagement model
- `images/`: Project images, tech stack icons
- `assets/`: CV/resume PDF (linked in hero CTA)
