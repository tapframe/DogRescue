import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DogData {
  _id?: string;
  id?: number;
  name: string;
  breed: string;
  age: string;
  size: string;
  gender: string;
  image: string;
  description: string;
  tags: string[];
  status?: 'available' | 'adopted' | 'fostered' | 'pending';
  createdAt?: string;
}

export interface VolunteerData {
  _id?: string;
  id?: number;
  name: string;
  email: string;
  phone: string;
  volunteerType?: string;
  availability?: string;
  experience?: string;
  message?: string;
  status?: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  role?: 'admin' | 'volunteer';
  address?: string;
  avatar?: string;
  createdAt?: string;
}

// Define Mock dogsData here for fallback
const dogsDataMock: DogData[] = [
  {
    id: 1,
    name: 'Max',
    breed: 'Labrador Retriever',
    age: '3 years',
    size: 'Large',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Max is a friendly and energetic Labrador who loves to play fetch and go for long walks.',
    tags: ['Friendly', 'Active', 'Good with kids'],
    status: 'available'
  },
  {
    id: 2,
    name: 'Bella',
    breed: 'German Shepherd',
    age: '2 years',
    size: 'Large',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    description: 'Bella is a loyal and intelligent German Shepherd looking for an active family.',
    tags: ['Intelligent', 'Loyal', 'Protective'],
    status: 'adopted'
  },
  // Add other mock dogs if needed
];

