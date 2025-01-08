import { Request, Response } from "express";
import { Ingredient } from "../../src/db/schema";
import {
    deleteIngredient,
    getIngredientById,
    updateIngredient
} from "../../src/handler/ingredients";
import { UpdateIngredientSchema } from "../../src/schema/ingredients";

jest.mock("../../src/db/schema", () => ({
  Ingredient: {
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("Ingredients Handler", () => {
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
      params: {}, // Explicitly initialize params
    };
    jest.clearAllMocks();
  });

  describe("getIngredientById", () => {
    test("should return the ingredient by ID", async () => {
      const mockIngredient = { name: "Salt" };
      (Ingredient.findById as jest.Mock).mockResolvedValue(mockIngredient);

      // Include the 'id' property in params
      mockRequest.params = { id: "123" };

      await getIngredientById(
        mockRequest as Request<{ id: string }, {}, {}>,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ data: mockIngredient });
    });

    test("should return 404 if ingredient is not found", async () => {
      (Ingredient.findById as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: "123" };

      await getIngredientById(
        mockRequest as Request<{ id: string }, {}, {}>,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Ingredient not found" });
    });
  });

  describe("updateIngredient", () => {
    test("should update the ingredient", async () => {
      const validData = {
        name: "Updated Salt",
        unitSymbol: "kilogram",
        warningLevel: 15,
      };
      const parsedData = UpdateIngredientSchema.parse(validData);

      mockRequest.params = { id: "123" };
      mockRequest.body = parsedData;

      const mockUpdatedIngredient = { ...parsedData, _id: "123" };
      (Ingredient.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedIngredient);

      await updateIngredient(
        mockRequest as Request<{ id: string }, {}, {}>,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Ingredient updated successfully",
        data: mockUpdatedIngredient,
      });
    });
  });

  describe("deleteIngredient", () => {
    test("should delete the ingredient by ID", async () => {
      const mockIngredient = { name: "Salt" };
      (Ingredient.findByIdAndDelete as jest.Mock).mockResolvedValue(mockIngredient);

      mockRequest.params = { id: "123" };

      await deleteIngredient(
        mockRequest as Request<{ id: string }, {}, {}>,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Ingredient deleted successfully",
        data: mockIngredient,
      });
    });
  });
});
