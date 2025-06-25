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

## Email Configuration

The application sends emails for volunteer application confirmations and status updates. To configure email functionality:

1. Create a `.env` file in the backend directory with the following email configuration:

```
# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@dogrescuemission.com
```

2. Replace the placeholder values with your actual SMTP server details:
   - `EMAIL_HOST`: Your SMTP server hostname (e.g., smtp.gmail.com for Gmail)
   - `EMAIL_PORT`: SMTP port (usually 587 for TLS or 465 for SSL)
   - `EMAIL_SECURE`: Set to `true` for port 465, `false` for other ports
   - `EMAIL_USER`: Your email username/address
   - `EMAIL_PASSWORD`: Your email password or app password
   - `EMAIL_FROM`: The "from" address that will appear in sent emails

### Using Gmail

If using Gmail, you'll need to:
1. Enable 2-Step Verification for your Google account
2. Generate an App Password (Google Account > Security > App Passwords)
3. Use that App Password in your `.env` file instead of your regular password

## Email Templates

The application sends the following types of emails:

1. **Volunteer Application Confirmation**: Sent when a user submits a volunteer application
2. **Volunteer Application Approved**: Sent when an admin approves a volunteer application
3. **Volunteer Application Rejected**: Sent when an admin rejects a volunteer application

You can modify the email templates in `src/utils/emailService.ts`. 