// Dog API calls
export const dogApi = {
  // Get all dogs
  getAllDogs: async (): Promise<DogData[]> => {
    try {
      const response = await api.get('/dogs');
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Use dogsDataMock for fallback
      return Promise.resolve([...dogsDataMock].map(dog => ({
        ...dog,
        _id: dog.id?.toString()
      })));
    }
  },

  // Get dogs from rescue submissions
  getDogsFromRescue: async (): Promise<DogData[]> => {
    try {
      const response = await api.get('/dogs/from-rescue');
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Use dogsDataMock for fallback with rescue tag
      return Promise.resolve([...dogsDataMock]
        .filter(dog => dog.tags.includes('Rescue'))
        .map(dog => ({
          ...dog,
          _id: dog.id?.toString(),
          rescueId: `mock-rescue-${dog.id}`
        }))
      );
    }
  },

  // Get dog by ID
  getDogById: async (id: string): Promise<DogData> => {
    try {
      const response = await api.get(`/dogs/${id}`);
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Use dogsDataMock for fallback
      const dog = dogsDataMock.find(d => d.id === parseInt(id));
      if (!dog) {
        throw new Error(`Dog with ID ${id} not found in mock data`);
      }
      return Promise.resolve({
        ...dog,
        _id: dog.id?.toString()
      });
    }
  },

  // Create a new dog
  createDog: async (dogData: DogData): Promise<DogData> => {
    try {
      const response = await api.post('/dogs', dogData);
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Update dogsDataMock for fallback
      const newDog = {
        ...dogData,
        id: Math.max(...dogsDataMock.map(d => d.id || 0)) + 1,
        _id: (Math.max(...dogsDataMock.map(d => d.id || 0)) + 1).toString()
      };
      dogsDataMock.push(newDog as any); // Use type assertion if needed
      return Promise.resolve(newDog);
    }
  },

  // Update a dog
  updateDog: async (id: string, dogData: Partial<DogData>): Promise<DogData> => {
    try {
      const response = await api.put(`/dogs/${id}`, dogData);
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Update dogsDataMock for fallback
      const index = dogsDataMock.findIndex(d => d.id === parseInt(id));
      if (index === -1) {
        throw new Error(`Dog with ID ${id} not found in mock data`);
      }
      const updatedDog = {
        ...dogsDataMock[index],
        ...dogData,
        id: parseInt(id),
        _id: id
      };
      dogsDataMock[index] = updatedDog as any; // Use type assertion if needed
      return Promise.resolve(updatedDog);
    }
  },

  // Delete a dog
  deleteDog: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/dogs/${id}`);
      return response.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Update dogsDataMock for fallback
      const index = dogsDataMock.findIndex(d => d.id === parseInt(id));
      if (index === -1) {
        throw new Error(`Dog with ID ${id} not found in mock data`);
      }
      dogsDataMock.splice(index, 1);
      return Promise.resolve({ success: true });
    }
  }
};

// Mock volunteer data for fallback
const mockVolunteers: VolunteerData[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    volunteerType: 'Dog Walker',
    availability: 'Weekends',
    experience: 'I have owned dogs for 10 years and volunteer at my local shelter.',
    message: 'I would love to help walk dogs on the weekends.',
    status: 'approved',
    submittedAt: '2023-06-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    volunteerType: 'Foster Parent',
    availability: 'Flexible',
    experience: 'I have fostered 5 dogs previously and have a spacious home.',
    message: 'I can provide a loving temporary home for dogs in need.',
    status: 'approved',
    submittedAt: '2023-06-20T14:45:00Z'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '(555) 456-7890',
    volunteerType: 'Event Helper',
    availability: 'Weekends',
    experience: 'I have experience organizing community events.',
    message: 'I would like to help with adoption events and fundraisers.',
    status: 'pending',
    submittedAt: '2023-07-05T09:15:00Z'
  }
];

// Volunteer API calls
export const volunteerApi = {
  // Get all volunteers
  getAllVolunteers: async (): Promise<VolunteerData[]> => {
    try {
      // First try to get data from API
      try {
        const response = await api.get('/volunteers');
        return response.data.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        // Fallback to mock data if API call fails
        return Promise.resolve([...mockVolunteers].map(volunteer => ({
          ...volunteer,
          _id: volunteer.id?.toString()
        })));
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }
  },

  // Get volunteer by ID
  getVolunteerById: async (id: string): Promise<VolunteerData> => {
    try {
      // First try to get data from API
      try {
        const response = await api.get(`/volunteers/${id}`);
        return response.data.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        // Fallback to mock data if API call fails
        const volunteer = mockVolunteers.find(v => v.id === parseInt(id));
        if (!volunteer) {
          throw new Error(`Volunteer with ID ${id} not found`);
        }
        return Promise.resolve({
          ...volunteer,
          _id: volunteer.id?.toString()
        });
      }
    } catch (error) {
      console.error(`Error fetching volunteer with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new volunteer
  createVolunteer: async (volunteerData: VolunteerData): Promise<VolunteerData> => {
    try {
      // First try to post to API
      try {
        const response = await api.post('/volunteers', volunteerData);
        return response.data.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        // Fallback to mock data if API call fails
        const newVolunteer = {
          ...volunteerData,
          id: Math.max(...mockVolunteers.map(v => v.id || 0)) + 1,
          _id: (Math.max(...mockVolunteers.map(v => v.id || 0)) + 1).toString(),
          status: 'pending' as 'pending' | 'approved' | 'rejected',
          submittedAt: new Date().toISOString()
        };
        mockVolunteers.push(newVolunteer);
        return Promise.resolve(newVolunteer);
      }
    } catch (error) {
      console.error('Error creating volunteer:', error);
      throw error;
    }
  },

  // Update a volunteer
  updateVolunteer: async (id: string, volunteerData: Partial<VolunteerData>): Promise<VolunteerData> => {
    try {
      // First try to put to API
      try {
        const response = await api.put(`/volunteers/${id}`, volunteerData);
        return response.data.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        // Fallback to mock data if API call fails
        const index = mockVolunteers.findIndex(v => v.id === parseInt(id));
        if (index === -1) {
          throw new Error(`Volunteer with ID ${id} not found`);
        }
        const updatedVolunteer = {
          ...mockVolunteers[index],
          ...volunteerData,
          id: parseInt(id),
          _id: id
        };
        mockVolunteers[index] = updatedVolunteer;
        return Promise.resolve(updatedVolunteer);
      }
    } catch (error) {
      console.error(`Error updating volunteer with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a volunteer
  deleteVolunteer: async (id: string): Promise<{ success: boolean }> => {
    try {
      // First try to delete from API
      try {
        const response = await api.delete(`/volunteers/${id}`);
        return response.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        // Fallback to mock data if API call fails
        const index = mockVolunteers.findIndex(v => v.id === parseInt(id));
        if (index === -1) {
          throw new Error(`Volunteer with ID ${id} not found`);
        }
        mockVolunteers.splice(index, 1);
        return Promise.resolve({ success: true });
      }
    } catch (error) {
      console.error(`Error deleting volunteer with ID ${id}:`, error);
      throw error;
    }
  },

  // Update volunteer status
  updateVolunteerStatus: async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<VolunteerData> => {
    try {
      // First try to patch to API
      try {
        const response = await api.patch(`/volunteers/${id}/status`, { status });
        return response.data.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        // Fallback to mock data if API call fails
        const index = mockVolunteers.findIndex(v => v.id === parseInt(id));
        if (index === -1) {
          throw new Error(`Volunteer with ID ${id} not found`);
        }
        // Ensure status is one of the valid values
        const validStatus = status as 'pending' | 'approved' | 'rejected';
        
        const updatedVolunteer = {
          ...mockVolunteers[index],
          status: validStatus,
          id: parseInt(id),
          _id: id
        };
        mockVolunteers[index] = updatedVolunteer;
        return Promise.resolve(updatedVolunteer);
      }
    } catch (error) {
      console.error(`Error updating volunteer status with ID ${id}:`, error);
      throw error;
    }
  }
};

// Define interface for rescue submission data
export interface RescueSubmissionData {
  _id?: string;
  id?: number;
  name?: string;
  breed?: string;
  gender: string;
  age: string;
  size: string;
  location: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  imageUrls?: string[];
  status?: 'pending' | 'processing' | 'rescued' | 'closed';
  statusNotes?: string;
  submittedAt?: string;
  // User information
  user?: string;
  userName?: string;
  userEmail?: string;
}

// Mock rescue submissions data
const mockRescueSubmissions: RescueSubmissionData[] = [
  {
    id: 1,
    gender: 'Male',
    age: 'Adult (3-8 years)',
    size: 'Medium',
    location: 'Central Park, near the fountain',
    description: 'Found a stray dog that appears to be abandoned. He is friendly but looks hungry and tired.',
    contactName: 'Jane Smith',
    contactEmail: 'jane.smith@example.com',
    contactPhone: '(555) 123-4567',
    status: 'pending',
    submittedAt: '2023-05-10T14:30:00Z'
  },
  {
    id: 2,
    name: 'Buddy',
    breed: 'Golden Retriever Mix',
    gender: 'Male',
    age: 'Young (1-3 years)',
    size: 'Large',
    location: 'Main Street, behind the old grocery store',
    description: 'Dog has a collar but no tags. Seems well-behaved but is limping on one leg.',
    contactName: 'Robert Johnson',
    contactEmail: 'robert.j@example.com',
    contactPhone: '(555) 987-6543',
    status: 'processing',
    submittedAt: '2023-05-12T09:15:00Z'
  },
  {
    id: 3,
    name: 'Unknown',
    gender: 'Female',
    age: 'Puppy (Under 1 year)',
    size: 'Small',
    location: 'Westside neighborhood, near Oak Street',
    description: 'Found a small puppy hiding under a parked car. Appears to be malnourished and scared.',
    contactName: 'Maria Garcia',
    contactEmail: 'maria.g@example.com',
    contactPhone: '(555) 456-7890',
    status: 'rescued',
    submittedAt: '2023-05-14T16:45:00Z'
  }
];

// Rescue submission API calls
export const rescueApi = {
  // Submit a new rescue request
  submitRescueRequest: async (rescueData: RescueSubmissionData): Promise<RescueSubmissionData> => {
    try {
      const response = await api.post('/rescue-submissions', rescueData);
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Create a mock response
      const mockResponse: RescueSubmissionData = {
        ...rescueData,
        _id: Math.random().toString(36).substring(2, 15),
        id: Math.max(...mockRescueSubmissions.map(r => r.id || 0)) + 1,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      // Add to mock data for future reference
      mockRescueSubmissions.push(mockResponse);
      return Promise.resolve(mockResponse);
    }
  },

  // Get all rescue submissions (for admin use)
  getAllRescueSubmissions: async (): Promise<RescueSubmissionData[]> => {
    try {
      const response = await api.get('/rescue-submissions');
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Return mock data
      return Promise.resolve([...mockRescueSubmissions].map(submission => ({
        ...submission,
        _id: submission.id?.toString()
      })));
    }
  },

  // Get rescue submission by ID
  getRescueSubmissionById: async (id: string): Promise<RescueSubmissionData> => {
    try {
      const response = await api.get(`/rescue-submissions/${id}`);
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Return mock data
      return Promise.resolve({
        _id: id,
        id: parseInt(id),
        gender: 'Unknown',
        age: 'Adult (3-8 years)',
        size: 'Medium',
        location: 'Mock Location',
        description: 'This is a mock rescue submission',
        contactName: 'Mock User',
        contactEmail: 'mock@example.com',
        contactPhone: '(555) 123-4567',
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
    }
  },

  // Update rescue submission status
  updateRescueSubmission: async (id: string, data: Partial<RescueSubmissionData>): Promise<RescueSubmissionData> => {
    try {
      const response = await api.put(`/rescue-submissions/${id}`, data);
      return response.data.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Return mock updated data
      return Promise.resolve({
        _id: id,
        id: parseInt(id),
        gender: 'Unknown',
        age: 'Adult (3-8 years)',
        size: 'Medium',
        location: 'Mock Location',
        description: 'This is a mock rescue submission',
        contactName: 'Mock User',
        contactEmail: 'mock@example.com',
        contactPhone: '(555) 123-4567',
        ...data,
        status: data.status || 'pending',
        submittedAt: new Date().toISOString()
      });
    }
  }
};

// Application interface
export interface ApplicationData {
  _id?: string;
  id?: number;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  dog?: {
    _id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
  };
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Withdrawn';
  applicationNotes?: string;
  adminNotes?: string;
  submittedAt?: string;
  updatedAt?: string;
}

// Mock application data
const mockApplications: ApplicationData[] = [
  {
    id: 1,
    _id: '1',
    user: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567'
    },
    dog: {
      _id: '1',
      name: 'Max',
      breed: 'Labrador Retriever',
      age: '3 years',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    status: 'Pending',
    applicationNotes: 'I would love to adopt Max. I have experience with large dogs.',
    submittedAt: '2023-06-15T10:30:00Z'
  }
];

// Application API calls
export const applicationApi = {
  // Submit a new adoption application
  submitApplication: async (dogId: string, applicationNotes?: string): Promise<ApplicationData> => {
    try {
      const response = await api.post('/applications', { dogId, applicationNotes });
      return response.data.application;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Create a mock response
      const mockResponse: ApplicationData = {
        _id: Math.random().toString(36).substring(2, 15),
        id: Math.max(...mockApplications.map(a => a.id || 0)) + 1,
        status: 'Pending',
        applicationNotes: applicationNotes,
        submittedAt: new Date().toISOString()
      };
      // Add to mock data for future reference
      mockApplications.push(mockResponse);
      return Promise.resolve(mockResponse);
    }
  },

  // Get user's applications
  getUserApplications: async (): Promise<ApplicationData[]> => {
    try {
      const response = await api.get('/applications/my-applications');
      return response.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Return mock data
      return Promise.resolve([...mockApplications]);
    }
  },

  // Get all applications (admin only)
  getAllApplications: async (): Promise<ApplicationData[]> => {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Return mock data
      return Promise.resolve([...mockApplications]);
    }
  },

  // Update application status (admin only)
  updateApplicationStatus: async (id: string, status: string, adminNotes?: string): Promise<ApplicationData> => {
    try {
      const response = await api.patch(`/applications/${id}/status`, { status, adminNotes });
      return response.data.application;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Update mock data
      const index = mockApplications.findIndex(a => a.id === parseInt(id) || a._id === id);
      if (index !== -1) {
        mockApplications[index] = {
          ...mockApplications[index],
          status: status as any,
          adminNotes: adminNotes,
          updatedAt: new Date().toISOString()
        };
        return Promise.resolve(mockApplications[index]);
      }
      throw new Error('Application not found');
    }
  },

  // Withdraw application
  withdrawApplication: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.patch(`/applications/${id}/withdraw`);
      return response.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      // Update mock data
      const index = mockApplications.findIndex(a => a.id === parseInt(id) || a._id === id);
      if (index !== -1) {
        mockApplications[index] = {
          ...mockApplications[index],
          status: 'Withdrawn',
          updatedAt: new Date().toISOString()
        };
        return Promise.resolve({ message: 'Application withdrawn successfully' });
      }
      throw new Error('Application not found');
    }
  },

  // Get application by ID
  getApplicationById: async (id: string): Promise<ApplicationData> => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (apiError) {
      console.warn('Backend API not available, using mock data:', apiError);
      const application = mockApplications.find(a => a.id === parseInt(id) || a._id === id);
      if (!application) {
        throw new Error('Application not found');
      }
      return Promise.resolve(application);
    }
  }
};

export default api; 