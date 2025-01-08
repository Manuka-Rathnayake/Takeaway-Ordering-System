import { Request, Response } from "express";
import { Ingredient, StockUpdate } from "../../src/db/schema";
import {
    addStockUpdate,
    deleteStockUpdate,
    getStockUpdatesByIngredient,
    updateStockUpdate,
    validateStockUpdate
} from "../../src/handler/stockUpdate";

jest.mock("../../src/db/schema", () => ({
  StockUpdate: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
  },
  Ingredient: {
    findById: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));


describe("Stock Update Handlers", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockJson,
    };
    mockRequest = {};
    jest.clearAllMocks();
  });

  // describe("getAllStockUpdates", () => {
  //   it("should return all stock updates with pagination", async () => {
  //     const mockStockUpdates = [{ _id: "stock1", productBrand: "BrandA" }];
  //     (StockUpdate.find as any).mockReturnValue({
  //       populate: jest.fn(() => ({
  //         sort: jest.fn(() => ({
  //           skip: jest.fn(() => ({
  //             limit: jest.fn(() => Promise.resolve(mockStockUpdates)),
  //           })),
  //         })),
  //       })),
  //     });
  //     (StockUpdate.countDocuments as any).mockResolvedValue(1);

  //     mockRequest.body = { page: 1, limit: 10 };

  //     await getAllStockUpdates(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).not.toHaveBeenCalledWith(500);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       stockUpdates: mockStockUpdates,
  //       pagination: {
  //         currentPage: 1,
  //         totalPages: 1,
  //         totalItems: 1,
  //       },
  //     });
  //   });

  //   it("should return 500 if an error occurs", async () => {
  //     (StockUpdate.find as any).mockReturnValue({
  //       populate: jest.fn(() => ({
  //         sort: jest.fn(() => ({
  //           skip: jest.fn(() => ({
  //             limit: jest.fn(() => Promise.reject(new Error("Database error"))),
  //           })),
  //         })),
  //       })),
  //     });

  //     mockRequest.body = { page: 1, limit: 10 };

  //     await getAllStockUpdates(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(500);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: "Error fetching stock updates",
  //       error: "Database error",
  //     });
  //   });
  // });

  describe("validateStockUpdate", () => {
    it("should validate stock update successfully", async () => {
      (Ingredient.findById as any).mockResolvedValue({
        stockLevel: { unitSymbol: "kg" },
      });

      const result = await validateStockUpdate("ingredient1", {
        unit: 10,
        unitSymbol: "kg",
      });

      expect(result).toBe(true);
    });

    it("should throw an error if ingredient is not found", async () => {
      (Ingredient.findById as any).mockResolvedValue(null);

      await expect(
        validateStockUpdate("ingredient1", { unit: 10, unitSymbol: "kg" })
      ).rejects.toThrow("Ingredient not found");
    });

    it("should throw an error if unit symbols do not match", async () => {
      (Ingredient.findById as any).mockResolvedValue({
        stockLevel: { unitSymbol: "g" },
      });

      await expect(
        validateStockUpdate("ingredient1", { unit: 10, unitSymbol: "kg" })
      ).rejects.toThrow("Unit symbols do not match");
    });
  });

  describe("addStockUpdate", () => {
    // it("should add a stock update successfully", async () => {
    //   (Ingredient.findById as any).mockResolvedValue({
    //     stockLevel: { unitSymbol: "kg" },
    //   });
    //   (Ingredient.findOneAndUpdate as any).mockResolvedValue({
    //     _id: "ingredient1",
    //     stockLevel: { unit: 20, unitSymbol: "kg" },
    //   });
    //   (StockUpdate.create as any).mockResolvedValue({
    //     _id: "stock1",
    //     ingredientId: "ingredient1",
    //     productBrand: "BrandA",
    //     stockedUnit: { unit: 10, unitSymbol: "kg" },
    //   });

    //   mockRequest.body = {
    //     ingredientId: "ingredient1",
    //     productBrand: "BrandA",
    //     stockedUnit: { unit: 10, unitSymbol: "kg" },
    //   };

    //   await addStockUpdate(mockRequest as Request, mockResponse as Response);

    //   expect(mockResponse.status).toHaveBeenCalledWith(201);
    //   expect(mockJson).toHaveBeenCalledWith({
    //     stockUpdate: {
    //       _id: "stock1",
    //       ingredientId: "ingredient1",
    //       productBrand: "BrandA",
    //       stockedUnit: { unit: 10, unitSymbol: "kg" },
    //     },
    //     updatedIngredient: {
    //       _id: "ingredient1",
    //       stockLevel: { unit: 20, unitSymbol: "kg" },
    //     },
    //   });
    // });



    it("should return 400 if validation fails", async () => {
      (Ingredient.findById as any).mockResolvedValue(null);

      mockRequest.body = {
        ingredientId: "ingredient1",
        productBrand: "BrandA",
        stockedUnit: { unit: 10, unitSymbol: "kg" },
      };

      await addStockUpdate(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Stock update failed",
        error: "Ingredient not found",
      });
    });
  });

  describe("deleteStockUpdate", () => {
    it("should delete a stock update successfully", async () => {
      (StockUpdate.findByIdAndDelete as any).mockResolvedValue({
        _id: "stock1",
        productBrand: "BrandA",
      });

      mockRequest.params = { id: "64b8ef4f6a8eeb1234567890" }; // Valid ObjectId

      await deleteStockUpdate(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).not.toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Stock update deleted successfully",
        deletedStockUpdate: { _id: "stock1", productBrand: "BrandA" },
      });
    });

    it("should return 404 if stock update is not found", async () => {
      (StockUpdate.findByIdAndDelete as any).mockResolvedValue(null);

      mockRequest.params = { id: "64b8ef4f6a8eeb1234567890" };

      await deleteStockUpdate(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Stock Update not found",
      });
    });
  });

  describe("updateStockUpdate", () => {
    it("should update a stock update successfully", async () => {
      (StockUpdate.findByIdAndUpdate as any).mockResolvedValue({
        _id: "stock1",
        productBrand: "BrandB",
        stockedUnit: { unit: 15, unitSymbol: "kg" },
      });

      mockRequest.params = { id: "64b8ef4f6a8eeb1234567890" };
      mockRequest.body = {
        productBrand: "BrandB",
        stockedUnit: { unit: 15, unitSymbol: "kg" },
      };

      await updateStockUpdate(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).not.toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        _id: "stock1",
        productBrand: "BrandB",
        stockedUnit: { unit: 15, unitSymbol: "kg" },
      });
    });

    it("should return 404 if stock update is not found", async () => {
      (StockUpdate.findByIdAndUpdate as any).mockResolvedValue(null);

      mockRequest.params = { id: "64b8ef4f6a8eeb1234567890" };
      mockRequest.body = {
        productBrand: "BrandB",
        stockedUnit: { unit: 15, unitSymbol: "kg" },
      };

      await updateStockUpdate(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Stock Update not found",
      });
    });
  });

  describe("getStockUpdatesByIngredient", () => {
    it("should return stock updates for a specific ingredient", async () => {
      const mockStockUpdates = [
        { _id: "stock1", ingredientId: "ingredient1" },
      ];

      (StockUpdate.find as any).mockReturnValue({
        populate: jest.fn(() => Promise.resolve(mockStockUpdates)),
      });

      mockRequest.params = { id: "64b8ef4f6a8eeb1234567890" }; // Valid ObjectId

      await getStockUpdatesByIngredient(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).not.toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(mockStockUpdates);
    });

    it("should return 400 if ingredient ID is invalid", async () => {
      mockRequest.params = { id: "invalidId" };

      await getStockUpdatesByIngredient(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Invalid Ingredient ID",
      });
    });
  });
});
