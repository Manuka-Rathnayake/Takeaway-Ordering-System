import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MenuItem } from './OrderTypes'

interface IngredientsModalProps {
  menuItems: MenuItem[];
}

export const IngredientsModal: React.FC<IngredientsModalProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">Ingredients</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ingredients</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {menuItems.map((item) => (
            <div key={item.id} className="grid gap-2">
              <h3 className="font-bold">{item.name}</h3>
              <ul className="list-disc list-inside text-sm">
                {item.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

