import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FoodItem, Unit } from '@/stockData'

type Unit = 'kg' | 'g' | 'L' | 'mL' | 'pcs' | 'dozen' | 'box'

interface EditStockFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<FoodItem, 'id'>) => Promise<void>
  editItem: FoodItem | null
}

export function EditStockForm({ open, onClose, onSubmit, editItem }: EditStockFormProps) {
  const [formData, setFormData] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    brand: '',
    quantity: 0,
    unit: 'pcs'
  })

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        brand: editItem.brand,
        quantity: editItem.quantity,
        unit: editItem.unit
      })
    }
  }, [editItem])

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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
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
                value={formData.unit}
                onValueChange={(value: Unit) => setFormData({ ...formData, unit: value })}
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

