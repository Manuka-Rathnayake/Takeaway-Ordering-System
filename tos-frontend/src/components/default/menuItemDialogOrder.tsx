import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMenuStore } from "@/Store/useMenuStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useWebSocketStore } from "@/state"

const formSchema = z.object({
  menuItem: z.string({
    required_error: "Please select a menu item.",
  }),
  quantity: z.number({
    required_error: "Please enter a quantity.",
  }).int().positive().max(10, "Maximum quantity is 10"),
})

interface MenuItemDialogOrderProps {
  orderId: string
}

export default function MenuItemDialogOrder({ orderId }: MenuItemDialogOrderProps) {
  const [open, setOpen] = React.useState(false)
  const { menuItems, fetchMenuItems } = useMenuStore();

  console.log(menuItems);
  React.useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { sendMessage } = useWebSocketStore.getState();
    console.log(values)
    setOpen(false)
    const data = {
      orderId: orderId,
      menuItemId: values.menuItem,
      quantity: values.quantity
    }
    sendMessage({
      msgType: "add-menu-item",
      payload: data
    })
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Menu Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Select a menu item and specify the quantity.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="menuItem"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Menu Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a menu item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {menuItems?.length > 0 ? (
                        menuItems.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <p>No menu items available</p>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add to Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

