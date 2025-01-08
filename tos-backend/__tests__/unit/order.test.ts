import { Request, Response } from "express";
import { Order } from "../../src/db/schema";
import {
    deleteOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    updateOrderStatus
} from "../../src/handler/order";

jest.mock("../../src/db/schema", () => ({
  Order: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
  },
  MenuItem: {
    find: jest.fn(),
    findById: jest.fn(),
  },
  Ingredient: {
    findOneAndUpdate: jest.fn(),
  },
}));

describe("Order Handlers", () => {
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

  describe("getAllOrders", () => {
    it("should return all orders", async () => {
      const mockOrders = [{ _id: "order1", customerName: "Jane Doe" }];
      (Order.find as any).mockReturnValue({
        populate: jest.fn(() => ({
          exec: jest.fn(() => Promise.resolve(mockOrders)),
        })),
      });

      await getAllOrders(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ data: mockOrders });
    });

    it("should return 500 if an error occurs", async () => {
      (Order.find as any).mockReturnValue({
        populate: jest.fn(() => ({
          exec: jest.fn(() => Promise.reject(new Error("Database error"))),
        })),
      });

      await getAllOrders(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Internal Server Error" });
    });
  });

  describe("getOrderById", () => {
    it("should return the order by ID", async () => {
      const mockOrder = { _id: "order1", customerName: "Jane Doe" };
      (Order.findById as any).mockReturnValue({
        populate: jest.fn(() => Promise.resolve(mockOrder)),
      });

      mockRequest.params = { id: "order1" };

      await getOrderById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ data: mockOrder });
    });

    it("should return 404 if the order is not found", async () => {
      (Order.findById as any).mockReturnValue({
        populate: jest.fn(() => Promise.resolve(null)),
      });

      mockRequest.params = { id: "order1" };

      await getOrderById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Order not found" });
    });
  });

  // describe("addOrder", () => {
  //   it("should create a new order", async () => {
  //     const mockMenuItems = [{ _id: "menu1", price: 10 }];
  //     const mockOrder = { _id: "order1", customerNumber: "123", totalPrice: 20 };

  //     (MenuItem.find as any).mockResolvedValue(mockMenuItems);
  //     (Ingredient.findOneAndUpdate as any).mockResolvedValue({});
  //     (Order.create as any).mockResolvedValue(mockOrder);

  //     mockRequest.body = {
  //       customerNumber: "123",
  //       customerName: "John Doe",
  //       menuItem: [{ id: "menu1", quantity: 2 }],
  //     };

  //     await addOrder(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(201);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       msg: "Order created successfully!",
  //       data: mockOrder,
  //     });
  //   });

  //   it("should return 400 if menu items do not exist", async () => {
  //     (MenuItem.find as any).mockResolvedValue([]);

  //     mockRequest.body = {
  //       customerNumber: "123",
  //       customerName: "John Doe",
  //       menuItem: [{ id: "menu1", quantity: 2 }],
  //     };

  //     await addOrder(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(400);
  //     expect(mockJson).toHaveBeenCalledWith({ msg: "Some menu items do not exist" });
  //   });
  // });

  describe("deleteOrder", () => {
    it("should delete the order by ID", async () => {
      const mockOrder = { _id: "order1", customerName: "John Doe" };

      (Order.findByIdAndDelete as any).mockResolvedValue(mockOrder);

      mockRequest.params = { id: "order1" };

      await deleteOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Order deleted successfully",
        data: mockOrder,
      });
    });

    it("should return 404 if the order is not found", async () => {
      (Order.findByIdAndDelete as any).mockResolvedValue(null);

      mockRequest.params = { id: "order1" };

      await deleteOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Order not found" });
    });
  });

  describe("updateOrder", () => {
    it("should update the order successfully", async () => {
      const mockOrder = { _id: "order1", customerNumber: "123" };

      (Order.findByIdAndUpdate as any).mockResolvedValue(mockOrder);

      mockRequest.params = { id: "order1" };
      mockRequest.body = { customerNumber: "456" };

      await updateOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Order updated successfully",
        data: mockOrder,
      });
    });

    it("should return 404 if the order is not found", async () => {
      (Order.findByIdAndUpdate as any).mockResolvedValue(null);

      mockRequest.params = { id: "order1" };
      mockRequest.body = { customerNumber: "456" };

      await updateOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Order not found" });
    });
  });

  describe("updateOrderStatus", () => {
    it("should update the order status successfully", async () => {
      const mockOrder = { _id: "order1", status: "completed" };

      (Order.findByIdAndUpdate as any).mockResolvedValue(mockOrder);

      mockRequest.params = { id: "order1" };
      mockRequest.body = { status: "completed" };

      await updateOrderStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        msg: "Order status updated successfully",
        data: mockOrder,
      });
    });
  });

  // describe("addMenuItemToOrder", () => {
  //   it("should add a menu item to the order", async () => {
  //     const mockOrder = { _id: "order1", menuItem: [] };
  //     (Order.findById as any).mockResolvedValue(mockOrder);
  //     (MenuItem.findById as any).mockResolvedValue({ _id: "menu1", price: 10 });
  //     (Order.findByIdAndUpdate as any).mockResolvedValue({
  //       _id: "order1",
  //       menuItem: [{ id: "menu1", quantity: 1 }],
  //     });

  //     mockRequest.params = { id: "order1" };
  //     mockRequest.body = { menuItemId: "menu1", quantity: 1 };

  //     await addMenuItemToOrder(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       msg: "Menu items added to order successfully",
  //       data: {
  //         _id: "order1",
  //         menuItem: [{ id: "menu1", quantity: 1 }],
  //       },
  //     });
  //   });
  // });

  // describe("removeMenuItemFromOrder", () => {
  //   it("should remove a menu item from the order", async () => {
  //     const mockOrder = { _id: "order1", menuItem: [{ id: "menu1" }] };
  //     (Order.findById as any).mockResolvedValue(mockOrder);
  //     (Order.findByIdAndUpdate as any).mockResolvedValue({
  //       _id: "order1",
  //       menuItem: [],
  //     });

  //     mockRequest.params = { id: "order1" };
  //     mockRequest.body = { menuItemId: "menu1" };

  //     await removeMenuItemFromOrder(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       msg: "Menu item removed from order successfully",
  //       data: {
  //         _id: "order1",
  //         menuItem: [],
  //       },
  //     });
  //   });
  // });

  // describe("getOrderStatusHandler", () => {
  //   it("should return orders based on status", async () => {
  //     (Order.find as any).mockReturnValue({
  //       populate: jest.fn(() => ({
  //         exec: jest.fn(() =>
  //           Promise.resolve([{ _id: "order1", status: "pending" }])
  //         ),
  //       })),
  //     });

  //     mockRequest.body = { status: "pending" };

  //     await getOrderStatusHandler(mockRequest as Request, mockResponse as Response);

  //     expect(mockResponse.status).toHaveBeenCalledWith(200);
  //     expect(mockJson).toHaveBeenCalledWith({
  //       message: "Orders retrieved successfully",
  //       count: 1,
  //       data: [{ _id: "order1", status: "pending" }],
  //     });
  //   });
  // });
});




































