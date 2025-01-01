import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Order, STATUS_COLORS, ORDER_STATUS, updateOrderStatus } from './OrderTypes'
import { IngredientsModal } from './IngredientsModal'

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
  onRemoveOrder: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange, onRemoveOrder }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: Order['status']) => {
    setIsUpdating(true);
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      onStatusChange(updatedOrder.id, updatedOrder.status);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={`${STATUS_COLORS[order.status]} border-l-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 w-[300px] flex-shrink-0`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <span className="text-sm text-gray-500">
            {new Date(order.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm mb-1"><strong>Customer:</strong> {order.customerName}</p>
        <p className="text-sm mb-2"><strong>Phone:</strong> {order.phoneNumber}</p>
        <div className="mb-3">
          <strong className="text-sm">Menu Items:</strong>
          <ul className="list-disc list-inside text-sm">
            {order.menuItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center">
          <IngredientsModal menuItems={order.menuItems} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Change Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(ORDER_STATUS).map((status) => (
                <DropdownMenuItem key={status} onSelect={() => handleStatusChange(status)}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => onRemoveOrder(order.id)}
              >
                Remove Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

