import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useIngredientStore } from '@/Store/useingredientsStore'
import { addStockUpdate } from '@/Store/userStockStore'

type Unit = 'kg' | 'g' | 'L' | 'mL' | 'pcs' | 'dozen' | 'box'

interface AddStockFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: addStockUpdate) => Promise<void>
}

const initialFormData: addStockUpdate = {
  ingredientId: '',
  brand: '',
  quantity: 0,
  unitSymbol: 'pcs' as Unit
}

export function AddStockForm({ open, onClose, onSubmit }: AddStockFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const { ingredients, fetchIngredients } = useIngredientStore();

  useEffect(() => {
    fetchIngredients()
  }, [fetchIngredients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setFormData(initialFormData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div className="grid gap-2"> */}
          {/*   <Label htmlFor="name">Product Name</Label> */}
          {/*   <Input */}
          {/*     id="name" */}
          {/*     value={formData.name} */}
          {/*     onChange={(e) => setFormData({ ...formData, name: e.target.value })} */}
          {/*     required */}
          {/*   /> */}
          {/* </div> */}
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Select
              value={formData.ingredientId}
              onValueChange={(value) => setFormData({ ...formData, ingredientId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map((ingredient) => (
                  <SelectItem key={ingredient._id} value={ingredient._id}>
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
              <Select
                value={formData.unitSymbol}
                onValueChange={(value: Unit) => setFormData({ ...formData, unitSymbol: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="mL">mL</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="dozen">dozen</SelectItem>
                  <SelectItem value="box">box</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className='bg-[#EF4444]'>Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

