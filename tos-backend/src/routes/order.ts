import { Router } from "express";
import { addMenuItemToOrder, addOrder, deleteOrder, getAllOrders, getOrderById, getOrderStatusHandler, removeMenuItemFromOrder, updateOrder, updateOrderStatus } from "../handler/order";
import { validateData } from "../middleware/schemaValidation";
import { AddMenuItemToOrderSchema, AddOrderSchema, GetOrderByStatusSchema, RemoveMenuItemFromOrderSchema, UpdateOrderSchema, UpdateOrderStatusSchema } from "../schema/order";
import { authMiddleware } from "../middleware/auth";
import { addMenuItem } from "../handler/menuItem";

const orderRoute = Router();

orderRoute.get('/all', getAllOrders) // get all orders
orderRoute.get('/:id', getOrderById) // get one order data
orderRoute.post('/add',
  authMiddleware("admin"),
  validateData(AddOrderSchema),
  addOrder
) // add one order data
orderRoute.put('/:id',
  validateData(UpdateOrderSchema),
  updateOrder
) // update order data
orderRoute.delete('/:id',
  deleteOrder
) // update order data

orderRoute.put('/status/:id',
  validateData(UpdateOrderStatusSchema),
  updateOrderStatus
) // update order status

orderRoute.put('/addItem/:id',
  validateData(AddMenuItemToOrderSchema),
  addMenuItemToOrder
)

orderRoute.put('/removeItem/:id',
  validateData(RemoveMenuItemFromOrderSchema),
  removeMenuItemFromOrder
)

orderRoute.post('/status',
  validateData(GetOrderByStatusSchema),
  getOrderStatusHandler
) // get order by status

orderRoute.get('table')
export default orderRoute;
