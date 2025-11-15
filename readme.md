# Halbe Henn - Vorarlberg

A modern map-based web application showing portable food stand locations in Vorarlberg, Austria. Find where you can buy roasted chickens ("halbe henn") throughout the region.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Package Manager**: Bun
- **Map Library**: Mapbox GL JS
- **Testing**: Vitest (unit tests), Playwright (e2e tests)
- **Environment Variables**: t3-env

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd halbe-henn
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if it exists)
   - Add your Mapbox access token:
     ```
     NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
     ```
   - Get a token from [Mapbox](https://account.mapbox.com/access-tokens/)
   - Use a public token for development

4. Run the development server:

   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting
- `bun run test` - Run unit tests
- `bun run test:ui` - Run unit tests with UI
- `bun run test:e2e` - Run e2e tests
- `bun run test:e2e:ui` - Run e2e tests with UI

## Project Structure

```
halbe-henn/
├── app/              # Next.js app directory
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
├── types/           # TypeScript type definitions
├── data/            # Data files (JSON)
├── __tests__/       # Test files
│   ├── unit/       # Unit tests
│   └── e2e/        # E2E tests
└── public/          # Static assets
```

## Testing

### Unit Tests

Unit tests are written with Vitest and React Testing Library:

```bash
bun run test
```

### E2E Tests

E2E tests are written with Playwright:

```bash
bun run test:e2e
```

Note: Make sure the dev server is running or Playwright will start it automatically.

## Environment Variables

The project uses [t3-env](https://env.t3.gg/) for type-safe environment variable management.

Required environment variables:

- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Your Mapbox access token

## License

Private project
