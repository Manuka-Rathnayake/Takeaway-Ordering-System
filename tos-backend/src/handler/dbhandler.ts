import { Types } from 'mongoose';
import { Order, IOrder, MenuItem, Users } from '../db/schema'; // Adjust import path as needed
import { WSclient } from '../utils/wsutil';
import { Request, Response } from 'express';

export async function getOrdersByStatus(
  status?: string,
  statusKitchen?: string
): Promise<IOrder[]> {

  // Create a filter object dynamically
  const filter: Record<string, string> = {};

  // Add status to filter if provided
  if (status) filter.status = status;

  // Add kitchen status to filter if provided
  if (statusKitchen) filter.statusKitchen = statusKitchen;

  console.log('Filter:', filter); // Debugging

  try {
    // Retrieve orders with populated menu items
    const orders = await Order.find(filter)
      .populate({
        path: 'menuItem.id',
        model: 'menuitems',
        select: 'name price des',
      })
      .populate({
        path: 'payment.user',
        model: 'users',
        select: 'username email',
      })
      .sort({ createdAt: -1 });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function addMenuItemToOrder(orderId: string, menuItemId: string, quantity: number) {
  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "ERROR",
        topic: "Error Order Not Found",
        msg: `Error adding Item to ${orderId} order`,
      });
      return;
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "ERROR",
        topic: "Error Menu Item Not Found",
        msg: `Error adding Item to ${orderId} order`,
      });
      return;
    }

    // Convert Decimal128 to number and calculate additional price
    const menuItemPrice = parseFloat(menuItem?.price.toString() ?? "0");
    const newItemPrice = menuItemPrice * quantity;

    // Check if the menu item already exists in the order
    const existingItemIndex = order.menuItem.findIndex(
      (item: any) => item.id.toString() === menuItemId
    );

    let updatedOrder;
    if (existingItemIndex > -1) {
      // Menu item already exists: update the quantity
      const existingItem = order.menuItem[existingItemIndex];
      const currentQuantity = existingItem.quantity;
      const newQuantity = quantity;

      // Calculate the price difference
      const priceDifference = (newQuantity - currentQuantity) * menuItemPrice;

      updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: { [`menuItem.${existingItemIndex}.quantity`]: newQuantity },
          $inc: {
            price: Types.Decimal128.fromString(priceDifference.toFixed(2)),
            totalPrice: priceDifference,
          },
        },
        { new: true }
      );
    } else {
      // Menu item does not exist: add it
      const orderMenuItem = {
        id: new Types.ObjectId(menuItemId),
        quantity,
      };

      updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $push: { menuItem: orderMenuItem },
          $inc: {
            price: Types.Decimal128.fromString(newItemPrice.toFixed(2)),
            totalPrice: newItemPrice,
          },
        },
        { new: true }
      );
    }

    if (updatedOrder) {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "",
        topic: "Order Updated!",
        msg: `New item added to ${orderId.slice(-4)} order`,
      });
      WSclient.broadcast(["kitchen", "admin", "cashier"], "refresh-order", {});
    } else {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "ERROR",
        topic: "Error",
        msg: `Error updating Item in ${orderId} order`,
      });
    }
  } catch (e) {
    console.error(e);
    WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
      level: "ERROR",
      topic: "Error",
      msg: `Error adding Item to ${orderId} order`,
    });
  }
}

export async function removeMenuItemOrder(orderId: string, menuItemId: string) {
  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "ERROR",
        topic: "Erorr ",
        msg: `Error removing Item from ${orderId} order [1]`
      });
      return
    }

    // Find the first occurrence of the menu item
    const menuItemIndex = order.menuItem.findIndex(
      item => item.id.toString() === menuItemId
    );

    if (menuItemIndex === -1) {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "ERROR",
        topic: "Erorr ",
        msg: `Error removing Item from ${orderId} order [2]`
      });
      return
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
        level: "ERROR",
        topic: "Erorr ",
        msg: `Error removing Item from ${orderId} order [3] `
      });
      return
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

    WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
      level: "",
      topic: "Menu Item Removed!",
      msg: `removing Item from ${orderId} order`
    });
    WSclient.broadcast(["kitchen", "admin", "cashier"], "refresh-order", {})
  } catch (e) {
    console.error(e);
    WSclient.broadcast(["kitchen", "admin", "cashier"], "notification", {
      level: "ERROR",
      topic: "Erorr ",
      msg: `Error removing Item from ${orderId} order`
    });
  }

}

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Step 1: Total Orders
    const totalOrders = await Order.countDocuments();

    // Step 2: Active Orders (orders with status "pending" or "processing")
    const activeOrders = await Order.countDocuments({
      status: { $in: ["pending", "processing"] }
    });

    // Step 3: Total Users
    const totalUsers = await Users.countDocuments();

    // Step 4: Total Revenue (sum of all `totalPrice` in completed orders)
    const revenueData = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$totalPrice" } }
        }
      }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Combine results
    const result = {
      totalOrders,
      activeOrders,
      totalUsers,
      totalRevenue
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// import { Order, IOrder } from '../db/schema'; // Adjust import path as needed
// import { Types } from 'mongoose';
//
// export async function getOrdersByStatus(
//   status?: string,
//   statusKitchen?: string
// ): Promise<IOrder[]> {
//   // Create a filter object dynamically
//   const filter: {
//     status?: string,
//     statusKitchen?: string
//   } = {};
//
//   // Add status to filter if provided
//   if (status) {
//     filter.status = status;
//   }
//
//   // Add kitchen status to filter if provided
//   if (statusKitchen) {
//     filter.statusKitchen = statusKitchen;
//   }
//
//   // Retrieve orders with populated menu items
//   const orders = await Order.find(filter)
//     .populate({
//       path: 'menuItem.id',
//       model: 'menuitems',
//       select: 'name price des'
//     })
//     .populate({
//       path: 'payment.user',
//       model: 'users',
//       select: 'username email'
//     })
//     .sort({ createdAt: -1 });
//
//   return orders;
// }
