import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IOrder } from '@/types/types';
// import { formatDecimal } from '../utils/formatDecimal';

interface OrderDetailsPopupProps {
  order: IOrder;
  onClose: () => void;
}

export default function OrderDetailsPopup({ order, onClose }: OrderDetailsPopupProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order ID: {order._id}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
          <p>Name: {order.customerName}</p>
          <p>Number: {order.customerNumber}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Order Information</h3>
          <p>Status: {order.status}</p>
          <p>Kitchen Status: {order.statusKitchen}</p>
          <p>Total Price: ${order.totalPrice.$numberDecimal}</p>
          <p>Discount: ${order.discount.$numberDecimal}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Menu Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.menuItem.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.id.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.id.price.$numberDecimal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <p>Paid: {order.payment.isPaid ? 'Yes' : 'No'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

