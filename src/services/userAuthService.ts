import axios from 'axios';

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

// Mock user data for fallback when API is not available
const mockUsers: Array<User & { password: string }> = [
  {
    id: 1,
    _id: '1',
    username: 'user1',
    password: 'password123', // In a real app, would never store plaintext passwords
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    role: 'user' as const,
    status: 'active' as const,
    createdAt: '2023-01-01T00:00:00Z'
  }
];

// Use mock mode if backend is not available
let useMockMode = false;

// Function to handle API errors and switch to mock mode
const handleApiError = (error: any) => {
  console.warn('Backend API not available, using mock data:', error);
  useMockMode = true;
  return null;
};

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
  useMockMode = false;
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
      
      // Skip API call if we already know it's not available
      if (!useMockMode) {
        try {
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
        } catch (apiError: any) {
          console.error('Registration API error:', apiError.response?.data || apiError.message);
          // Check if it's a validation error or server is unavailable
          if (apiError.response && apiError.response.data) {
            return apiError.response.data;
          }
          handleApiError(apiError);
        }
      }
      
      // Check if username already exists in mock data
      if (mockUsers.some(u => u.username === userData.username)) {
        return {
          success: false,
          message: 'Username already exists'
        };
      }
      
      // Create new user in mock data
      const newUser = {
        id: mockUsers.length > 0 ? Math.max(...mockUsers.map(u => Number(u.id))) + 1 : 1,
        _id: (mockUsers.length > 0 ? Math.max(...mockUsers.map(u => Number(u.id))) + 1 : 1).toString(),
        username: userData.username,
        password: userData.password,
        name: userData.name || userData.username,
        email,
        phone: userData.phone || '',
        role: 'user' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      
      // Generate a mock token
      const mockToken = `mock_${Math.random().toString(36).substring(2)}`;
      setAuthToken(mockToken);
      
      const { password, ...userWithoutPassword } = newUser;
      
      // Store the user data
      setUser(userWithoutPassword);
      
      return {
        success: true,
        token: mockToken,
        user: userWithoutPassword,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  },
  
  // User login
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
      // Skip API call if we already know it's not available
      if (!useMockMode) {
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
      const user = mockUsers.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      );
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }
      
      // Generate a mock token (never do this in production)
      const mockToken = `mock_${Math.random().toString(36).substring(2)}`;
      setAuthToken(mockToken);
      
      const { password, ...userWithoutPassword } = user;
      
      // Store the user data
      setUser(userWithoutPassword);
      
      return {
        success: true,
        token: mockToken,
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
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
      // Skip API call if we already know it's not available
      if (!useMockMode) {
        try {
          const response = await auth.get('/auth/user/verify');
          
          // If we get user data from verification, store it
          if (response.data.success && response.data.user) {
            setUser(response.data.user);
          }
          
          return response.data.success;
        } catch (apiError) {
          handleApiError(apiError);
        }
      }
      
      // For mock data, just check if token exists (this is NOT secure for production)
      const isAuthenticated = !!localStorage.getItem('userToken');
      
      // If authenticated but no user data, use a default user
      if (isAuthenticated && !localStorage.getItem('user')) {
        const defaultUser: User = {
          id: '1',
          _id: '1',
          username: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setUser(defaultUser);
      }
      
      return isAuthenticated;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
}; 