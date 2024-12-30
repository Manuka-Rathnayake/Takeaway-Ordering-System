// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useMenuStore } from "@/Store/useMenuStore";

// interface Ingredient {
//   ingredientId: string;
//   unit: number;
//   unitSymbol: string;
// }

// interface MenuItemEditFormProps {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   ingredients: Ingredient[];
// }

// const MenuItemEditForm: React.FC<MenuItemEditFormProps> = ({
//   id,
//   name,
//   description,
//   price,
//   ingredients,
// }) => {
//   const { menuItems, setMenuItems } = useMenuStore();
//   const [formData, setFormData] = useState({
//     name,
//     description,
//     price,
//     ingredients,
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleIngredientChange = (
//     index: number,
//     field: keyof Ingredient,
//     value: string | number
//   ) => {
//     const updatedIngredients = formData.ingredients.map((ingredient, i) =>
//       i === index ? { ...ingredient, [field]: value } : ingredient
//     );
//     setFormData({ ...formData, ingredients: updatedIngredients });
//   };

//   const addIngredient = () => {
//     setFormData({
//       ...formData,
//       ingredients: [...formData.ingredients, { ingredientId: "", unit: 0, unitSymbol: "" }],
//     });
//   };

//   const removeIngredient = (index: number) => {
//     const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
//     setFormData({ ...formData, ingredients: updatedIngredients });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Update the menu item in the store
//     const updatedMenuItems = menuItems.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             ...formData,
//             price: parseFloat(formData.price as unknown as string),
//           }
//         : item
//     );
//     setMenuItems(updatedMenuItems);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="sm" className="text-blue-500">
//           Edit
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Menu Item</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Name"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             required
//           />
//           <Textarea
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//           />
//           <Input
//             label="Price"
//             name="price"
//             type="number"
//             step="0.01"
//             value={formData.price}
//             onChange={handleInputChange}
//             required
//           />
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
//             {formData.ingredients.map((ingredient, index) => (
//               <div key={index} className="grid grid-cols-3 gap-2 mb-2">
//                 <Input
//                   label="Ingredient ID"
//                   value={ingredient.ingredientId}
//                   onChange={(e) => handleIngredientChange(index, "ingredientId", e.target.value)}
//                   required
//                 />
//                 <Input
//                   label="Unit"
//                   type="number"
//                   step="0.01"
//                   value={ingredient.unit}
//                   onChange={(e) => handleIngredientChange(index, "unit", parseFloat(e.target.value))}
//                   required
//                 />
//                 <Input
//                   label="Unit Symbol"
//                   value={ingredient.unitSymbol}
//                   onChange={(e) => handleIngredientChange(index, "unitSymbol", e.target.value)}
//                   required
//                 />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-red-500"
//                   onClick={() => removeIngredient(index)}
//                 >
//                   Remove
//                 </Button>
//               </div>
//             ))}
//             <Button variant="outline" onClick={addIngredient}>
//               Add Ingredient
//             </Button>
//           </div>
//           <div className="flex justify-end space-x-2">
//             <Button variant="outline" onClick={() => setFormData({ name, description, price, ingredients })}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="primary">
//               Save
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default MenuItemEditForm;
