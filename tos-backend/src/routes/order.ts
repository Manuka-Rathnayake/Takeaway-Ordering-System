import { Router } from "express";
import { addMenuItemToOrder, addOrder, deleteOrder, getAllOrders, getOrderById, getOrderStatusHandler, getPaidOrderHandler, getTodayOrderHandler, removeMenuItemFromOrder, updateOrder, updateOrderStatus } from "../handler/order";
import { validateData } from "../middleware/schemaValidation";
import { AddMenuItemToOrderSchema, AddOrderSchema, GetOrderByStatusSchema, RemoveMenuItemFromOrderSchema, UpdateOrderSchema, UpdateOrderStatusSchema } from "../schema/order";

const orderRoute = Router();

orderRoute.get('/todayorder', getTodayOrderHandler)
orderRoute.get('/paidorder', getPaidOrderHandler)
orderRoute.get('/all', getAllOrders) // get all orders
orderRoute.get('/:id', getOrderById) // get one order data
orderRoute.post('/add',
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
