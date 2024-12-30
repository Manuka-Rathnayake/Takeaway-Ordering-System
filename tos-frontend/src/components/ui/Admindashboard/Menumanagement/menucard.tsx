import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useMenuStore } from "@/Store/useMenuStore";

const MenuCardWithPopup: React.FC<MenuItem> = ({ id, name, description, price, image, ingredients }) => {
  const { selectItem } = useMenuStore();

  return (
    <Card className="w-full max-w-sm bg-white shadow-md rounded-md">
      <CardHeader>
        <img src={image} alt={name} className="w-full h-40 object-cover rounded-t-md" />
      </CardHeader>
      <CardContent>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-lg font-bold text-green-600 mt-2">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectItem({ id, name, description, price, image, ingredients })}
            >
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside text-gray-700">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-blue-500">
            <FaEdit />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500">
            <FaTrash />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MenuCardWithPopup;
