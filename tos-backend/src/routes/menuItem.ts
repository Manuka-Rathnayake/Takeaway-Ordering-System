import { Router } from "express";
import { addIngredientToMenuItem, addMenuItem, deleteMenuItem, getAllMenuItems, getMenuItemById, getMenuItemsTable, removeIngredientFromMenuItem, updateMenuItem } from "../handler/menuItem";
import { validateData } from "../middleware/schemaValidation";
import { AddIngredientToMenuItemSchema, AddMenuItemSchema, GetTableMenuItemSchema, RemoveIngredientFromMenuItemSchema, UpdateMenuItemSchema } from "../schema/menuItem";

const menuItemRoute = Router();

menuItemRoute.get('/all', getAllMenuItems);
menuItemRoute.get('/:id', getMenuItemById);
menuItemRoute.post('/add',
  validateData(AddMenuItemSchema),
  addMenuItem
);
menuItemRoute.put('/:id',
  validateData(UpdateMenuItemSchema),
  updateMenuItem
);
menuItemRoute.delete('/:id', deleteMenuItem);
// add ingredient to menu
menuItemRoute.put('/addItem/:id',
  validateData(AddIngredientToMenuItemSchema),
  addIngredientToMenuItem
);
menuItemRoute.put('/removeItem/:id',
  validateData(RemoveIngredientFromMenuItemSchema),
  removeIngredientFromMenuItem
); // delete ingredient from menu

menuItemRoute.get('table',
  validateData(GetTableMenuItemSchema),
  getMenuItemsTable
);

export default menuItemRoute;
