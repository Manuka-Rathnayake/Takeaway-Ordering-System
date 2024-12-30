import { create } from "zustand";
import axios from "axios";
import menuData from "@/menuData.json"

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
}

interface MenuState {
  menuItems: MenuItem[];
  selectedItem: MenuItem | null;
  fetchMenuItems: () => Promise<void>;
  selectItem: (item: MenuItem | null) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuItems: [],
  selectedItem: null,
  fetchMenuItems: async () => {
    try {
      const response = await axios.get("/api/menu"); // Replace API endpoint
      set({ menuItems: menuData.menuData});
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  },
  selectItem: (item) => set({ selectedItem: item }),
}));
