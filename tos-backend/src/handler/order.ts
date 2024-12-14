import { Request, Response } from "express";
import { Order, MenuItem, Ingredient } from "../db/schema";
import { startSession, Types } from "mongoose";
import { getOrdersByStatus } from "./dbhandler";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('menuItem.id');
    return res.status(200).json({ data: orders });
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
  status: string;
  search?: string;
}

export const getOrdersTable = async (req: Request<{}, {}, {}, GetTableQuery>, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      search
    } = req.query;

    const skip = (page as number - 1) * (limit as number);
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy as string]: sortOrder === 'asc' ? 1 : -1
    };
    const searchFilter: any = {};

    if (status) {
      searchFilter.status = status;
    }

    if (search) {
      searchFilter.$or = [
        { customerNumber: { $regex: search as string, $options: 'i' } },
        { customeName: { $regex: search as string, $options: 'i' } }
      ];
    }

    const totalCount = await Order.countDocuments(searchFilter);
    const orders = await Order.find(searchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit as number)
      .populate('menuItem.id');

    return res.status(200).json({
      data: orders,
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

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('menuItem.id');

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({ data: order });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const addOrder = async (req: Request, res: Response) => {
  const session = null; // Remove session entirely

  try {
    const {
      customerNumber,
      customerName,
      status = "pending",
      statusKitchen = "queued",
      discount = 0,
      menuItem,
      isPaid,
      paymentMethod,
      time,
    } = req.body;

    let user: string = req.user.id as string;

    // Validate menu items exist and get full menu item details
    const menuItemIds = menuItem.map((item: any) => item.id);
    const existingMenuItems = await MenuItem.find({ _id: { $in: menuItemIds } }).populate('ingredients.id');

    if (existingMenuItems.length !== menuItemIds.length) {
      return res.status(400).json({ msg: "Some menu items do not exist" });
    }

    let calculatedTotalPrice = 0;
    for (const item of menuItem) {
      const menuItemDetail = existingMenuItems.find(
        (menuItem) => menuItem.id.toString() === item.id
      );

      if (!menuItemDetail) {
        return res.status(400).json({ msg: `Menu item with ID ${item.id} not found` });
      }

      // Add null checks and type conversion
      const itemPrice = menuItemDetail.price
        ? parseFloat(menuItemDetail.price.toString() || '0')
        : 0;
      const itemQuantity = item.quntity ? parseFloat(item.quntity.toString()) : 0;

      // Validate price and quantity
      if (isNaN(itemPrice) || isNaN(itemQuantity)) {
        return res.status(400).json({
          msg: `Invalid price or quantity for menu item ${item.id}`,
          details: { price: menuItemDetail.price, quantity: item.quntity }
        });
      }

      calculatedTotalPrice += itemPrice * itemQuantity;
    }

    const discountedPrice = calculatedTotalPrice - discount;

    // Atomic stock reduction using $inc operator
    const stockUpdateOperations = [];

    // Validate and prepare stock updates
    for (const menuItemDetail of existingMenuItems) {
      for (const menuIngredient of menuItemDetail.ingredients) {
        const requiredStock = parseFloat(menuIngredient.stockLevel.unit.toString());

        // Atomic update with validation
        const stockUpdateOperation = Ingredient.findOneAndUpdate(
          {
            _id: menuIngredient.id,
            'stockLevel.unit': { $gte: Types.Decimal128.fromString(requiredStock.toString()) }
          },
          {
            $inc: {
              'stockLevel.unit': -requiredStock
            }
          },
          {
            new: true,
            runValidators: true
          }
        );

        stockUpdateOperations.push(stockUpdateOperation);
      }
      break; // Process only the first menu item's ingredients
    }

    // Execute all stock updates
    const updatedIngredients = await Promise.all(stockUpdateOperations);

    // Check if all stock updates were successful
    const failedUpdates = updatedIngredients.filter(update => !update);
    if (failedUpdates.length > 0) {
      return res.status(400).json({
        msg: "Insufficient or concurrent modification of ingredient stock"
      });
    }

    // Create the order
    const newOrder = new Order({
      customerNumber,
      customerName,
      status,
      statusKitchen: statusKitchen,
      addUser: user,
      price: Types.Decimal128.fromString(calculatedTotalPrice.toString()),
      totalPrice: Types.Decimal128.fromString(discountedPrice.toString()),
      discount: Types.Decimal128.fromString(discount.toString()),
      menuItem: menuItem.map((item: any) => ({
        id: new Types.ObjectId(item.id),
        quntity: item.quntity
      })),
      payment: {
        isPaid: isPaid,
        paymentMethod: paymentMethod,
        time: time,
        user: new Types.ObjectId(isPaid ? user : undefined)
      }
    });

    // Save the order
    const createOrder = await newOrder.save();
    console.log(createOrder)

    return res.status(201).json({
      msg: "Order created successfully!",
      data: newOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}


export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updateData: any = {};

    if (req.body.customerNumber) {
      updateData.customerNumber = req.body.customerNumber;
    }

    if (req.body.customeName) {
      updateData.customeName = req.body.customeName;
    }

    if (req.body.status) {
      updateData.status = req.body.status;
    }

    if (req.body.statusKitchen) {
      updateData.statusKitchen = req.body.statusKitchen;
    }

    if (req.body.price !== undefined) {
      updateData.price = Types.Decimal128.fromString(req.body.price.toString());
    }

    if (req.body.totalPrice !== undefined) {
      updateData.totalPrice = Types.Decimal128.fromString(req.body.totalPrice.toString());
    }

    if (req.body.discount !== undefined) {
      updateData.discount = Types.Decimal128.fromString(req.body.discount.toString());
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({
      msg: "Order updated successfully",
      data: order
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updateData: any = {};

    if (req.body.status) {
      updateData.status = req.body.status;
    }

    if (req.body.statusKitchen) {
      updateData.statusKitchen = req.body.statusKitchen;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({
      msg: "Order status updated successfully",
      data: order
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    return res.status(200).json({
      msg: "Order deleted successfully",
      data: order
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const addMenuItemToOrder = async (req: Request, res: Response) => {
  try {
    const { menuItemId, quantity } = req.body;
    const orderId = req.params.id;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    // Convert Decimal128 to number and calculate additional price
    const menuItemPrice = parseFloat(menuItem.price.toString());
    const additionalPrice = (menuItemPrice * quantity) + parseFloat(order.price.toString());
    const orderTotalPrice = additionalPrice - parseFloat(order.discount.toString());

    // Prepare menu item to add to order
    const orderMenuItem = {
      id: new Types.ObjectId(menuItemId),
      quantity: quantity,
    };

    // Add menu items based on quantity
    const menuItemsToAdd = Array(quantity).fill(orderMenuItem);

    // Convert additional price back to Decimal128
    const additionalPriceDecimal = Types.Decimal128.fromString(additionalPrice.toFixed(2));

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $push: { menuItem: { $each: menuItemsToAdd } },
        $inc: {
          totalPrice: orderTotalPrice,
          price: additionalPriceDecimal
        }
      },
      { new: true }
    );

    return res.status(200).json({
      msg: "Menu items added to order successfully",
      data: updatedOrder
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const removeMenuItemFromOrder = async (req: Request, res: Response) => {
  try {
    const { menuItemId } = req.body;
    const orderId = req.params.id;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Find the first occurrence of the menu item
    const menuItemIndex = order.menuItem.findIndex(
      item => item.id.toString() === menuItemId
    );

    if (menuItemIndex === -1) {
      return res.status(404).json({ msg: "Menu Item not found in order" });
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu Item not found" });
    }

    // Get the price of the menu item to remove
    const priceToSubtract = parseFloat(menuItem.price.toString());

    // Remove the first occurrence of the menu item
    order.menuItem.splice(menuItemIndex, 1);

    // Update total price
    const updatedTotalPrice = parseFloat(order.totalPrice.toString()) - priceToSubtract;
    order.totalPrice = Types.Decimal128.fromString(updatedTotalPrice.toFixed(2));
    order.price = order.totalPrice;

    // Save the updated order
    await order.save();

    return res.status(200).json({
      msg: "Menu item removed from order successfully",
      data: order
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

interface IgetOrderStatus {
  status?: string;
  statusKitchen?: string;
}

export const getOrderStatusHandler = async (req: Request<{}, {}, IgetOrderStatus>, res: Response) => {
  try {
    const { status, statusKitchen } = req.body;

    // Ensure status and statusKitchen are strings
    const statusStr = status ? String(status) : undefined;
    const statusKitchenStr = statusKitchen ? String(statusKitchen) : undefined;

    const orders = await getOrdersByStatus(statusStr, statusKitchenStr);

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found',
        data: []
      });
    }

    return res.status(200).json({
      message: 'Orders retrieved successfully',
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
