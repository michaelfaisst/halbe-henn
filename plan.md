# Halbe Henn - Project Plan

## Overview

Redesign of the halbe-henn.at website - a map-based application showing portable food stand locations in Vorarlberg, Austria.

## Language & Branding

- **Website Name**: "Halbe Henn"
- **Language**: German (Deutsch)
- All UI text, labels, and user-facing content must be in German
- The website should be fully localized for German-speaking users in Vorarlberg, Austria

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Package Manager**: Bun
- **Map Library**: (To be decided - Leaflet, Mapbox, or Google Maps)
- **Testing**: Vitest (unit tests), Playwright (e2e tests)
- **Version Control**: Git with descriptive commits

---

## Phase 1: Project Setup & Foundation

**Goal**: Get the basic Next.js project running with all core dependencies

### Tasks:

- [x] Initialize Next.js project with TypeScript
- [x] Set up Bun as package manager
- [x] Configure Tailwind CSS
- [x] Install and configure shadcn/ui
- [x] Set up Git repository with initial commit
- [x] Create basic project structure (components, lib, types, data directories)
- [x] Set up ESLint and Prettier
- [x] Set up t3-env for environment variable management
- [x] Set up testing infrastructure:
  - [x] Install and configure Vitest for unit tests
  - [x] Install and configure Playwright for e2e tests
  - [x] Create test configuration files
  - [x] Add test scripts to package.json
- [x] Write a simple smoke test to verify test setup works
- [x] Create basic README with setup instructions

### Deliverables:

- [x] Working Next.js app that runs locally
- [x] Tailwind and shadcn configured
- [x] Testing infrastructure ready (Vitest + Playwright)
- [x] Test setup verified with passing smoke test
- [x] Clean project structure

---

## Phase 2: Data Structure & Types

**Goal**: Define data models and load the existing JSON data

### Tasks:

- [x] Examine the existing JSON data file structure (stands.json)
- [x] Create TypeScript types/interfaces for:
  - [x] Stand location (name, address, coordinates)
  - [x] Availability days (array of day numbers 1-6, where 1=Monday, 6=Saturday)
  - [x] Complete stand data structure
- [x] Create data loading utility function
- [x] Create utility functions for:
  - [x] Getting current day of week (1-6)
  - [x] Formatting day names from numbers
  - [x] Validating stand data structure
- [x] Write unit tests for:
  - [x] Data loading function (loads JSON correctly)
  - [x] Type validation (handles invalid data gracefully)
  - [x] Day utility functions (current day, day formatting)
  - [x] Edge cases (empty data, malformed data)
- [x] Verify all tests pass before moving to next phase

### Deliverables:

- [x] Type definitions for all data structures
- [x] Data loading utility with validation
- [x] Day utility functions
- [x] Comprehensive unit tests (all passing)

---

## Phase 3: Map Integration

**Goal**: Display a fullscreen map with basic markers

### Tasks:

- [ ] Install Mapbox GL JS and React Map GL libraries and types
- [ ] Set up Mapbox access token in environment variables (using t3-env)
- [ ] Create Map component with fullscreen layout
- [ ] Implement basic map initialization with Vorarlberg region bounds
- [ ] Load stand data and add markers for all stands
- [ ] Style map to match dark/light theme
- [ ] Ensure map is responsive
- [ ] Write unit tests for:
  - [ ] Map component rendering
  - [ ] Marker count matches data
- [ ] Write e2e test for:
  - [ ] Map loads successfully
  - [ ] All markers are visible on the map
  - [ ] Map is responsive on mobile viewport
- [ ] Verify all tests pass

### Deliverables:

- [ ] Fullscreen map component
- [ ] All stands displayed as markers
- [ ] Map works in both light and dark mode
- [ ] Unit and e2e tests passing

---

## Phase 4: Marker Interactions & Tooltips

**Goal**: Clickable markers with information popovers

### Tasks:

- [ ] Make markers clickable
- [ ] Create Tooltip/Popover component using shadcn
- [ ] Display stand information in popover (all text in German):
  - [ ] Supermarket name
  - [ ] Address
  - [ ] Available days (formatted nicely in German, e.g., "Montag, Mittwoch, Freitag")
- [ ] Position popover relative to marker
- [ ] Handle popover open/close state
- [ ] Add animations/transitions for smooth UX
- [ ] Write unit tests for:
  - [ ] Popover component (renders correct data)
  - [ ] Day formatting function (converts [1,3,5] to readable format)
  - [ ] Popover open/close state management
- [ ] Write e2e test for:
  - [ ] Clicking a marker opens popover
  - [ ] Popover displays correct stand information
  - [ ] Clicking outside closes popover
  - [ ] Multiple markers can be clicked sequentially
- [ ] Verify all tests pass

