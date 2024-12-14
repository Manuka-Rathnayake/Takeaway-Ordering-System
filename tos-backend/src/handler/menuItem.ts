import { Request, Response } from "express";
import { Ingredient, MenuItem } from "../db/schema";
import { SortOrder, Types } from "mongoose";

export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await MenuItem.find().populate('ingredients.id');
    return res.status(200).json({ data: menuItems });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const addMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, price, des, ingredients = [] } = req.body;

    // Validate ingredients exist
    if (ingredients.length > 0) {
      const ingredientIds = ingredients.map((ing: any) => ing.id);
      const existingIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });

      if (existingIngredients.length !== ingredientIds.length) {
        return res.status(400).json({ msg: "Some ingredients do not exist" });
      }
    }

    const newMenuItem = new MenuItem({
      name,
      des: des,
      price: Types.Decimal128.fromString(price.toString()),
      ingredients: ingredients.map((ing: any) => ({
        id: new Types.ObjectId(ing.id),
        stockLevel: {
          unit: Types.Decimal128.fromString(ing.stockLevel.unit.toString()),
          unitSymbol: ing.stockLevel.unitSymbol
        }
      }))
    });

    await newMenuItem.save();

    return res.status(201).json({
      msg: `${name} Menu Item created!`,
      data: newMenuItem
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('ingredients.id');

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    return res.status(200).json({ data: menuItem });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const updateData: any = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.body.price !== undefined) {
      updateData.price = Types.Decimal128.fromString(req.body.price.toString());
    }

    if (req.body.des) {
      updateData.des = req.body.des;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    return res.status(200).json({
      msg: "Menu Item updated successfully",
      data: menuItem
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    return res.status(200).json({
      msg: "Menu Item deleted successfully",
      data: menuItem
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const addIngredientToMenuItem = async (req: Request, res: Response) => {
  try {
    const { ingredientId } = req.body;
    const menuItemId = req.params.id;

    // Check if ingredient exists
    const ingredient = await Ingredient.findById(ingredientId);
    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found" });
    }

    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    // Check if ingredient already exists in menu item
    const existingIngredient = menuItem.ingredients.find(
      ing => ing.id.toString() === ingredientId
    );

    if (existingIngredient) {
      return res.status(400).json({ msg: "Ingredient already exists in this menu item" });
    }

    // Add ingredient to menu item
    menuItem.ingredients.push({
      id: new Types.ObjectId(ingredientId),
      stockLevel: {
        unit: ingredient.stockLevel.unit,
        unitSymbol: ingredient.stockLevel.unitSymbol
      }
    });

    await menuItem.save();

    return res.status(200).json({
      msg: "Ingredient added to Menu Item successfully",
      data: menuItem
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const removeIngredientFromMenuItem = async (req: Request, res: Response) => {
  try {
    const { ingredientId } = req.body;
    const menuItemId = req.params.id;

    // Find menu item and remove the specific ingredient
    const menuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      { $pull: { ingredients: { id: ingredientId } } },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    return res.status(200).json({
      msg: "Ingredient removed from Menu Item successfully",
      data: menuItem
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

interface GetTableQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const getMenuItemsTable = async (req: Request<{}, {}, {}, GetTableQuery>, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const skip = (page as number - 1) * (limit as number);
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1 as SortOrder
    };

    const searchFilter = search
      ? {
        name: {
          $regex: search as string,
          $options: 'i'
        }
      }
      : {};

    const totalCount = await MenuItem.countDocuments(searchFilter);
    const menuItems = await MenuItem.find(searchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit as number)
      .populate('ingredients.id');

    return res.status(200).json({
      data: menuItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / (limit as number)),
        totalItems: totalCount,
        searchTerm: search || null
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
