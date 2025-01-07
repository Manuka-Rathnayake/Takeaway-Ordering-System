import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MenuItemSelection } from './MenuItenSelection'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { useMenuStore } from '@/Store/useMenuStore'
import api from '@/utils/axios'

const OrderSchema = z.object({
  customerNumber: z.string().min(1, "Customer number is required"),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
})

interface OrderMenuItemI {
  id: string;
  quantity: number;
}

export function CashierAddMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderMenuItemI[]>([])
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const { menuItems, fetchMenuItems } = useMenuStore();
  const [discount, setDiscount] = useState(0)

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      customerNumber: '',
      customerName: '',
    },
  })

  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const onSubmit = async (values: z.infer<typeof OrderSchema>) => {
    if (orderItems.length === 0) {
      alert('Please add at least one menu item')
      return
    }

    const orderData = {
      ...values,
      menuItem: orderItems,
      status: 'pending',
      statusKitchen: 'pending',
      discount: discount,
      payment: {
        isPaid: false,
      },
    }
    console.log(orderData)
    try {
      const response = await api.post('/orders/add', orderData)
      if (response.status == 201) {
        const data = response.data.data
        setOrderNumber(data.orderNumber)
        setOrderItems([])
        form.reset()
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    }
  }

  const addMenuItem = (item: OrderMenuItemI) => {
    setOrderItems((prev: OrderMenuItemI[]) => {
      const existingItem = prev.find(i => i.id === item.id);

      if (existingItem) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, item];
    });
  };
  const removeMenuItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id.toString() !== itemId))
  }

  const adjustQuantity = (itemId: string, delta: number) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id.toString() === itemId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }))
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const menuItem = menuItems.find(mi => mi._id === item.id.toString())
      return total + (Number(menuItem?.price.$numberDecimal || 0) * item.quantity)
    }, 0)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add New Order</h1>
      <div className='border  p-6 rounded-md' >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DialogTrigger asChild>
                <Button type="button" size="sm" className='bg-red-500' > <Plus /> Add Menu Items</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Menu Items</DialogTitle>
                </DialogHeader>
                <MenuItemSelection items={menuItems} onAdd={(item) => {
                  addMenuItem(item)
                  setIsMenuOpen(false)
                }} />
              </DialogContent>
            </Dialog>
            <Table className='border drop-shadow-lg ' >
              <TableHeader>
                <TableRow className='bg-red-100 ' >
                  <TableHead className='text-red-500 font-semibold' >Image</TableHead>
                  <TableHead className='text-red-500 font-semibold'>Item</TableHead>
                  <TableHead className='text-red-500 font-semibold'>Quantity</TableHead>
                  <TableHead className='text-red-500 font-semibold'>Price</TableHead>
                  <TableHead className='text-red-500 font-semibold'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map(item => {
                  const menuItem = menuItems.find(mi => mi._id === item.id.toString())
                  return (
                    <TableRow key={item.id.toString()}>
                      <TableCell>
                        <img
                          src={`${api.defaults.baseURL}${menuItem?.imagePath}` || '/placeholder.svg'}
                          alt={menuItem?.name || 'Menu item'}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>{menuItem?.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => adjustQuantity(item.id.toString(), -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => adjustQuantity(item.id.toString(), 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${(Number(menuItem?.price.$numberDecimal || 0) * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive" onClick={() => removeMenuItem(item.id.toString())}><Trash2 /></Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter className='text-lg' >
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">${calculateTotal().toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Discount</TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-20 text-right"
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow className='border bg-red-100 text-red-500' >
                  <TableCell colSpan={3}>Final Total</TableCell>
                  <TableCell className="text-right font-bold">
                    ${(calculateTotal() - discount).toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <Button type="submit" className='bg-red-500'>Create Order</Button>
          </form>
        </Form>
        {orderNumber && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
            Order created successfully! Order Number: {orderNumber}
          </div>
        )}
      </div>
    </div>
  )
}

