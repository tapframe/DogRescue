# Project Documentation

## Configuration Files

- `package.json`: Project dependencies and scripts
- `package-lock.json`: Exact versions of project dependencies
- `tsconfig.json`: TypeScript compiler options
- `.gitignore`: Specifies intentionally untracked files that Git should ignore
- `index.html`: Main HTML entry point for the frontend application
- `vite-env.d.ts`: TypeScript definitions for Vite environment variables

## Frontend (`src` directory)

### Core Files
- `main.tsx`: Main entry point for the React application
- `App.tsx`: Root component of the React application, handles routing
- `style.css`: Global styles for the application

### Pages (`src/pages`)
- `ContactPage.tsx`: Page for users to contact the organization
- `ResourcesPage.tsx`: Page displaying resources for users
- `DogsPage.tsx`: Page displaying information about dogs
- `AboutPage.tsx`: Page providing information about the organization
- `HomePage.tsx`: The main landing page of the application
- `RescueSubmissionPage.tsx`: Page for users to submit rescue forms
- `AdminPage.tsx`: Page for administrative functionalities
- `DogDetailPage.tsx`: Page displaying detailed information for a specific dog
- `VolunteerPage.tsx`: Page for users to sign up as volunteers
- `DonatePage.tsx`: Page for users to make donations
- `NotFoundPage.tsx`: Page displayed when a route is not found (404)
- `src/pages/admin/SecretLoginPage.tsx`: Login page for administrators

### Components (`src/components`)

#### Admin Components (`src/components/admin`)
- `AdminPageLayout.tsx`: Layout component for admin pages
- `RescueManagementTab.tsx`: Tab for managing rescue submissions in the admin panel
- `VolunteerManagementTab.tsx`: Tab for managing volunteers in the admin panel
- `DogManagementTab.tsx`: Tab for managing dogs in the admin panel

#### Auth Components (`src/components/auth`)
- `KeyboardShortcutListener.tsx`: Listens for keyboard shortcuts (likely for accessibility or developer tools)
- `ProtectedRoute.tsx`: Component to protect routes that require authentication

#### Layout Components (`src/components/layout`)
- `Header.tsx`: Application header component
- `Footer.tsx`: Application footer component
- `Layout.tsx`: Main layout structure for pages

### Services (`src/services`)
- `api.ts`: Handles API calls to the backend
- `authService.ts`: Handles authentication-related services

### Contexts (`src/contexts`)
- `AdminThemeContext.tsx`: Context for managing the admin section's theme

### Hooks (`src/hooks`)
- `useAdminTheme.ts`: Custom hook for accessing the admin theme context

### Miscellaneous Frontend Files
- `counter.ts`: (Likely) Example or utility counter logic
- `main.ts`: (Likely) Alternative or auxiliary entry point/script
- `typescript.svg`: (Likely) TypeScript logo or asset

## Backend (`backend` directory)

### Core Backend Files
- `backend/package.json`: Backend dependencies and scripts
- `backend/package-lock.json`: Exact versions of backend dependencies
- `backend/tsconfig.json`: TypeScript compiler options for the backend
- `backend/src/index.ts`: Main entry point for the backend server

### API Routes (`backend/src/routes`)
- `dogs.ts`: API routes related to dogs
- `rescueSubmissions.ts`: API routes related to rescue submissions
- `auth.ts`: API routes related to authentication
- `volunteers.ts`: API routes related to volunteers

### Controllers (`backend/src/controllers`)
- `dogController.ts`: Logic for handling dog-related requests
- `rescueSubmissions.ts`: Logic for handling rescue submission requests
- `authController.ts`: Logic for handling authentication requests
- `volunteerController.ts`: Logic for handling volunteer-related requests

### Database Models (`backend/src/models`)
- `Dog.ts`: Database model/schema for dogs
- `RescueSubmission.ts`: Database model/schema for rescue submissions
- `Admin.ts`: Database model/schema for admin users
- `Volunteer.ts`: Database model/schema for volunteers

### Middleware (`backend/src/middleware`)
- `authMiddleware.ts`: Middleware for authenticating API requests

### Configuration (`backend/src/config`)
- `db.ts`: Database connection configuration

## Public Assets (`public` directory)
- `dog-paw-cursor.svg`: SVG image for a dog paw cursor
- `dog-paw-svgrepo-com.svg`: SVG image of a dog paw
- `vite.svg`: Vite logo SVG

## Other Project Files
- `query`: (Content unknown, likely a test query or script) 