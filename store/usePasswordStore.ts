import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';

export interface PasswordEntry {
  id: string;
  title: string;
  password: string;
  note: string;
  appName: string;
  email: string;
  username: string;
  category: string;
  createdAt: number;
}

interface PasswordState {
  isMasterPasswordSet: boolean;
  isAuthenticated: boolean;
  passwords: PasswordEntry[];
  isLoading: boolean;
  
  // App initialization
  initApp: () => Promise<void>;
  
  // Auth
  setMasterPassword: (password: string) => Promise<void>;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  
  // Data
  addPassword: (entry: Omit<PasswordEntry, 'id' | 'createdAt'>) => Promise<void>;
  editPassword: (id: string, updatedData: Partial<Omit<PasswordEntry, 'id' | 'createdAt'>>) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
}

const MASTER_KEY = 'MASTER_PASSWORD';
const DATA_KEY = 'PASSWORD_VAULT_DATA';

export const usePasswordStore = create<PasswordState>((set, get) => ({
  isMasterPasswordSet: false,
  isAuthenticated: false,
  passwords: [],
  isLoading: true,

  initApp: async () => {
    try {
      const masterPass = await SecureStore.getItemAsync(MASTER_KEY);
      set({ isMasterPasswordSet: !!masterPass, isLoading: false });
    } catch (error) {
      console.error('Error initializing app:', error);
      set({ isLoading: false });
    }
  },

  setMasterPassword: async (password: string) => {
    try {
      await SecureStore.setItemAsync(MASTER_KEY, password);
      // Initialize an empty vault if none exists
      const existingData = await SecureStore.getItemAsync(DATA_KEY);
      if (!existingData) {
        await SecureStore.setItemAsync(DATA_KEY, JSON.stringify([]));
      }
      set({ isMasterPasswordSet: true, isAuthenticated: true });
    } catch (error) {
      console.error('Error setting master password:', error);
      throw error;
    }
  },

  login: async (password: string) => {
    try {
      const masterPass = await SecureStore.getItemAsync(MASTER_KEY);
      if (masterPass === password) {
        // Load passwords after successful login
        const dataStr = await SecureStore.getItemAsync(DATA_KEY);
        let loadedPasswords: PasswordEntry[] = [];
        if (dataStr) {
          loadedPasswords = JSON.parse(dataStr);
        }
        set({ isAuthenticated: true, passwords: loadedPasswords });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  },

  logout: () => {
    set({ isAuthenticated: false, passwords: [] });
  },

  addPassword: async (entryData) => {
    const { passwords } = get();
    const newEntry: PasswordEntry = {
      ...entryData,
      id: uuid.v4() as string,
      createdAt: Date.now(),
    };
    
    const updatedPasswords = [newEntry, ...passwords];
    
    try {
      await SecureStore.setItemAsync(DATA_KEY, JSON.stringify(updatedPasswords));
      set({ passwords: updatedPasswords });
    } catch (error) {
      console.error('Error adding password:', error);
      throw error;
    }
  },

  editPassword: async (id, updatedData) => {
    const { passwords } = get();
    const updatedPasswords = passwords.map(p => 
      p.id === id ? { ...p, ...updatedData } : p
    );
    
    try {
      await SecureStore.setItemAsync(DATA_KEY, JSON.stringify(updatedPasswords));
      set({ passwords: updatedPasswords });
    } catch (error) {
      console.error('Error editing password:', error);
      throw error;
    }
  },

  deletePassword: async (id) => {
    const { passwords } = get();
    const updatedPasswords = passwords.filter(p => p.id !== id);
    
    try {
      await SecureStore.setItemAsync(DATA_KEY, JSON.stringify(updatedPasswords));
      set({ passwords: updatedPasswords });
    } catch (error) {
      console.error('Error deleting password:', error);
      throw error;
    }
  }
}));
