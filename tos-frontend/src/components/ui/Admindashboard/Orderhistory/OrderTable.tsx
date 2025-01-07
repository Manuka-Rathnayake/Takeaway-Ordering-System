import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IOrder } from '@/types/types';
// import { formatDecimal } from '../utils/formatDecimal';
import OrderDetailsPopup from './OrderDetailsPopup';

interface OrdersTableProps {
  orders: IOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No orders found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Order ID</TableHead>
            <TableHead className="font-semibold">Customer Name</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Total Price</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order._id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
              <TableCell className="font-mono text-sm">{order._id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {order.status}
                </span>
              </TableCell>
              <TableCell className="font-semibold">${Number(order.totalPrice.$numberDecimal).toFixed(2)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(order.updatedAt)}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => setSelectedOrder(order)}
                  variant="outline"
                  size="sm"
                  className="hover:bg-muted"
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

