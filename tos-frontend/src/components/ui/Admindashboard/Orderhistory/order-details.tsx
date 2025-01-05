import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { IOrder } from '@/types/types'

interface OrderDetailsProps {
  order: IOrder | null
  onClose: () => void
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  if (!order) return null

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className='text-[#EF4444]'>Order Details - {order._id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold">Customer Information</h3>
              <p>Name: {order.customerName}</p>
              <p>Customer Number: {order.customerNumber}</p>
            </div>
            <div>
              <h3 className="font-bold">Order Information</h3>
              <p>Status: {order.status}</p>
              <p>Kitchen Status: {order.statusKitchen}</p>
              <p>Created: {format(new Date(order.createdAt), 'PPp')}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold">Menu Items</h3>
            <ul className="list-disc pl-5">
              {order.menuItem.map((item, index) => (
                <li key={index}>
                  {item.id.name} - Quantity: {item.quantity}, Price: ${item.id.price.$numberDecimal}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Payment Details</h3>
            <p>Total Price: ${Number(order.totalPrice.$numberDecimal).toFixed(2)}</p>
            <p>Discount: ${Number(order.discount.$numberDecimal).toFixed(2)}</p>
            <p>Payment Status: {order.payment.isPaid ? 'Paid' : 'Unpaid'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetails

