export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Classic Burger', price: 9.99, category: 'Main' },
  { id: '2', name: 'Cheese Pizza', price: 12.99, category: 'Main' },
  { id: '3', name: 'Caesar Salad', price: 7.99, category: 'Side' },
  { id: '4', name: 'French Fries', price: 3.99, category: 'Side' },
  { id: '5', name: 'Coca-Cola', price: 1.99, category: 'Drink' },
  { id: '6', name: 'Chicken Wings', price: 8.99, category: 'Appetizer' },
  { id: '7', name: 'Veggie Wrap', price: 7.99, category: 'Main' },
  { id: '8', name: 'Mushroom Soup', price: 5.99, category: 'Appetizer' },
  { id: '9', name: 'Grilled Salmon', price: 15.99, category: 'Main' },
  { id: '10', name: 'Onion Rings', price: 4.99, category: 'Side' },
  { id: '11', name: 'Iced Tea', price: 2.49, category: 'Drink' },
  { id: '12', name: 'Margherita Pizza', price: 11.99, category: 'Main' },
  { id: '13', name: 'Chicken Caesar Wrap', price: 8.99, category: 'Main' },
  { id: '14', name: 'Mozzarella Sticks', price: 6.99, category: 'Appetizer' },
  { id: '15', name: 'Greek Salad', price: 8.99, category: 'Side' },
  { id: '16', name: 'Chocolate Milkshake', price: 4.99, category: 'Drink' },
  { id: '17', name: 'Fish and Chips', price: 13.99, category: 'Main' },
  { id: '18', name: 'Garlic Bread', price: 3.99, category: 'Side' },
  { id: '19', name: 'Sprite', price: 1.99, category: 'Drink' },
  { id: '20', name: 'Cheesecake', price: 5.99, category: 'Dessert' },
];

