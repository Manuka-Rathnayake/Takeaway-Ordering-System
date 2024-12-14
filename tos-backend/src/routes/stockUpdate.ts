import { Router } from "express";
import { addStockUpdate, deleteStockUpdate, getAllStockUpdates, getStockUpdatesByIngredient, updateStockUpdate } from "../handler/stockUpdate";
import { validateData } from "../middleware/schemaValidation";
import { AddStockUpdateSchema, UpdateStockUpdateSchema } from "../schema/stockUpdate";

const stockUpdateRoute = Router();

stockUpdateRoute.post('/table',
  getAllStockUpdates
)

stockUpdateRoute.post('/add',
  validateData(AddStockUpdateSchema),
  addStockUpdate
)

// NOTE: this id means ingredient ID
stockUpdateRoute.get('/ingredient/:id',
  getStockUpdatesByIngredient
)

// NOTE: this id means stockUpdate ID
stockUpdateRoute.delete('/:id',
  deleteStockUpdate
)

stockUpdateRoute.put('/:id',
  validateData(UpdateStockUpdateSchema),
  updateStockUpdate
)

export default stockUpdateRoute;
