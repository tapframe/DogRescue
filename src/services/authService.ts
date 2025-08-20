import axios from 'axios';
import { VolunteerData } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

// Define our own admin user data type that's simpler than extending VolunteerData
interface AdminUser {
  id?: number | string;
  _id?: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin';
  status?: string;
  createdAt?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
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

// Use mock mode if backend is not available
let useMockMode = false;

// Function to handle API errors and switch to mock mode
const handleApiError = (error: any) => {
  console.warn('Backend API not available, using mock data:', error);
  useMockMode = true;
  return null;
};

// Set admin user in localStorage
const setAdminUser = (user: AdminUser | null) => {
  if (user) {
    localStorage.setItem('adminUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('adminUser');
  }
};

// Clear all auth storage and reset state
const clearStorage = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  delete auth.defaults.headers.common['Authorization'];
  useMockMode = false;
  console.log('Auth storage cleared, state reset');
};

export const authService = {
  // Clear all auth data
  clearStorage,
  
  // Admin login
  login: async (credentials: AdminCredentials): Promise<AuthResponse> => {
    try {
      // Skip API call if we already know it's not available
      if (!useMockMode) {
        try {
          console.log('Attempting API login with:', credentials.username);
          const response = await auth.post('/auth/admin/login', credentials);
          console.log('Login API response:', response.data);
          
          const { token, user } = response.data;
          
          if (token) {
            setAuthToken(token);
          }
          
          if (user) {
            setAdminUser(user);
          }
          
          return response.data;
        } catch (apiError: any) {
          console.error('Login API error:', apiError.response?.data || apiError.message);
          if (apiError.response?.data) {
            return apiError.response.data;
          }
          handleApiError(apiError);
        }
      }
      
      // Fallback to mock data
      console.log('Using mock login with:', credentials.username);
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
      
      // Store the admin user data
      setAdminUser(adminWithoutPassword);
      
      return {
        success: true,
        token: mockToken,
        user: adminWithoutPassword
      };
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
      // Create email from username if not provided
      const email = adminData.username.includes('@') 
        ? adminData.username 
        : `${adminData.username}@dogrescue.org`;
      
      // Create full registration data
      const registrationData = {
        ...adminData,
        name: adminData.username, // Use username as name if not provided
        email
      };
      
      // Skip API call if we already know it's not available
      if (!useMockMode) {
        try {
          console.log('Attempting API registration with:', registrationData.username);
          const response = await auth.post('/auth/admin/register', registrationData);
          console.log('Registration API response:', response.data);
          
          // If successful, automatically log in
          if (response.data.success && response.data.token) {
            setAuthToken(response.data.token);
            
            if (response.data.user) {
              setAdminUser(response.data.user);
            }
          }
          
          return response.data;
        } catch (apiError: any) {
          console.error('Registration API error:', apiError.response?.data || apiError.message);
          // Check if it's a validation error or server is unavailable
          if (apiError.response && apiError.response.data) {
            return apiError.response.data;
          }
          handleApiError(apiError);
        }
      }
      
      // Verify secret key for mock mode
      if (adminData.secretKey !== ADMIN_SECRET_KEY) {
        return {
          success: false,
          message: 'Invalid secret key'
        };
      }
      
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
        email,
        phone: '(555) 000-0000',
        role: 'admin' as const,
        status: 'approved' as const,
        createdAt: new Date().toISOString()
      };
      
      mockAdmins.push(newAdmin);
      
      // Generate a mock token
      const mockToken = `mock_${Math.random().toString(36).substring(2)}`;
      setAuthToken(mockToken);
      
      const { password, ...adminWithoutPassword } = newAdmin;
      
      // Store the admin user data
      setAdminUser(adminWithoutPassword);
      
      return {
        success: true,
        token: mockToken,
        user: adminWithoutPassword,
        message: 'Admin registered successfully'
      };
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
    setAdminUser(null);
    return { success: true };
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  // Get current admin user
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminUser');
    return adminData ? JSON.parse(adminData) : null;
  },
  
  // Verify admin token
  verifyToken: async (): Promise<boolean> => {
    try {
      // Skip API call if we already know it's not available
      if (!useMockMode) {
        try {
          const response = await auth.get('/auth/admin/verify');
          
          // If we get user data from verification, store it
          if (response.data.success && response.data.user) {
            setAdminUser(response.data.user);
          }
          
          return response.data.success;
        } catch (apiError) {
          handleApiError(apiError);
        }
      }
      
      // For mock data, just check if token exists (this is NOT secure for production)
      const isAuthenticated = !!localStorage.getItem('adminToken');
      
      // If authenticated but no user data, use a default user
      if (isAuthenticated && !localStorage.getItem('adminUser')) {
        const defaultAdmin: AdminUser = {
          id: '999',
          _id: '999',
          username: 'admin',
          name: 'System Administrator',
          email: 'admin@dogrescue.org',
          phone: '(555) 000-0000',
          role: 'admin',
          status: 'approved',
          createdAt: new Date().toISOString()
        };
        setAdminUser(defaultAdmin);
      }
      
      return isAuthenticated;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
};

export default authService; 