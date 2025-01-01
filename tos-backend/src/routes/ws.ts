
export interface WSPayload {
  msgType: string;
  payload: any;
}

export const wsEventHandler = (payload: WSPayload) => {
  if (payload.msgType === "refresh_orders") {
    // get all the orders where status != "complete" => return orders[]
  } else if (payload.msgType === "order_status") {
    // change the order state and
  }
}
