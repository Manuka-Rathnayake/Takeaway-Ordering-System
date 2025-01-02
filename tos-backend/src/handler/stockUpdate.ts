import { Request, Response } from "express";
import { Ingredient, StockUpdate } from "../db/schema";
import { Types } from "mongoose";

export const getAllStockUpdates = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      productBrand,
      ingredientId
    } = req.body;

    // Build filter
    const filter: any = {};
    if (productBrand) filter.productBrand = productBrand;
    if (ingredientId) filter.ingredientId = ingredientId;

    // Build sort
    const sort: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch stock updates
    const stockUpdates = await StockUpdate.find(filter)
      .populate('ingredientId')
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    // Count total documents
    const total = await StockUpdate.countDocuments(filter);

    res.json({
      stockUpdates,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching stock updates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validateStockUpdate = async (
  ingredientId: string,
  stockedUnit: { unit: number, unitSymbol: string }
) => {
  const ingredient = await Ingredient.findById(ingredientId);

  if (!ingredient) {
    throw new Error('Ingredient not found');
  }


  if (ingredient.stockLevel.unitSymbol !== stockedUnit.unitSymbol) {
    throw new Error('Unit symbols do not match');
  }

  // const currentStock = parseFloat(ingredient.stockLevel.unit.toString());
  // const maxAllowedStock = 1000; // Example limit
  // if (currentStock + stockedUnit.unit > maxAllowedStock) {
  //   throw new Error('Stock update would exceed maximum allowed stock');
  // }

  return true;
};

export const addStockUpdate = async (req: Request, res: Response) => {
  try {
    const { ingredientId, productBrand, stockedUnit } = req.body;

    // Validate before processing
    await validateStockUpdate(ingredientId, stockedUnit);

    // Rest of the logic remains similar to the previous implementation
    const newStockUpdate = new StockUpdate({
      ingredientId,
      productBrand,
      stockedUnit
    });

    const updatedIngredient = await Ingredient.findOneAndUpdate(
      { _id: ingredientId },
      {
        $inc: {
          'stockLevel.unit': stockedUnit.unit
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    const savedStockUpdate = await newStockUpdate.save();

    res.status(201).json({
      stockUpdate: savedStockUpdate,
      updatedIngredient
    });
  } catch (error) {
    console.error('Error in addStockUpdateWithValidation:', error);

    res.status(400).json({
      message: 'Stock update failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteStockUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Stock Update ID' });
    }

    const deletedStockUpdate = await StockUpdate.findByIdAndDelete(id);

    if (!deletedStockUpdate) {
      return res.status(404).json({ message: 'Stock Update not found' });
    }

    res.json({
      message: 'Stock update deleted successfully',
      deletedStockUpdate
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting stock update',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateStockUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ingredientId, productBrand, stockedUnit } = req.body;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Stock Update ID' });
    }

    const updatedStockUpdate = await StockUpdate.findByIdAndUpdate(
      id,
      { ingredientId, productBrand, stockedUnit },
      { new: true, runValidators: true }
    );

    if (!updatedStockUpdate) {
      return res.status(404).json({ message: 'Stock Update not found' });
    }

    res.json(updatedStockUpdate);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating stock update',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getStockUpdatesByIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log(id)

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Ingredient ID' });
    }

    const stockUpdates = await StockUpdate.find({ ingredientId: id })
      .populate('ingredientId');

    res.json(stockUpdates);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching stock updates by ingredient',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
