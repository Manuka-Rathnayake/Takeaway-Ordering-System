import { Request, Response } from "express";
import mongoose from "mongoose";
import { MenuItem } from "../../src/db/schema";
import {
    deleteMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem
} from "../../src/handler/menuItem";
import { UpdateMenuItemSchema } from "../../src/schema/menuItem";

jest.mock("../../src/db/schema", () => {
  const mockPopulate = jest.fn();
  const mockFind = jest.fn(() => ({ populate: mockPopulate }));
  const mockFindById = jest.fn(() => ({ populate: mockPopulate }));

  return {
    MenuItem: {
      find: mockFind,
      findById: mockFindById,
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    },
    Ingredient: {
      find: jest.fn(),
      findById: jest.fn(),
    },
  };
});

describe("MenuItem Handler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockJson,
    };
    mockRequest = {
      params: {},
      body: {},
      query: {},
    };
    jest.clearAllMocks();
  });

  describe("getAllMenuItems", () => {
    test("should fetch all menu items with populated ingredients", async () => {
      const mockMenuItems = [{ name: "Pizza" }, { name: "Burger" }];
      const mockPopulate = jest.fn().mockResolvedValue(mockMenuItems);
      (MenuItem.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      await getAllMenuItems(mockRequest as Request, mockResponse as Response);

      expect(MenuItem.find).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith("ingredients.id");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ data: mockMenuItems });
    });

    test("should handle database errors", async () => {
      const mockPopulate = jest.fn().mockRejectedValue(new Error("Database error"));
      (MenuItem.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

      await getAllMenuItems(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Internal Server Error" });
    });
  });

  // describe("addMenuItem", () => {
  //   test("should add a new menu item with valid data", async () => {
  //     const validData = {
  //       name: "Pizza",
  //       price: 10.5,
  //       ingredients: [
  //         {
  //           id: "63f9429f51e3e62b14b2e3df",
  //           stockLevel: { unit: 2, unitSymbol: "kilogram" },
  //         },
  //       ],
  //     };

  //     const parsedData = AddMenuItemSchema.parse(validData);
  //     mockRequest.body = parsedData;

  //     (Ingredient.find as jest.Mock).mockResolvedValue(parsedData.ingredients);
  //     (MenuItem.create as jest.Mock).mockResolvedValue({
  //       name: parsedData.name,
  //       des: undefined,
  //       price: mongoose.Types.Decimal128.fromString(parsedData.price.toString()),
  //       ingredients: parsedData.ingredients,
  //       _id: "mockMenuItemId",
  //     });

  //     await addMenuItem(mockRequest as Request, mockResponse as Response);

  //     expect(MenuItem.create).toHaveBeenCalledWith({
  //       name: parsedData.name,
  //       des: undefined,
  //       price: mongoose.Types.Decimal128.fromString(parsedData.price.toString()),
  //       ingredients: (parsedData.ingredients || []).map((ing) => ({
  //         id: new mongoose.Types.ObjectId(ing.id),
  //         stockLevel: ing.stockLevel,
  //       })),
  //     });
  //     expect(mockResponse.status).toHaveBeenCalledWith(201);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       msg: `${parsedData.name} Menu Item created!`,
  //       data: {
  //         name: parsedData.name,
  //         des: undefined,
  //         price: parsedData.price,
  //         ingredients: parsedData.ingredients,
  //         _id: "mockMenuItemId",
  //       },
  //     });
  //   });

  //   test("should handle missing ingredients", async () => {
  //     const invalidData = { name: "Pizza", price: 10.5 };
  //     mockRequest.body = invalidData;

  //     await addMenuItem(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(400);
  //     expect(mockJson).toHaveBeenCalledWith({ msg: "Ingredients are required" });
  //   });

  //   test("should handle database errors", async () => {
  //     const validData = {
  //       name: "Pizza",
  //       price: 10.5,
  //       ingredients: [
  //         {
  //           id: "63f9429f51e3e62b14b2e3df",
  //           stockLevel: { unit: 2, unitSymbol: "kilogram" },
  //         },
  //       ],
  //     };

  //     const parsedData = AddMenuItemSchema.parse(validData);
  //     mockRequest.body = parsedData;

  //     (Ingredient.find as jest.Mock).mockRejectedValue(new Error("Database error"));

  //     await addMenuItem(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(500);
  //     expect(mockJson).toHaveBeenCalledWith({ msg: "Internal Server Error" });
  //   });
  // });

  describe("getMenuItemById", () => {
    test("should fetch a menu item by ID with populated ingredients", async () => {
      const mockMenuItem = { name: "Pizza", _id: "mockMenuItemId" };
      const mockPopulate = jest.fn().mockResolvedValue(mockMenuItem);
      (MenuItem.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

      mockRequest.params = { id: "mockMenuItemId" };

      await getMenuItemById(mockRequest as Request, mockResponse as Response);

      expect(MenuItem.findById).toHaveBeenCalledWith("mockMenuItemId");
      expect(mockPopulate).toHaveBeenCalledWith("ingredients.id");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ data: mockMenuItem });
    });

    test("should return 404 if menu item is not found", async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      (MenuItem.findById as jest.Mock).mockReturnValue({ populate: mockPopulate });

      mockRequest.params = { id: "nonexistentId" };

      await getMenuItemById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Menu Item not found" });
    });
  });

  describe("updateMenuItem", () => {
    test("should update a menu item with valid data", async () => {
      const validData = { name: "Updated Pizza", price: 12.5 };
      const parsedData = UpdateMenuItemSchema.parse(validData);

      mockRequest.params = { id: "mockMenuItemId" };
      mockRequest.body = parsedData;

      const mockUpdatedMenuItem = {
        ...parsedData,
        price: mongoose.Types.Decimal128.fromString(validData.price.toString()),
        _id: "mockMenuItemId",
      };

      (MenuItem.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedMenuItem);

      await updateMenuItem(mockRequest as Request, mockResponse as Response);

      expect(MenuItem.findByIdAndUpdate).toHaveBeenCalledWith(
        "mockMenuItemId",
        {
          $set: {
            name: parsedData.name,
            price: mongoose.Types.Decimal128.fromString(validData.price.toString()),
          },
        },
        { new: true, runValidators: true }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Menu Item updated successfully",
        data: mockUpdatedMenuItem,
      });
    });

    test("should return 404 if menu item is not found", async () => {
      (MenuItem.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: "nonexistentId" };
      mockRequest.body = { name: "Updated Pizza" };

      await updateMenuItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Menu Item not found" });
    });
  });

  describe("deleteMenuItem", () => {
    test("should delete a menu item by ID", async () => {
      const mockMenuItem = { name: "Pizza", _id: "mockMenuItemId" };
      (MenuItem.findByIdAndDelete as jest.Mock).mockResolvedValue(mockMenuItem);

      mockRequest.params = { id: "mockMenuItemId" };

      await deleteMenuItem(mockRequest as Request, mockResponse as Response);

      expect(MenuItem.findByIdAndDelete).toHaveBeenCalledWith("mockMenuItemId");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Menu Item deleted successfully",
        data: mockMenuItem,
      });
    });

    test("should return 404 if menu item is not found", async () => {
      (MenuItem.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: "nonexistentId" };

      await deleteMenuItem(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Menu Item not found" });
    });
  });
});
