Github : https://github.com/akkinasriramchandu-max/CampusHub

LiveLink: https://vishnu-campus-hub.netlify.app/

# College Event Management Portal (MERN Stack)

A full-stack College Event Management Portal built with **MongoDB, Express, React, Node.js (MERN)** and **Tailwind CSS**.

## Features

### Authentication
- Student registration & login (JWT-based)
- Secure password hashing (bcrypt)
- Protected routes (student & admin)
- Logout

### Student Dashboard
- View upcoming events
- Register for events
- View registered events ("My Registrations")
- Cancel registration
- View announcements
- Fully responsive UI

### Event Listing
- Banner image, name & description
- Date, time & venue
- Category filter
- Registration deadline
- Live seat availability & Register button
- Search by title

### Admin Panel
- Create / edit / delete events
- Publish / unpublish events
- View all registrations (searchable)
- Publish announcements (optionally linked to an event)
- Dashboard with quick stats

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios, React Hot Toast, React Icons
- **Backend:** Node.js, Express, JWT, bcryptjs
- **Database:** MongoDB with Mongoose

## Project Structure

```
college-event-portal/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── seed.js          # Creates a default admin account
│   └── server.js        # App entry point
└── frontend/
    └── src/
        ├── api/          # Axios instance
        ├── components/   # Reusable UI components
        ├── context/      # Auth context
        └── pages/        # Route-level pages (incl. admin/)
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI and JWT secret
npm run dev
```

The API runs at `http://localhost:5000`.

**Create a default admin account (optional but recommended):**

```bash
node seed.js
```
This creates `admin@college.edu` / `admin123`.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL should point to your backend, e.g. http://localhost:5000/api
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_event_portal
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## API Overview

| Method | Endpoint                          | Access        | Description                    |
|--------|------------------------------------|---------------|---------------------------------|
| POST   | /api/auth/register                | Public        | Register a student             |
| POST   | /api/auth/login                   | Public        | Login                           |
| GET    | /api/auth/me                      | Private       | Get current user                |
| GET    | /api/events                       | Public        | List published events (filters)|
| GET    | /api/events/:id                   | Public        | Get single event                |
| POST   | /api/events                       | Admin         | Create event                    |
| PUT    | /api/events/:id                   | Admin         | Update event                    |
| DELETE | /api/events/:id                   | Admin         | Delete event                    |
| GET    | /api/events/admin/all             | Admin         | List all events (incl. drafts)  |
| POST   | /api/registrations/:eventId       | Student       | Register for an event           |
| DELETE | /api/registrations/:eventId       | Student       | Cancel registration             |
| GET    | /api/registrations/my             | Student       | My registrations                |
| GET    | /api/registrations                | Admin         | All registrations               |
| GET    | /api/registrations/event/:eventId | Admin         | Registrations for an event      |
| GET    | /api/announcements                | Public        | List announcements              |
| POST   | /api/announcements                | Admin         | Create announcement             |
| DELETE | /api/announcements/:id            | Admin         | Delete announcement             |

## Notes on Engineering Decisions

- **Seat management:** `seatsAvailable` is decremented/incremented atomically alongside registration create/cancel to keep counts accurate; a unique compound index on `(event, student)` prevents duplicate registrations.
- **Soft-cancel:** Registrations are marked `cancelled` rather than deleted, preserving history while still freeing up a seat and allowing re-registration.
- **Role-based access:** `protect` + `admin` middleware guard all admin-only routes on the backend (never trust the frontend alone).
- **Validation & error handling:** Centralized error handler normalizes Mongoose validation/cast/duplicate-key errors into clean JSON responses.
