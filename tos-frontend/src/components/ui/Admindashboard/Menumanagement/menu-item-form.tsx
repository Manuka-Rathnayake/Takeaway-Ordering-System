import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMenuStore } from '@/Store/useMenuStore'
import { X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIngredientStore } from '@/Store/useingredientsStore'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  image: z.instanceof(File).optional(),
})

interface MenuItemIngredient {
  id: string
  stockLevel: {
    unit: number
    unitSymbol: string
  }
}

interface MenuItemFormProps {
  initialData?: {
    id: string
    name: string
    description?: string
    price: number
    image: string | File
    ingredients: MenuItemIngredient[]
  }
  onSubmit?: () => void
}

const unitSymbols = ['g', 'kg', 'ml', 'l', 'pcs', 'oz', 'lb', 'cup', 'tbsp', 'tsp']

export function MenuItemForm({ initialData, onSubmit }: MenuItemFormProps) {
  const [ingredientsdata, setIngredients] = useState<MenuItemIngredient[]>(
    initialData?.ingredients || []
  )
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image ? (typeof initialData.image === 'string' ? initialData.image : URL.createObjectURL(initialData.image)) : null)
  const addMenuItem = useMenuStore((state) => state.addMenuItem)
  const updateMenuItem = useMenuStore((state) => state.updateMenuItem)

  const { ingredients, fetchIngredients } = useIngredientStore();

  useEffect(() => {
    fetchIngredients()
  }, [fetchIngredients])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
    } : {
      name: '',
      description: '',
      price: 0,
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('des', values.description || '')
    formData.append('price', values.price.toString())
    if (values.image) {
      formData.append('image', values.image)
    }
    formData.append('ingredients', JSON.stringify(ingredientsdata))

    if (initialData) {
      await updateMenuItem(initialData.id, formData)
    } else {
      await addMenuItem(formData)
    }
    onSubmit?.()
  }

  const addIngredient = () => {
    setIngredients([
      ...ingredientsdata,
      { id: '', stockLevel: { unit: 0, unitSymbol: '' } },
    ])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredientsdata.filter((_, i) => i !== index))
  }

  // const updateIngredient = (index: number, field: keyof MenuItemIngredient, value: string | number) => {
  //   const updated = [...ingredients]
  //   updated[index] = { ...updated[index], [field]: value }
  //   setIngredients(updated)
  // }
  const updateIngredient = (
    index: number,
    field: keyof MenuItemIngredient | 'stockLevel.unit' | 'stockLevel.unitSymbol',
    value: string | number
  ) => {
    const updated = [...ingredientsdata];
    if (field.startsWith('stockLevel.')) {
      const nestedField = field.split('.')[1]; // Get 'unit' or 'unitSymbol'
      updated[index] = {
        ...updated[index],
        stockLevel: {
          ...updated[index].stockLevel,
          [nestedField]: value,
        },
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setIngredients(updated);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="transition-all duration-200 ease-in-out focus:border-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="transition-all duration-200 ease-in-out focus:border-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="transition-all duration-200 ease-in-out focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="transition-all duration-200 ease-in-out focus:border-primary"
                  />
                </FormControl>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 max-w-xs h-auto" />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Ingredients</h3>
              <Button type="button" onClick={addIngredient} className='bg-[#EF4444] text-white'>
                Add Ingredient
              </Button>
            </div>

            {ingredientsdata.map((ingredient, index) => (
              <div key={index} className="flex gap-4 items-start">
                {/* <Input */}
                {/*   placeholder="Ingredient Name" */}
                {/*   value={ingredient.id} */}
                {/*   onChange={(e) => */}
                {/*     updateIngredient(index, 'id', e.target.value) */}
                {/*   } */}
                {/*   className="transition-all duration-200 ease-in-out focus:border-primary" */}
                {/* /> */}

                <Select
                  value={ingredient.id}
                  onValueChange={(value) => updateIngredient(index, 'id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredients.map((ingredient) => (
                      <SelectItem key={ingredient._id} value={ingredient._id}>
                        {ingredient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Unit"
                  value={ingredient.stockLevel.unit}
                  onChange={(e) =>
                    updateIngredient(index, 'stockLevel.unit', parseFloat(e.target.value))
                  }
                  className="transition-all duration-200 ease-in-out focus:border-primary"
                />
                <Select
                  value={ingredient.stockLevel.unitSymbol}
                  onValueChange={(value) => updateIngredient(index, 'stockLevel.unitSymbol', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Unit Symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitSymbols.map((symbol) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" className='bg-[#EF4444] text-white'>
            {initialData ? 'Update Menu Item' : 'Add Menu Item'}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  )
}

