import axios from 'axios';

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
    localStorage.setItem('userToken', token);
    auth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('userToken');
    delete auth.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('userToken');
if (token) {
  setAuthToken(token);
}

export interface UserCredentials {
  username: string;
  password: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface User {
  id?: number | string;
  _id?: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user';
  status?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Set user in localStorage
const setUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Clear all auth storage and reset state
const clearStorage = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('user');
  delete auth.defaults.headers.common['Authorization'];
  console.log('User auth storage cleared, state reset');
};

export const userAuthService = {
  // Clear all auth data
  clearStorage,
  
  // User registration
  register: async (userData: UserCredentials): Promise<AuthResponse> => {
    try {
      // Create email from username if not provided
      const email = userData.email || (userData.username.includes('@') 
        ? userData.username 
        : `${userData.username}@example.com`);
      
      // Create full registration data
      const registrationData = {
        ...userData,
        name: userData.name || userData.username, // Use username as name if not provided
        email
      };
      
      console.log('Attempting API registration with:', registrationData.username);
      const response = await auth.post('/auth/user/register', registrationData);
      console.log('Registration API response:', response.data);
      
      // If successful, automatically log in
      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
        
        if (response.data.user) {
          setUser(response.data.user);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  },
  
  // User login
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
      console.log('Attempting API login with:', credentials.username);
      const response = await auth.post('/auth/user/login', credentials);
      console.log('Login API response:', response.data);
      
      const { token, user } = response.data;
      
      if (token) {
        setAuthToken(token);
      }
      
      if (user) {
        setUser(user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },
  
  // Logout
  logout: () => {
    setAuthToken(null);
    setUser(null);
    return { success: true };
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('userToken');
  },
  
  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  // Verify user token
  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await auth.get('/auth/user/verify');
      
      // If we get user data from verification, store it
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      }
      
      return response.data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
}; 