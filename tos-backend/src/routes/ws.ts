import { addMenuItemToOrder, removeMenuItemOrder } from "../handler/dbhandler";

export interface WSPayload {
  msgType: string;
  payload: any;
}

export const wsEventHandler = (payload: WSPayload) => {
  if (payload.msgType === "refresh_orders") {
    // get all the orders where status != "complete" => return orders[]
  } else if (payload.msgType === "add-menu-item") {
    // change the order state and
    const orderId: string = payload.payload.orderId;
    const menuItemId: string = payload.payload.menuItemId;
    const quantity: number = payload.payload.quantity;
    addMenuItemToOrder(orderId, menuItemId, quantity)
  } else if (payload.msgType === "remove-menu-item") {
    const orderId: string = payload.payload.orderId;
    const menuItemId: string = payload.payload.menuItemId;
    removeMenuItemOrder(orderId, menuItemId)
  }
}
