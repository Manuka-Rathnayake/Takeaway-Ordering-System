import { Order } from './OrderTypes'
import { OrderCard } from './OrderCard'

interface OrderQueueProps {
  title: string;
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
  onRemoveOrder: (orderId: string) => void;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({ title, orders, onStatusChange, onRemoveOrder }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onRemoveOrder={onRemoveOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

