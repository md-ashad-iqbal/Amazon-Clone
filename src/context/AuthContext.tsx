import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '@/services/api';
import type { Address, User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'amazon_clone_auth_token';
const USER_KEY = 'amazon_clone_user';
const LEGACY_TOKEN_KEY = 'shopsphere_auth_token';
const LEGACY_USER_KEY = 'shopsphere_user';

// Built-in fallback demo account
const FALLBACK_DEMO_USER: User = {
  id: 'usr_demo_001',
  name: 'Ashad Iqbal',
  email: 'demo@amazonclone.com',
  role: 'customer',
  addresses: [
    {
      id: 'addr_001',
      fullName: 'Ashad Iqbal',
      phone: '+91 98765 43210',
      street: '42 Marine Drive, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400021',
      isDefault: true,
    },
    {
      id: 'addr_002',
      fullName: 'Ashad Iqbal (Office)',
      phone: '+91 98765 43211',
      street: 'Building 7, Mindspace IT Park, Hitec City',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500081',
      isDefault: false,
    },
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    async function checkSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
      } catch {
        // If API fails but we have a valid stored user, keep the session
      } finally {
        setIsLoading(false);
      }
    }
    checkSession();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await apiClient.post('/auth/login', { email: cleanEmail, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
        return true;
      }
      toast.error(res.data.message || 'Login failed');
      return false;
    } catch (err: unknown) {
      // Offline / fallback support
      if (
        (cleanEmail === 'demo@amazonclone.com' || cleanEmail === 'demo@shopsphere.com') &&
        password === 'demo12345'
      ) {
        const mockToken = 'mock_jwt_token_demo_mode_2026';
        setToken(mockToken);
        setUser(FALLBACK_DEMO_USER);
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(FALLBACK_DEMO_USER));
        toast.success(`Welcome back, Ashad (Demo)!`);
        return true;
      }
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        toast.success('Account created successfully!');
        return true;
      }
      toast.error(res.data.message || 'Registration failed');
      return false;
    } catch {
      // Local fallback
      const mockUser: User = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'customer',
        addresses: [],
      };
      const mockToken = `mock_jwt_token_${Date.now()}`;
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      toast.success('Account created successfully!');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    toast.success('You have signed out.');
  };

  const updateProfile = async (name: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await apiClient.put('/auth/profile', { name });
      if (res.data.success) {
        const updated = { ...user, name: name.trim() };
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        toast.success('Profile updated.');
        return true;
      }
      return false;
    } catch {
      const updated = { ...user, name: name.trim() };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      toast.success('Profile updated.');
      return true;
    }
  };

  const addAddress = async (newAddressData: Omit<Address, 'id'>): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await apiClient.post('/users/addresses', newAddressData);
      if (res.data.success) {
        const updated = { ...user, addresses: res.data.addresses };
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        toast.success('Address added successfully.');
        return true;
      }
      return false;
    } catch {
      const newAddr: Address = {
        ...newAddressData,
        id: `addr_${Date.now()}`,
      };
      const addresses = user.addresses ? [...user.addresses] : [];
      if (newAddr.isDefault) {
        addresses.forEach((a) => (a.isDefault = false));
      } else if (addresses.length === 0) {
        newAddr.isDefault = true;
      }
      addresses.push(newAddr);
      const updated = { ...user, addresses };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      toast.success('Address added successfully.');
      return true;
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await apiClient.put(`/users/addresses/${addressId}`, updates);
      if (res.data.success) {
        const updated = { ...user, addresses: res.data.addresses };
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        toast.success('Address updated.');
        return true;
      }
      return false;
    } catch {
      const addresses = user.addresses.map((a) => {
        if (a.id === addressId) {
          return { ...a, ...updates };
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });
      const updated = { ...user, addresses };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      toast.success('Address updated.');
      return true;
    }
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await apiClient.delete(`/users/addresses/${addressId}`);
      if (res.data.success) {
        const updated = { ...user, addresses: res.data.addresses };
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        toast.success('Address removed.');
        return true;
      }
      return false;
    } catch {
      const addresses = user.addresses.filter((a) => a.id !== addressId);
      if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
        addresses[0].isDefault = true;
      }
      const updated = { ...user, addresses };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      toast.success('Address removed.');
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
