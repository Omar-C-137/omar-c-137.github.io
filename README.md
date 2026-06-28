# T-0: Train Smarter. Track Better.

A modern fitness training platform built with **Next.js 16**, **React 19**, and **TypeScript** for coaches and trainees to manage training programs and track progress.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS (Tailwind-compatible utilities)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **UI Components**: React 19 with custom components

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles
│   ├── auth/
│   │   └── page.tsx         # Auth page
│   ├── coach/
│   │   └── page.tsx         # Coach dashboard page
│   └── trainee/
│       └── page.tsx         # Trainee dashboard page
├── components/
│   ├── Navigation.tsx       # Navigation bar
│   ├── AuthForm.tsx         # Sign-in/Sign-up form
│   ├── auth-form.css        # Auth form styles
│   ├── CoachDashboard.tsx   # Coach dashboard
│   └── TraineeDashboard.tsx # Trainee dashboard
├── lib/
│   └── supabase.ts          # Supabase client
├── middleware.ts             # Auth middleware
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ (with npm or pnpm)
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.development.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

### Landing Page
- Hero section with gradient text
- Call-to-action buttons for sign-up and login
- Responsive design with animated glow orbs

### Authentication
- Email/password sign-up and sign-in
- Google OAuth integration
- Role-based selection (Coach or Trainee)
- Form validation and error handling

### Coach Dashboard
- Profile management
- Client management
- Workout plan creation
- Diet plan creation
- Progress tracking

### Trainee Dashboard
- Profile management
- View assigned coach
- Workout plan view
- Diet plan view
- Progress tracking

## Styling

The project uses a custom CSS system with CSS variables for theming:
- Dark mode (default)
- Light mode toggle
- Orange (`#FF6B2B`) primary color
- Yellow (`#F5E642`) accent color

All styles are defined in `app/globals.css` and component-specific CSS files.

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Linter
```bash
npm run lint
```

## Authentication Flow

1. User lands on `/` (home page)
2. User navigates to `/auth` for sign-up/sign-in
3. Supabase authenticates the user
4. User is redirected to `/coach` or `/trainee` based on their role
5. Protected routes check session and role before rendering

## Database Schema

The app uses Supabase with the following key tables:
- `auth.users` - User authentication (managed by Supabase)
- `profiles` - User profile information (role, full_name, specialty, bio)
- `clients` - Coach-trainee relationships
- `workout_plans` - Workout program details
- `diet_plans` - Nutrition program details

## Migration from HTML

This project was migrated from static HTML files:
- `index.html` → `app/page.tsx`
- `auth.html` → `components/AuthForm.tsx` + `app/auth/page.tsx`
- `coach.html` → `components/CoachDashboard.tsx` + `app/coach/page.tsx`
- `trainee.html` → `components/TraineeDashboard.tsx` + `app/trainee/page.tsx`
- `style.css` → `app/globals.css`
- `config.js` → `lib/supabase.ts`

## License

ISC
