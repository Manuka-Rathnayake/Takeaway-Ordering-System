"use client"

import { useState } from "react"
import { Plus } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIngredientStore } from "@/Store/useingredientsStore"
import { unitSymbols } from "@/ingredientsmock"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  unit: z.number().min(0),
  warningLevel: z.number().min(0),
  unitSymbol: z.string().min(1),
})

export function AddIngredientDialog() {
  const [open, setOpen] = useState(false)
  const { addIngredient } = useIngredientStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      unit: 0,
      warningLevel: 0,
      unitSymbol: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addIngredient(values)
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Ingredient</DialogTitle>
          <DialogDescription>
            Add a new ingredient to the inventory.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingredient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warningLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warning Level</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitSymbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Symbol</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitSymbols.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Ingredient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

