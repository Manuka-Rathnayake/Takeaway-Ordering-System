import { Order } from '@/Store/useOrderhistory'

const customerNames = [
  'Emma Thompson', 'Liam Chen', 'Sofia Rodriguez', 
  'Marcus Johnson', 'Aisha Patel', 'Lucas Kim',
  'Isabella Santos', 'Oliver Wright', 'Zara Ahmed',
  'Noah Williams', 'Ava Garcia', 'Ethan Lee',
  'Mia Anderson', 'James Wilson', 'Sophia Brown',
  'Alexander Davis', 'Olivia Taylor', 'William Martin',
  'Charlotte Moore', 'Benjamin White'
]

const menuItems = [
  { name: 'Grilled Salmon', price: 24.99 },
  { name: 'Margherita Pizza', price: 18.99 },
  { name: 'Caesar Salad', price: 12.99 },
  { name: 'Beef Burger', price: 16.99 },
  { name: 'Pasta Carbonara', price: 19.99 }
]

export const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => {
  const items = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => {
      const item = menuItems[Math.floor(Math.random() * menuItems.length)]
      return {
        menuItemId: item.name,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: item.price
      }
    }
  )

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = Math.random() > 0.7 ? totalPrice * 0.1 : 0

  return {
    id: `#${96459761 + i}`,
    customerNumber: `CUST${1000 + i}`,
    customerName: customerNames[i],
    status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)] as Order['status'],
    statusKitchen: ['queued', 'preparing', 'ready', 'served'][Math.floor(Math.random() * 4)] as Order['statusKitchen'],
    addUser: `staff${Math.floor(Math.random() * 5) + 1}`,
    price: totalPrice,
    totalPrice: totalPrice - discount,
    discount,
    menuItems: items,
    payment: {
      isPaid: Math.random() > 0.3,
      paymentMethod: ['credit_card', 'cash', 'debit_card'][Math.floor(Math.random() * 3)],
      time: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      userId: `user${Math.floor(Math.random() * 100) + 1}`,
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
  }
})