### Deliverables:

- [ ] Clickable markers
- [ ] Information popover on marker click
- [ ] Smooth animations
- [ ] Unit and e2e tests passing

---

## Phase 5: Side Navigation & Filtering

**Goal**: Overlay side nav with day filter functionality

### Tasks:

- [ ] Create SideNav component using shadcn components
- [ ] Design filter UI (checkboxes or multi-select for days)
- [ ] Implement default filter (current day of week)
- [ ] Create filtering utility function:
  - [ ] Filter stands by selected days
  - [ ] Handle multiple day selection
  - [ ] Return filtered stand list
- [ ] Ensure all UI text is in German (day names, labels, etc.)
- [ ] Add filtering logic to show/hide markers based on selected days
- [ ] Update map markers when filter changes
- [ ] Add image and text content to side nav (from original site) - **See Open Questions**
- [ ] Style side nav to overlay on map (positioned absolutely on right side)
- [ ] Make side nav responsive (mobile-friendly)
- [ ] Write unit tests for:
  - [ ] Filtering utility function (filters correctly by single day)
  - [ ] Filtering utility function (filters correctly by multiple days)
  - [ ] Default filter initialization (uses current day)
  - [ ] Edge cases (no days selected, all days selected)
- [ ] Write e2e tests for:
  - [ ] Default filter shows only current day's stands
  - [ ] Selecting different days updates visible markers
  - [ ] Multiple day selection works correctly
  - [ ] Filter persists during marker interactions
  - [ ] Mobile filter UI works correctly
- [ ] Verify all tests pass

### Deliverables:

- [ ] Side navigation overlay
- [ ] Day filter functionality
- [ ] Default filter set to current day
- [ ] Filtered markers on map
- [ ] Comprehensive unit and e2e tests passing

---

## Phase 6: Dark/Light Mode

**Goal**: Implement theme switching

### Tasks:

- [ ] Set up next-themes for theme management
- [ ] Create theme toggle component using shadcn
- [ ] Add theme toggle to side nav or header
- [ ] Ensure map styling adapts to theme
- [ ] Update all components to support both themes
- [ ] Persist theme preference in localStorage
- [ ] Write unit tests for:
  - [ ] Theme toggle component (switches theme correctly)
  - [ ] Theme persistence (saves to localStorage)
- [ ] Write e2e tests for:
  - [ ] Theme toggle button is visible and clickable
  - [ ] Clicking toggle switches between dark/light mode
  - [ ] Theme preference persists on page reload
  - [ ] All components render correctly in both themes
  - [ ] Map styling adapts to theme
- [ ] Verify all tests pass

### Deliverables:

- [ ] Working dark/light mode toggle
- [ ] All components styled for both themes
- [ ] Theme preference persistence
- [ ] Unit and e2e tests passing

---

## Phase 7: Polish & Optimization

**Goal**: Improve UX and performance

### Tasks:

- [ ] Add loading states for map initialization
- [ ] Optimize marker rendering
- [ ] Add smooth transitions when filtering
- [ ] Improve mobile responsiveness
- [ ] Add keyboard navigation support
- [ ] Optimize bundle size
- [ ] Add error boundaries
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Write e2e tests for:
  - [ ] Loading states appear during map initialization
  - [ ] Keyboard navigation works (Tab, Enter, Escape)
  - [ ] Error handling (graceful degradation if map fails)
  - [ ] Accessibility (screen reader compatibility)
- [ ] Run performance tests and verify improvements
- [ ] Verify all existing tests still pass

### Deliverables:

- [ ] Smooth, polished user experience
- [ ] Good performance
- [ ] Mobile-friendly
- [ ] Accessibility improvements
- [ ] All tests passing

---

## Phase 8: Final Testing & CI/CD

**Goal**: Ensure comprehensive test coverage and automated testing

### Tasks:

- [ ] Review all test coverage:
  - [ ] Ensure all business logic has unit tests
  - [ ] Ensure all user journeys have e2e tests
  - [ ] Check for any edge cases not covered
- [ ] Set up CI/CD basics (GitHub Actions or similar):
  - [ ] Run unit tests on every push
  - [ ] Run e2e tests on every push
  - [ ] Run tests on pull requests
- [ ] Add test coverage reporting
- [ ] Fix any remaining bugs found during final testing
- [ ] Verify all tests pass in CI environment

### Deliverables:

- [ ] Comprehensive test suite with good coverage
- [ ] CI/CD pipeline running tests automatically
- [ ] All tests passing consistently

---

## Phase 9: Deployment Preparation

**Goal**: Prepare for production deployment

### Tasks:

