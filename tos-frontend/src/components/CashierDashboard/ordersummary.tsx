import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import useCashierStore from '@/Store/cashierStore';

const OrderSummary: React.FC = () => {
  const {
    orderItems,
    removeItemFromOrder,
    updateItemQuantity,
    calculateSubtotal,
    calculateTotal,
    discount,
    setDiscount,
    placeOrder,
    paymentMethod,
    setPaymentMethod,
    customerDetails
  } = useCashierStore();

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const { toast } = useToast();

  const handlePlaceOrder = async () => {
    try {
      if (!customerDetails.customerName || !customerDetails.customerNumber) {
        throw new Error("Please fill in all required customer details");
      }

      if (!paymentMethod) {
        throw new Error("Please select a payment method");
      }

      if (orderItems.length === 0) {
        throw new Error("Please add at least one item to the order");
      }

      const order = await placeOrder();
      console.log('Order placed successfully:', order);
      setIsConfirmOpen(false);
      toast({
        title: "Order Placed Successfully",
        description: `Order for ${order.customerName} has been placed.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error placing the order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.menuItemId}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateItemQuantity(item.menuItemId, Math.max(1, item.quantity - 1))}
                      className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}
                      className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    onClick={() => removeItemFromOrder(item.menuItemId)}
                    className="bg-[#EF4444] hover:bg-[#DC2626]"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Discount:</span>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
              className="w-24"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Payment Method
              <span className="text-[#EF4444]">*</span>
            </span>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <Button 
          onClick={() => setIsConfirmOpen(true)} 
          size="lg" 
          className="w-full mt-4 bg-[#EF4444] hover:bg-[#DC2626]"
        >
          Place Order
        </Button>
      </CardContent>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePlaceOrder} className="bg-[#EF4444] hover:bg-[#DC2626]">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default OrderSummary;

