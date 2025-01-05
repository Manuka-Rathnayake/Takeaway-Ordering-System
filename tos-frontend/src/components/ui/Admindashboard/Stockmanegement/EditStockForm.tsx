import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addStockUpdate, stockUpdateI } from '@/Store/userStockStore'
import { useIngredientStore } from '@/Store/useingredientsStore'

type Unit = 'kg' | 'g' | 'L' | 'mL' | 'pcs' | 'dozen' | 'box'

interface EditStockFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: addStockUpdate) => Promise<void>
  editItem: stockUpdateI | null
}

export function EditStockForm({ open, onClose, onSubmit, editItem }: EditStockFormProps) {
  const [formData, setFormData] = useState<addStockUpdate>({
    ingredientId: '',
    brand: '',
    quantity: 0,
    unitSymbol: 'pcs'
  })
  const { ingredients, fetchIngredients } = useIngredientStore();
  useEffect(() => {
    if (editItem) {
      setFormData({
        ingredientId: editItem.ingredientId._id,
        brand: editItem.productBrand,
        quantity: Number(editItem.stockedUnit.unit.$numberDecimal as string),
        unitSymbol: editItem.stockedUnit.unitSymbol
      })
    }
    fetchIngredients()
  }, [editItem, fetchIngredients])

  console.log(formData)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Stock</DialogTitle>
          <p className='text-sm text-gray-500'>*Updating these value will not change ingredients Values</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div className="grid gap-2"> */}
          {/*   <Label htmlFor="name">Product Name</Label> */}
          {/*   <Input */}
          {/*     id="name" */}
          {/*     value={formData.ingredientId} */}
          {/*     onChange={(e) => setFormData({ ...formData, ingredientId: e.target.value })} */}
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
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

