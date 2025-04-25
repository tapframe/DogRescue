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

# Dog Rescue Admin System

This is the admin system for the Dog Rescue site, allowing for management of dogs, volunteers, and other resources.

## Features

- Dashboard with key metrics
- Dog management (add, edit, delete)
- Volunteer management
- Admin account creation and authentication

## Accessing the Admin Panel

For security reasons, the admin panel can be accessed in two ways:

1. Through a secret URL:
```
/admin-login-7a91b523e61
```

2. By entering a special keyboard code anywhere in the application:
   - Type the sequence `815787` on your keyboard
   - You will be automatically redirected to the admin login page

These access methods are not linked from the main website and should be shared only with authorized personnel.

### First-time Admin Registration

To create a new admin account, you will need:

1. The secret admin registration key
2. Go to the secret login URL: `/admin-login-7a91b523e61`
3. Click "Need an admin account? Register"
4. Fill in the form with your desired username and password
5. Enter the secret key: `DogRescue_SuperSecret_2024`
6. Click Register

### Logging In

1. Navigate to `/admin-login-7a91b523e61`
2. Enter your username and password
3. Click Sign In

### Security Notes

- The admin URL should never be shared publicly or included in public documentation
- The secret registration key should be changed in production
- In a production environment, this would use more robust security measures like:
  - Environment variables for secrets
  - Server-side validation
  - Rate limiting
  - IP restriction

## Development

This is a React application built with:

- React
- TypeScript
- Material UI
- React Router

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Production

For production deployment:

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
``` 