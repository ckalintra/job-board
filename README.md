## Mini Job Board

A minimal job board application built with **Next.js** and **Supabase**. Users can register/login, post jobs, view jobs, and manage their job listings


## Setup Instructions

Run `npm install` to install all depedencies

Run `npm run dev` to run the application. The application will be available at `http://localhost:3000`


## Approach

This project was built with a focus on clean code, usability, and fullstack functionality.

**Authentication**

Authentication is handled by Supabase Auth to ensure users can only view and manage their own job listings.

**CRUD Operations**

Designed core functionality around job Create, Read, Update, and Delete using Supabase.

**Routing with App Router**

Used Next.js App Router for modern file-based routing and layout composition

**UI and UX**

Used MUI (Material UI) for rapid UI development and simplicity with consistent theming.


## Architecture Overview

**Tech Stack**

Next.js (App Router) – React framework for routing, server-side rendering, and static site generation.
Supabase – Backend as a Service for Authentication and Database storage
MUI (Material UI) – UI component library for consistent and accessible styling.
TypeScript – For static typing and better developer experience.
Tailwind CSS – Utility-first CSS

**Project Structure**
```
app/
├── page.tsx              # Home page (Public page showing a list of job postings)
├── auth/
│   ├── page.tsx     	  # Users can sign up and log in
├── dashboard/
│   ├── page.tsx     	  # Post, view, edit, or delete jobs that the user posted
├── jobs/
│   ├── [id]/page.tsx     # Job detail page (dynamic route) - View full details of a specific job
lib/
├── supabase.ts           # Supabase client instance
```


## Improvements

**Authentication and Authorization**

Add role-based access control (e.g. admin, companies, job seeker).
Secure API routes with middlewares and server side validation to prevent unauthorized access or manipulation.

**UX Polishing**

Add toast notifications, loading skeletons, and better error states to enhance UX.
Implement infinite scrolling or pagination for job listings.
Implement filtering by tags, salary, location, etc.

**API Architecture**

Refactor Supabase calls into a dedicated API layer (lib/api) for cleaner separation of concerns and easier maintenance/testing.

**Testing**

Implement unit testing using jest or Vitest.

**Performance**

Utilize lazy loading for components and tune database queries if needed.