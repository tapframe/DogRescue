# Dog Rescue Application

A full-stack application for managing a dog rescue operation. This application helps track dogs available for adoption, their details, and provides an admin interface for managing the dog database.

## Features

- Display dogs available for adoption
- Filter and search for dogs by various criteria
- Admin dashboard for adding, editing, and deleting dogs
- Responsive design that works on all devices
- Modern UI with Material UI components

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI
- Framer Motion for animations
- Axios for API communication

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd backend && npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
   
   Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dogrescue
   NODE_ENV=development
   ```

4. Start MongoDB:
   Make sure MongoDB is running on your local machine or update the connection string to use a remote MongoDB instance.

### Running the Application

To run both frontend and backend together:
```
npm run dev:all
```

To run just the frontend:
```
npm run dev
```

To run just the backend:
```
npm run dev:backend
```

### Building for Production

Frontend:
```
npm run build
```

Backend:
```
cd backend && npm run build
```

## Project Structure

- `/src` - Frontend code
  - `/components` - Reusable UI components
  - `/pages` - Application pages
  - `/services` - API services
- `/backend` - Backend code
  - `/src` - Source code
    - `/controllers` - Request handlers
    - `/models` - Database models
    - `/routes` - API routes
    - `/config` - Configuration files 