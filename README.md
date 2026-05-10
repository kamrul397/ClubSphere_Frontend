# ClubSphere

ClubSphere is a full-stack MERN web application for discovering, joining, and managing local clubs. Members can browse approved clubs, join clubs through membership, and register for free events. Club Managers can create and manage clubs and events, while Admins can review applications, manage users, and monitor platform activity.

## Live Links

- Live Site: https://clubspere-firebase.web.app
- Backend API: https://club-sphere-backend-psi.vercel.app

## Admin Access

- Admin Email: `Abubakar123@gmail.com`
- Admin Password: `Kamrulislam#123`

## Project Purpose

The purpose of ClubSphere is to provide a role-based platform where local communities can manage clubs, memberships, and events in one place. It supports secure authentication, protected dashboards, membership payments, and admin-level platform control.

## Main Features

- Firebase Authentication with email/password and Google login
- Role-based dashboard for Member, Club Manager, and Admin
- Members can browse approved clubs and upcoming events
- Members can join clubs with free or paid membership
- Stripe payment integration for paid club memberships
- All event registrations are free for members
- Club Managers can create, update, and manage clubs
- Club Managers can create and update free events
- Club Managers can view club members and event participants
- Admin can approve or reject Club Manager applications
- Admin can manage users and monitor platform data
- Protected backend APIs using Firebase token verification
- Responsive design for desktop, tablet, and mobile

## User Roles

### Member

- Browse clubs and events
- Join approved clubs
- Register for free events
- View joined clubs and registered events
- Apply to become a Club Manager

### Club Manager

- Create and manage clubs
- Create and update free events
- View club members
- View event participants

### Admin

- Manage users
- Approve or reject Club Manager requests
- Monitor clubs, events, memberships, and payments

## Tech Stack

### Frontend

- React
- React Router
- TanStack Query
- React Hook Form
- Tailwind CSS
- DaisyUI
- Framer Motion
- Firebase Authentication
- Axios
- SweetAlert2
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Firebase Admin SDK
- Stripe
- CORS
- dotenv

## Deployment

- Frontend: Firebase Hosting
- Backend: Vercel
- Database: MongoDB Atlas

## Environment Variables

Firebase configuration, MongoDB credentials, Stripe keys, and backend API URLs are secured using environment variables.

## Important NPM Packages

### Client Side

- `react`
- `react-router-dom`
- `@tanstack/react-query`
- `react-hook-form`
- `firebase`
- `axios`
- `sweetalert2`
- `framer-motion`
- `react-icons`
- `tailwindcss`
- `daisyui`

### Server Side

- `express`
- `mongodb`
- `firebase-admin`
- `stripe`
- `cors`
- `dotenv`

## GitHub Repositories

- Client Repository: https://github.com/kamrul397/ClubSphere_Frontend.git
- Server Repository: https://github.com/kamrul397/ClubSphere_Backend.git

## Project Note

In this project, club membership can be free or paid, but all event registrations are free for members.
