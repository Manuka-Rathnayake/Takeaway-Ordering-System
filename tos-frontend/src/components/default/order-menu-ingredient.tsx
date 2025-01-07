
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Trash2 } from 'lucide-react'
import { IMenuItem } from '@/types/types' // Assuming you have a types file
import { useState } from "react"

interface MenuItemIngredientsPopupProps {
  menuItem: IMenuItem
  onDeleteMenuItem: (menuItemId: string) => void
}

export function MenuItemIngredientsPopup({ menuItem, onDeleteMenuItem }: MenuItemIngredientsPopupProps) {
  const ingredients = menuItem.ingredients;
  const [isOpen, setIsOpen] = useState(false)

  const handleDeleteMenuItem = () => {
    onDeleteMenuItem(menuItem._id)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" > <Eye /> </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{menuItem.name} Ingredients</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient._id}>
                  <TableCell>{ingredient.id.name}</TableCell>
                  <TableCell>{ingredient.stockLevel.unit.$numberDecimal}</TableCell>
                  <TableCell>{ingredient.stockLevel.unitSymbol}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteMenuItem}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Menu Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

