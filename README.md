# ClubSphere

ClubSphere is a full-stack MERN web application for discovering, joining, and managing local clubs. Members can browse clubs, join approved clubs, and register for events. Club Managers can create clubs and manage club events, while Admins can review applications and monitor platform activity.

## Live Links

- Live Site: https://clubspere-firebase.web.app
- Backend API: https://club-sphere-backend-psi.vercel.app

## Main Features

- Firebase Authentication with email/password and Google login
- Role-based dashboard for Member, Club Manager, and Admin
- Members can browse approved clubs and upcoming events
- Members can join clubs through free or paid membership
- All events are free for members
- Club Managers can create and update clubs
- Club Managers can create and manage free events
- Club Managers can view event participants
- Admin can approve or reject Club Manager applications
- Admin can manage users and monitor platform data
- Secure backend APIs with Firebase token verification
- Responsive UI for desktop, tablet, and mobile

## User Roles

### Member

- Browse clubs and events
- Join clubs
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
- Monitor clubs, events, and payments

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

Firebase config, MongoDB credentials, Stripe keys, and API URLs are secured using environment variables.

## GitHub Repositories

- Client Repository: `https://github.com/kamrul397/ClubSphere_Frontend.git`
- Server Repository: `https://github.com/kamrul397/ClubSphere_Backend.git`

## Project Note

In this project, club membership can be free or paid, but all event registration is free for members.
