# Recruitment Platform Frontend

This is the frontend for the recruitment platform prototype built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui components, React Hook Form, and Zod for validation.

---

## Prerequisites

- Node.js (recommended version >=16)
- npm or yarn
- Backend API running locally or accessible remotely

---

## Setup Instructions

### 1. Clone the repository

If frontend is within the main repo, navigate to frontend folder:

```bash
cd frontend
```

### 2. Install dependencies

Using npm or yarn:

```bash
npm install
```

or

```bash
yarn install
```

### 3. Start the development server

Run:

```bash
npm run dev
```

or

```bash
yarn dev
```

The app will launch on `http://localhost:5173` or as indicated by Vite.

---

## Features

- **User Authentication**: Registration and login with client-side validation using Zod and React Hook Form
- **JWT Token Management**: Secure token storage and management in localStorage
- **Protected Routes**: Profile page with authenticated API requests
- **Modern UI**: Responsive design using Tailwind CSS and shadcn/ui components
- **Error Handling**: Graceful error handling with toast notifications
- **Form Validation**: Client-side validation with Zod schemas
- **TypeScript Support**: Full TypeScript integration for type safety

---

## Available Scripts

| Script    | Description                     |
|-----------|---------------------------------|
| `dev`     | Starts Vite development server |
| `build`   | Bundles production build        |
| `preview` | Preview production build        |
| `lint`    | Run ESLint for code quality     |

---

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Static type checking for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **Axios** - Promise-based HTTP client for API requests
