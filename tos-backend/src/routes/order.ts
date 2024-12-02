import { Router } from "express";

const orderRoute = Router();

orderRoute.get('/all') // get all orders
orderRoute.get('/:id') // get one order data
orderRoute.post('/add') // add one order data
orderRoute.put('/:id') // update order data
orderRoute.delete('/:id') // update order data

orderRoute.put('status/:id') // update order status

orderRoute.get('status') // get order by status

orderRoute.get('table')
export default orderRoute;
