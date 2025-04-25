# Dog Rescue Mission Backend API

This is the backend API for the Dog Rescue Mission website. It provides endpoints for managing dogs and volunteer applications.

## Technologies Used

- Node.js
- Express
- MongoDB with Mongoose
- TypeScript
- Cors

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dogrescue
   NODE_ENV=development
   ```
   Note: Replace the MONGODB_URI with your own MongoDB connection string if needed.

### Running the Server

- For development:
  ```
  npm run dev
  ```
- For production:
  ```
  npm run build
  npm start
  ```

## API Endpoints

### Dogs

- `GET /api/dogs` - Get all dogs
- `GET /api/dogs/:id` - Get a single dog by ID
- `POST /api/dogs` - Create a new dog
- `PUT /api/dogs/:id` - Update a dog
- `DELETE /api/dogs/:id` - Delete a dog

### Volunteers

- `GET /api/volunteers` - Get all volunteers
- `GET /api/volunteers/:id` - Get a single volunteer by ID
- `POST /api/volunteers` - Create a new volunteer application
- `PUT /api/volunteers/:id` - Update a volunteer
- `DELETE /api/volunteers/:id` - Delete a volunteer
- `PATCH /api/volunteers/:id/status` - Update a volunteer's status (pending, approved, rejected)

## Data Models

### Dog

```typescript
{
  name: string;          // Required
  breed: string;         // Required
  age: string;           // Required
  size: string;          // Required, enum: ['Small', 'Medium', 'Large']
  gender: string;        // Required, enum: ['Male', 'Female']
  image: string;         // Required, URL to the dog's image
  description: string;   // Required
  tags: string[];        // Optional, array of tags
}
```

### Volunteer

```typescript
{
  name: string;          // Required
  email: string;         // Required, valid email format
  phone: string;         // Required
  volunteerType: string; // Required, enum: ['Dog Walker', 'Foster Parent', 'Event Helper', 'Kennel Assistant', 'Other']
  availability: string;  // Required, enum: ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible']
  experience: string;    // Required
  message: string;       // Optional
  status: string;        // Required, enum: ['pending', 'approved', 'rejected'], default: 'pending'
  submittedAt: Date;     // Automatically set to the current date
}
``` 