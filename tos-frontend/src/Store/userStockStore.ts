import { create } from 'zustand';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface StockStore {
  items: StockItem[];
  addItem: (item: StockItem) => void;
  updateItem: (id: string, item: Partial<StockItem>) => void;
  deleteItem: (id: string) => void;
}

const useStockStore = create<StockStore>((set) => ({
  items: [
    { id: "1", name: "Apple", category: "Fruit", quantity: 100, status: "In Stock" },
    { id: "2", name: "Banana", category: "Fruit", quantity: 50, status: "Low Stock" },
    { id: "3", name: "Carrot", category: "Vegetable", quantity: 0, status: "Out of Stock" },
    { id: "4", name: "Milk", category: "Dairy", quantity: 75, status: "In Stock" },
    { id: "5", name: "Bread", category: "Bakery", quantity: 25, status: "Low Stock" }
  ],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updatedItem) => set((state) => ({
    items: state.items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
}));

export default useStockStore;

