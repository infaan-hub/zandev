# Zandeveloper Design Portal

A modern Design-to-Code platform built with React, Vite, and Tailwind CSS.

## Overview

Zandeveloper enables developers to browse, inspect, and export clean, production-ready UI component code across multiple frameworks.

## Features

- **Design Gallery**: Browse curated UI components by category
- **Code Viewer**: Inspect React, Vue, Svelte, Astro source code
- **User Dashboard**: Manage collections, downloads, and analytics
- **Admin Panel**: Full control over users, content, and security
- **Search & Filter**: Find designs by framework, category, or popularity

## Tech Stack

- React 19
- Vite 5
- Tailwind CSS 3
- React Router 7
- Recharts (Analytics)
- Framer Motion (Animations)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.development` for local development:

```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── dashboard/      # User dashboard views
├── admin/          # Admin panel views
├── lib/            # Utilities and contexts
└── tools/          # Design tools
```

## API Backend

This frontend connects to a Django REST API backend. See `/backend/zda` for the API code.

## License

Private - Zandeveloper
