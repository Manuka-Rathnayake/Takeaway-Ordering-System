// // store/types.ts
// export interface Product {
//     id: string;
//     name: string;
//     category: string;
//     quantity: number;
//     status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
//   }
  
//   export interface PaginationResponse {
//     products: Product[];
//     total: number;
//     page: number;
//     limit: number;
//   }
  
//   export interface FilterOptions {
//     category?: string;
//     status?: string;
//     searchQuery?: string;
//   }
  
//   // store/stockStore.ts
//   import { create } from 'zustand';
//   import axios from 'axios';
//   import { Product, PaginationResponse, FilterOptions } from './types';
  
//   interface StockState {
//     products: Product[];
//     currentPage: number;
//     totalPages: number;
//     itemsPerPage: number;
//     isLoading: boolean;
//     error: string | null;
//     filters: FilterOptions;
    
//     // Actions
//     fetchProducts: (page?: number) => Promise<void>;
//     setFilters: (filters: FilterOptions) => void;
//     deleteProduct: (id: string) => Promise<void>;
//     updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
//   }
  
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
//   export const useStockStore = create<StockState>((set, get) => ({
//     products: [],
//     currentPage: 1,
//     totalPages: 1,
//     itemsPerPage: 10,
//     isLoading: false,
//     error: null,
//     filters: {},
  
//     fetchProducts: async (page = 1) => {
//       const { filters, itemsPerPage } = get();
//       set({ isLoading: true });
  
//       try {
//         const params = new URLSearchParams({
//           page: page.toString(),
//           limit: itemsPerPage.toString(),
//           ...filters
//         });
  
//         const { data } = await axios.get<PaginationResponse>(
//           `${API_URL}/products?${params}`
//         );
  
//         set({
//           products: data.products,
//           totalPages: Math.ceil(data.total / itemsPerPage),
//           currentPage: page,
//           error: null
//         });
//       } catch (error) {
//         set({ error: 'Failed to fetch products' });
//         console.error('Error fetching products:', error);
//       } finally {
//         set({ isLoading: false });
//       }
//     },
  
//     setFilters: (newFilters) => {
//       set({ filters: { ...get().filters, ...newFilters } });
//       get().fetchProducts(1); // Reset to first page with new filters
//     },
  
//     deleteProduct: async (id) => {
//       set({ isLoading: true });
//       try {
//         await axios.delete(`${API_URL}/products/${id}`);
//         get().fetchProducts(get().currentPage);
//       } catch (error) {
//         set({ error: 'Failed to delete product' });
//         console.error('Error deleting product:', error);
//       } finally {
//         set({ isLoading: false });
//       }
//     },
  
//     updateProduct: async (id, data) => {
//       set({ isLoading: true });
//       try {
//         await axios.patch(`${API_URL}/products/${id}`, data);
//         get().fetchProducts(get().currentPage);
//       } catch (error) {
//         set({ error: 'Failed to update product' });
//         console.error('Error updating product:', error);
//       } finally {
//         set({ isLoading: false });
//       }
//     }
//   }));