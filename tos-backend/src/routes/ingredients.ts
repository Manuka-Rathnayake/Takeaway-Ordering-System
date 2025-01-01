import { Router } from "express";
import { addIngredient, deleteIngredient, getAllIngredient, getIngredientById, getIngredientsTable, updateIngredient } from "../handler/ingredients";
import { validateData } from "../middleware/schemaValidation";
import { AddIngredientSchema, GetTableIngredientSchema, UpdateIngredientSchema } from "../schema/ingredients";

const ingredientsRoute = Router();

ingredientsRoute.get('/all', getAllIngredient);

// add one ingredient
ingredientsRoute.post(
  '/add',
  validateData(AddIngredientSchema),
  addIngredient
);

ingredientsRoute.get('/:id', getIngredientById); // get one ingredient

ingredientsRoute.put(
  '/:id',
  validateData(UpdateIngredientSchema),
  updateIngredient
); // update one ingredient

ingredientsRoute.delete('/:id', deleteIngredient); // delete one ingredient

ingredientsRoute.get(
  'table',
  validateData(GetTableIngredientSchema),
  getIngredientsTable
);

export default ingredientsRoute;
