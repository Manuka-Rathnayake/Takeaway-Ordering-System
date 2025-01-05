import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMenuStore } from '@/Store/useMenuStore'
import { EditMenuItemForm } from '@/components/ui/Admindashboard/Menumanagement/edit-menu-item-form'
import { IMenuItem } from '@/types/types'
import api from '@/utils/axios'


interface MenuItemCardProps {
  item: IMenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const { deleteMenuItem } = useMenuStore();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(item._id)
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-48">
          {item.imagePath && (
            <img
              src={`${api.defaults.baseURL}${item.imagePath}`}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.des}</p>
              <p className="mt-2 font-bold text-green-600">${item.price.$numberDecimal}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEditForm(true)}
                className="text-blue-600 border-blue-600 hover:bg-blue-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="text-red-600 border-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-2 border-gray-300"
            onClick={() => setShowDetails(true)}
          >
            View more
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {item.imagePath && (
              <img
                src={typeof item.imagePath === 'string' ? `${api.defaults.baseURL}${item.imagePath}` : URL.createObjectURL(item.imagePath)}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <div>
              <h4 className="font-semibold">Description</h4>
              <p className="text-muted-foreground">{item.des}</p>
            </div>
            <div>
              <h4 className="font-semibold">Ingredients</h4>
              <ul className="list-disc list-inside">
                {item.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.stockLevel.unit.$numberDecimal} {ingredient.stockLevel.unitSymbol} {ingredient.id.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Price</h4>
              <p className="text-green-600">${item.price.$numberDecimal}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <EditMenuItemForm
            id={item._id}
            initialData={item}
            onSubmit={() => setShowEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

