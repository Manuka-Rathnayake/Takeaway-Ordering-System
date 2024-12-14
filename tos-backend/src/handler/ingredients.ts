import { Request, Response } from "express";
import { Ingredient } from "../db/schema";
import { SortOrder, Types } from "mongoose";

export const getAllIngredient = async (req: Request, res: Response) => {
  try {
    const allIngredient = await Ingredient.find();

    return res.status(200).json({ data: allIngredient });
  } catch (e) {
    console.log(e)
    return res.status(500).json({ msg: "Internal Server" })
  }
}

interface AddIngredientReq {
  name: string;
  unitSymbol: string;
  warningLevel: number;
}

export const addIngredient = async (req: Request<{}, {}, AddIngredientReq>, res: Response) => {
  try {
    const newIng = new Ingredient({
      name: req.body.name,
      stockLevel: {
        unit: 0,
        warningLevel: Types.Decimal128.fromString(
          req.body.warningLevel.toString()
        ),
        unitSymbol: req.body.unitSymbol
      }
    })

    await newIng.save();

    return res.status(201).json({ msg: `${req.body.name} Ingredient created!` })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ msg: "Internal Server" })
  }
}

export const getIngredientById = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found" });
    }
    return res.status(200).json({ data: ingredient });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

interface UpdateIngredientReq {
  name?: string;
  unitSymbol?: string;
  warningLevel?: number;
  stockLevel?: number;
}

export const updateIngredient = async (req: Request<{ id: string }, {}, UpdateIngredientReq>, res: Response) => {
  try {
    const updateData: { [key: string]: any; } = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.unitSymbol) updateData['stockLevel.unitSymbol'] = req.body.unitSymbol;
    if (req.body.warningLevel !== undefined) {
      updateData['stockLevel.warningLevel'] = Types.Decimal128.fromString(
        req.body.warningLevel.toString()
      );
    }
    if (req.body.stockLevel !== undefined) {
      updateData['stockLevel.unit'] = Types.Decimal128.fromString(
        req.body.stockLevel.toString()
      );
    }

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found" });
    }

    return res.status(200).json({
      msg: "Ingredient updated successfully",
      data: ingredient
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ msg: "Ingredient not found" });
    }

    return res.status(200).json({
      msg: "Ingredient deleted successfully",
      data: ingredient
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

export const getIngredientsTable = async (req: Request<{}, {}, {}, GetTableQuery>, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1 as SortOrder
    };
    // Create a search filter if search term is provided
    const searchFilter = search
      ? {
        name: {
          $regex: search,
          $options: 'i' // case-insensitive
        }
      }
      : {};

    const totalCount = await Ingredient.countDocuments(searchFilter);
    const ingredients = await Ingredient.find(searchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      data: ingredients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        searchTerm: search || null
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
