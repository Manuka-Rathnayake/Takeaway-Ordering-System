import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStockStore from '@/Store/userStockStore';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  quantity: z.number().min(0, { message: "Quantity must be a positive number." }),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']),
});

interface EditStockFormProps {
  itemId: string;
  onClose: () => void;
}

const EditStockForm: React.FC<EditStockFormProps> = ({ itemId, onClose }) => {
  const { items, updateItem } = useStockStore();
  const item = items.find(i => i.id === itemId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "",
      quantity: item?.quantity || 0,
      status: item?.status || "In Stock",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        status: item.status,
      });
    }
  }, [item, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateItem(itemId, values);
    onClose();
  }

  if (!item) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fruit">Fruit</SelectItem>
                  <SelectItem value="Vegetable">Vegetable</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
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
                <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
};

export default EditStockForm;