- [ ] Configure t3-env for production environment variables
- [ ] Set up Mapbox access token in production (private token)
- [ ] Configure build settings
- [ ] Test production build locally
- [ ] Set up deployment (Vercel recommended for Next.js)
- [ ] Configure custom domain (halbe-henn.at)
- [ ] Add analytics integration (service TBD - Umami is a consideration, may be self-hosted on Vercel)
- [ ] Final testing on production environment

### Deliverables:

- [ ] Production-ready build
- [ ] Deployed website
- [ ] Custom domain configured

---

## File Structure (Proposed)

```
halbe-henn/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn components
│   ├── Map.tsx
│   ├── SideNav.tsx
│   ├── StandMarker.tsx
│   ├── StandPopover.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── data.ts          # Data loading utilities
│   ├── filters.ts       # Filtering logic
│   └── utils.ts         # General utilities
├── types/
│   └── stand.ts         # TypeScript types
├── data/
│   └── stands.json      # Stand data
├── __tests__/
│   ├── unit/            # Unit tests
│   └── e2e/             # E2e tests
├── public/
└── package.json
```

---

## Open Questions (Need Your Input)

Please provide answers to these questions so we can proceed:

1. **Map Library Choice**: ✅ **DECIDED: Mapbox**
   - [ ] Leaflet (free, open-source, recommended for simplicity and cost)
   - [x] Mapbox (better styling, requires API key)
   - [ ] Google Maps (familiar, requires API key and billing)
   - **Your preference:** **Mapbox** (using t3-env for environment variables - public token for dev, private for production)

2. **Marker Clustering**: ✅ **DECIDED: No clustering needed**
   - Do you want marker clustering when many stands are close together?
   - **Your preference:** [ ] Yes [x] No

3. **Side Navigation Content**:
   - What image should be displayed in the side nav? (Please provide the image file or URL)
   - What text content should be included? (Please provide the text or reference to original site)
   - **Your input:** **\*\***\_\_\_\_**\*\***

4. **Analytics**: ✅ **DECIDED: Yes, but service TBD**
   - Do you want to add analytics (e.g., Google Analytics, Plausible)?
   - **Your preference:** [x] Yes [ ] No
   - If yes, which service? **Umami (self-hosted, possibly on Vercel) - decision to be made later**

5. **Design Preferences**: ✅ **DECIDED**
   - Any specific color scheme preferences beyond the default shadcn theme?
   - **Color scheme:** Simple elegant black and white (default shadcn theme)
   - Any specific layout preferences for the side nav (left/right side, width, etc.)?
   - **Side nav:** Right side, width TBD (no specific width in mind yet)

---

## Key Decisions Made

1. **State Management**: React state is sufficient (useState, useContext if needed) - no need for Redux/Zustand
2. **Map Library**: Mapbox GL JS (using t3-env for environment variables - public token for dev, private token for production)
3. **Marker Clustering**: Not needed - will render all markers directly
4. **Environment Variables**: Using t3-env for type-safe environment variable management
5. **Analytics**: Yes, will be added - service TBD (Umami self-hosted on Vercel is a consideration)
6. **Design**: Simple elegant black and white color scheme (default shadcn theme), side nav on right side (width TBD)
7. **Language**: German (Deutsch) - All UI text, labels, and user-facing content must be in German. Day names will be: Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag
8. **Website Name**: "Halbe Henn"

---

## Testing Strategy

**Approach**: Write tests alongside features in each phase to ensure everything works after each step.

### Unit Tests (Vitest) - Written throughout development

- **Phase 2**: Data loading and validation, day utilities
- **Phase 3**: Map component rendering, marker count validation
- **Phase 4**: Popover component logic, day formatting
- **Phase 5**: Filtering logic, default filter initialization
- **Phase 6**: Theme toggle functionality, theme persistence

### E2E Tests (Playwright) - Written throughout development

- **Phase 3**: Map loads with all markers, responsive layout
- **Phase 4**: Marker click → popover appears, displays correct info
- **Phase 5**: Day filtering updates markers, default filter works, mobile filter UI
- **Phase 6**: Theme toggle works, theme persists, all components adapt
- **Phase 7**: Loading states, keyboard navigation, accessibility, error handling

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for business logic (utilities, filters, data handling)
- **E2E Tests**: All core user journeys covered
- **CI/CD**: All tests run automatically on every commit

---

## Git Commit Strategy

Use descriptive commit messages following conventional commits:

- `feat: add map component with markers`
- `feat: implement day filtering in side nav`
- `fix: correct marker positioning on mobile`
- `test: add unit tests for filtering logic`
- `style: update side nav styling for dark mode`
- `refactor: extract filtering logic to utility function`

---

## Success Criteria

- [ ] Map displays all stands as markers
- [ ] Clicking marker shows stand information
- [ ] Day filter works and defaults to current day
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Deployed and accessible at halbe-henn.at
