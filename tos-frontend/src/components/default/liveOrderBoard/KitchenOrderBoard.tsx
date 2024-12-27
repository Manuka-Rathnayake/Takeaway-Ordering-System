'use client'

import { useState, useEffect } from 'react'
import { Order, ORDER_STATUS } from './OrderTypes'
import { OrderQueue } from './OrderQueue'

// Mock data generation function
const generateMockOrders = (count: number): Order[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    customerName: `Customer ${i + 1}`,
    phoneNumber: `123-456-${7890 + i}`,
    menuItems: [
      { id: `item${i + 1}`, name: `Dish ${i + 1}`, ingredients: ['Ingredient 1', 'Ingredient 2'] },
    ],
    status: i % 4 === 0 ? 'new' : i % 4 === 1 ? 'processing' : i % 4 === 2 ? 'completed' : 'cancelled',
    timestamp: Date.now() - Math.floor(Math.random() * 10000000),
  }));
};

export const KitchenOrderBoard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(generateMockOrders(20));

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleRemoveOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // Simulate new orders coming in
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => [
        ...prevOrders,
        ...generateMockOrders(1).map(order => ({ ...order, id: (parseInt(prevOrders[prevOrders.length - 1].id) + 1).toString() }))
      ]);
    }, 15000); // Add a new order every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const ordersByStatus = Object.values(ORDER_STATUS).reduce((acc, status) => {
    acc[status] = orders.filter(order => order.status === status);
    return acc;
  }, {} as Record<Order['status'], Order[]>);

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Kitchen Order Board</h1> */}
      {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
        <OrderQueue
          key={status}
          title={`${status.charAt(0).toUpperCase() + status.slice(1)} Orders`}
          orders={statusOrders}
          onStatusChange={handleStatusChange}
          onRemoveOrder={handleRemoveOrder}
        />
      ))}
    </div>
  );
};

