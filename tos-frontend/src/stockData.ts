export const mockFoods = [
  { id: 1, name: "Pizza Margherita", brand: "Italian Delights", quantity: 45, unit: "pcs" },
  { id: 2, name: "Sushi Rolls", brand: "Ocean Fresh", quantity: 120, unit: "pcs" },
  { id: 3, name: "Tomato Sauce", brand: "Chef's Best", quantity: 35, unit: "L" },
  { id: 4, name: "Olive Oil", brand: "Mediterranean Gold", quantity: 50, unit: "L" },
  { id: 5, name: "Rice", brand: "Golden Harvest", quantity: 200, unit: "kg" },
  { id: 6, name: "Pasta", brand: "Italian Choice", quantity: 150, unit: "kg" },
  { id: 7, name: "Ground Coffee", brand: "Morning Brew", quantity: 40, unit: "kg" },
  { id: 8, name: "Fresh Milk", brand: "Dairy Fresh", quantity: 100, unit: "L" },
  { id: 9, name: "Cheese Blocks", brand: "Dairy Delight", quantity: 80, unit: "kg" },
  { id: 10, name: "Chicken Breast", brand: "Farm Fresh", quantity: 75, unit: "kg" },
  { id: 11, name: "Mixed Vegetables", brand: "Garden Fresh", quantity: 90, unit: "kg" },
  { id: 12, name: "Bread Loaves", brand: "Baker's Joy", quantity: 60, unit: "pcs" },
  { id: 13, name: "Fruit Juice", brand: "Natural Nectar", quantity: 85, unit: "L" },
  { id: 14, name: "Ice Cream", brand: "Cool Delights", quantity: 40, unit: "L" },
  { id: 15, name: "Chocolate Bars", brand: "Sweet Dreams", quantity: 200, unit: "pcs" },
  { id: 16, name: "Yogurt Cups", brand: "Healthy Choice", quantity: 150, unit: "pcs" },
  { id: 17, name: "Cooking Oil", brand: "Kitchen King", quantity: 65, unit: "L" },
  { id: 18, name: "Flour", brand: "Baker's Best", quantity: 175, unit: "kg" },
  { id: 19, name: "Sugar", brand: "Sweet Crystal", quantity: 160, unit: "kg" },
  { id: 20, name: "Salt", brand: "Pure Crystal", quantity: 95, unit: "kg" }
]

export type Unit = 'kg' | 'g' | 'L' | 'mL' | 'pcs' | 'dozen' | 'box'

export interface FoodItem {
  id: number
  name: string
  brand: string
  quantity: number
  unit: Unit
}

