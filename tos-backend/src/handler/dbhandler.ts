import { Order, IOrder } from '../db/schema'; // Adjust import path as needed

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
