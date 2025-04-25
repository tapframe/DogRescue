import axios from 'axios';
import { VolunteerData } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const auth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Check if token exists and is valid
const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('adminToken', token);
    auth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('adminToken');
    delete auth.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('adminToken');
if (token) {
  setAuthToken(token);
}

interface AdminCredentials {
  username: string;
  password: string;
  secretKey?: string;
}

interface AdminData extends VolunteerData {
  username: string;
  role: 'admin';
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminData;
  message?: string;
}

// Mock admin data for fallback when API is not available
const mockAdmins = [
  {
    id: 999,
    _id: '999',
    username: 'admin',
    // This is just for mock data - in a real app, would never store plaintext passwords
    password: 'RescueDogs2024!', 
    name: 'System Administrator',
    email: 'admin@dogrescue.org',
    phone: '(555) 000-0000',
    role: 'admin' as const,
    status: 'approved' as const,
    createdAt: '2023-01-01T00:00:00Z'
  }
];

// Secret key for accessing admin registration (would be environment variable in real app)
const ADMIN_SECRET_KEY = 'DogRescue_SuperSecret_2024';

export const authService = {
  // Admin login
  login: async (credentials: AdminCredentials): Promise<AuthResponse> => {
    try {
      // Try API call first
      try {
        const response = await auth.post('/auth/admin/login', credentials);
        const { token, user } = response.data;
        
        if (token) {
          setAuthToken(token);
        }
        
        return response.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        
        // Fallback to mock data
        const admin = mockAdmins.find(a => 
          a.username === credentials.username && 
          a.password === credentials.password
        );
        
        if (!admin) {
          return {
            success: false,
            message: 'Invalid credentials'
          };
        }
        
        // Generate a mock token (never do this in production)
        const mockToken = `mock_${Math.random().toString(36).substring(2)}`;
        setAuthToken(mockToken);
        
        const { password, ...adminWithoutPassword } = admin;
        
        return {
          success: true,
          token: mockToken,
          user: adminWithoutPassword as AdminData
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  },
  
  // Register new admin (requires secret key)
  registerAdmin: async (adminData: AdminCredentials): Promise<AuthResponse> => {
    try {
      // Verify secret key
      if (adminData.secretKey !== ADMIN_SECRET_KEY) {
        return {
          success: false,
          message: 'Invalid secret key'
        };
      }
      
      // Try API call first
      try {
        const response = await auth.post('/auth/admin/register', adminData);
        return response.data;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        
        // Check if username already exists in mock data
        if (mockAdmins.some(a => a.username === adminData.username)) {
          return {
            success: false,
            message: 'Username already exists'
          };
        }
        
        // Create new admin in mock data
        const newAdmin = {
          id: Math.max(...mockAdmins.map(a => a.id)) + 1,
          _id: (Math.max(...mockAdmins.map(a => a.id)) + 1).toString(),
          username: adminData.username,
          password: adminData.password,
          name: adminData.username,
          email: `${adminData.username}@dogrescue.org`,
          phone: '(555) 000-0000',
          role: 'admin' as const,
          status: 'approved' as const,
          createdAt: new Date().toISOString()
        };
        
        mockAdmins.push(newAdmin);
        
        return {
          success: true,
          message: 'Admin registered successfully'
        };
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  },
  
  // Logout
  logout: () => {
    setAuthToken(null);
    return { success: true };
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  // Verify admin token
  verifyToken: async (): Promise<boolean> => {
    try {
      // Try API call first
      try {
        const response = await auth.get('/auth/admin/verify');
        return response.data.success;
      } catch (apiError) {
        console.warn('Backend API not available, using mock data:', apiError);
        
        // For mock data, just check if token exists (this is NOT secure for production)
        return !!localStorage.getItem('adminToken');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
};

export default authService; 