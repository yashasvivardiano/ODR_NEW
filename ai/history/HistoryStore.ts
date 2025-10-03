// History Store - Track all user activities
import { create } from 'zustand';

export interface HistoryItem {
  id: string;
  type: 'filing' | 'hearing' | 'audio_processing';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'processing' | 'failed';
  data?: any; // Store form data or results
}

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  updateItem: (id: string, updates: Partial<HistoryItem>) => void;
  getItemsByType: (type: HistoryItem['type']) => HistoryItem[];
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    set(state => ({
      items: [newItem, ...state.items] // Add to beginning for newest first
    }));
    
    return newItem.id;
  },
  
  updateItem: (id, updates) => {
    set(state => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  },
  
  getItemsByType: (type) => {
    return get().items.filter(item => item.type === type);
  },
  
  clearHistory: () => {
    set({ items: [] });
  },
}));