// import { Request, Response } from "express";
// import { Ingredient, MenuItem, Order } from "../src/db/schema";
// import {
//     addOrder,
//     deleteOrder,
//     getAllOrders,
//     getOrderById,
// } from "../src/handler/order";

// jest.mock("../src/db/schema", () => ({
//   Order: {
//     find: jest.fn(),
//     findById: jest.fn(),
//     findByIdAndDelete: jest.fn(),
//     create: jest.fn(),
//   },
//   MenuItem: {
//     find: jest.fn(),
//   },
//   Ingredient: {
//     findOneAndUpdate: jest.fn(),
//   },
// }));

// describe("Order Handlers", () => {
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;
//   let mockJson: jest.Mock;

//   beforeEach(() => {
//     mockJson = jest.fn();
//     mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: mockJson,
//     };
//     mockRequest = {};
//     jest.clearAllMocks();
//   });

//   describe("getAllOrders", () => {
//     it("should return all orders", async () => {
//       const mockOrders = [{ _id: "1", customerName: "John Doe" }];
//       (Order.find as any).mockReturnValue({
//         populate: jest.fn(() => ({
//           exec: jest.fn(() => Promise.resolve(mockOrders)),
//         })),
//       });

//       await getAllOrders(mockRequest as Request, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockJson).toHaveBeenCalledWith({ data: mockOrders });
//     });

//     it("should return 500 if an error occurs", async () => {
//       (Order.find as any).mockReturnValue({
//         populate: jest.fn(() => ({
//           exec: jest.fn(() => Promise.reject(new Error("Database error"))),
//         })),
//       });

//       await getAllOrders(mockRequest as Request, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockJson).toHaveBeenCalledWith({ msg: "Internal Server Error" });
//     });
//   });

//   describe("getOrderById", () => {
//     it("should return the order by ID", async () => {
//       const mockOrder = { _id: "1", customerName: "Jane Doe" };
//       (Order.findById as any).mockReturnValue({
//         populate: jest.fn(() => Promise.resolve(mockOrder)),
//       });

//       mockRequest.params = { id: "1" };

//       await getOrderById(mockRequest as Request<{ id: string }>, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockJson).toHaveBeenCalledWith({ data: mockOrder });
//     });

//     it("should return 404 if the order is not found", async () => {
//       (Order.findById as any).mockReturnValue({
//         populate: jest.fn(() => Promise.resolve(null)),
//       });

//       mockRequest.params = { id: "1" };

//       await getOrderById(mockRequest as Request<{ id: string }>, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(404);
//       expect(mockJson).toHaveBeenCalledWith({ msg: "Order not found" });
//     });
//   });

//   describe("addOrder", () => {
//     it("should create a new order", async () => {
//       const mockMenuItems = [{ _id: "menu1", price: 10 }];
//       const mockOrder = { _id: "1", customerNumber: "123", totalPrice: 20 };

//       (MenuItem.find as any).mockResolvedValue(mockMenuItems);
//       (Ingredient.findOneAndUpdate as any).mockResolvedValue({});
//       (Order.create as any).mockResolvedValue(mockOrder);

//       mockRequest.body = {
//         customerNumber: "123",
//         customerName: "John Doe",
//         menuItem: [{ id: "menu1", quantity: 2 }],
//       };

//       await addOrder(mockRequest as Request, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(201);
//       expect(mockJson).toHaveBeenCalledWith({
//         msg: "Order created successfully!",
//         data: mockOrder,
//       });
//     });

//     it("should return 400 if menu items do not exist", async () => {
//       (MenuItem.find as any).mockResolvedValue([]);

//       mockRequest.body = {
//         customerNumber: "123",
//         customerName: "John Doe",
//         menuItem: [{ id: "menu1", quantity: 2 }],
//       };

//       await addOrder(mockRequest as Request, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(400);
//       expect(mockJson).toHaveBeenCalledWith({ msg: "Some menu items do not exist" });
//     });
//   });

//   describe("deleteOrder", () => {
//     it("should delete the order by ID", async () => {
//       const mockOrder = { _id: "1", customerName: "John Doe" };
//       (Order.findByIdAndDelete as any).mockResolvedValue(mockOrder);

//       mockRequest.params = { id: "1" };

//       await deleteOrder(mockRequest as Request<{ id: string }>, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockJson).toHaveBeenCalledWith({
//         msg: "Order deleted successfully",
//         data: mockOrder,
//       });
//     });

//     it("should return 404 if the order is not found", async () => {
//       (Order.findByIdAndDelete as any).mockResolvedValue(null);

//       mockRequest.params = { id: "1" };

//       await deleteOrder(mockRequest as Request<{ id: string }>, mockResponse as Response);

//       expect(mockResponse.status).toHaveBeenCalledWith(404);
//       expect(mockJson).toHaveBeenCalledWith({ msg: "Order not found" });
//     });
//   });
// });
