import { create } from "zustand";
import { INotification, INotifiData, IOrder, WSSender } from "./types/types";
import api from "./utils/axios";
import { v4 as uuidv4 } from 'uuid';

type AppStore = {
  completeOrder: IOrder[];
  pendingOrder: IOrder[];
  processingOrder: IOrder[];
  cancleOrder: IOrder[];
  notification: INotification[];
  addOrder: (order: IOrder) => Promise<void>;
  changeOrderStateForward: (order: IOrder) => Promise<void>
  getOrderById: (id: string) => IOrder | undefined
  getOrdersByStatus: (status: string) => IOrder[]
  addNotification: (notify: INotifiData) => Promise<void>
  refreshOrder: () => Promise<void>
  changeOrderState: (id: string, state: string) => Promise<void>
  clearNotification: () => Promise<void>
  removeNotification: (id: string) => Promise<void>
};

export const useAppStore = create<AppStore>((set, get) => ({
  completeOrder: [],
  pendingOrder: [],
  processingOrder: [],
  cancleOrder: [],
  notification: [],
  addOrder: async (order: IOrder) => {
    set((state) => {
      switch (order.status) {
        case "pending":
          return { pendingOrder: [order, ...state.pendingOrder] }
        case "processing":
          return { processingOrder: [order, ...state.processingOrder] }
        case "completed":
          return { completeOrder: [order, ...state.completeOrder] }
        case "cancelled":
          return { cancleOrder: [order, ...state.cancleOrder] }
        default:
          return state
      }
    })
  },
  changeOrderStateForward: async (order: IOrder) => {
    set((state) => {
      // Arrays to search through
      const searchArrays = [
        { key: 'pendingOrder', array: state.pendingOrder },
        { key: 'processingOrder', array: state.processingOrder },
        { key: 'completeOrder', array: state.completeOrder },
        { key: 'cancleOrder', array: state.cancleOrder }
      ];

      const updatedArrays = searchArrays.reduce((acc, { key, array }) => {
        const foundOrderIndex = array.findIndex(existingOrder => existingOrder._id === order._id);

        if (foundOrderIndex !== -1) {
          const newArray = array.filter(existingOrder => existingOrder._id !== order._id);
          acc[key] = newArray;
        }

        return acc;
      }, {} as Record<string, IOrder[]>);

      switch (order.status) {
        case "pending":
          return {
            ...updatedArrays,
            pendingOrder: [order, ...(updatedArrays.pendingOrder || state.pendingOrder)]
          };
        case "processing":
          return {
            ...updatedArrays,
            processingOrder: [order, ...(updatedArrays.processingOrder || state.processingOrder)]
          };
        case "complete":
          return {
            ...updatedArrays,
            completeOrder: [order, ...(updatedArrays.completeOrder || state.completeOrder)]
          };
        case "cancle":
          return {
            ...updatedArrays,
            cancleOrder: [order, ...(updatedArrays.cancleOrder || state.cancleOrder)]
          };
        default:
          return state;
      }
    });
  },
  getOrderById: (id: string) => {
    const { pendingOrder, processingOrder, completeOrder, cancleOrder } = get();

    // Combine all order arrays and find the order with matching _id
    const allOrders = [
      ...pendingOrder,
      ...processingOrder,
      ...completeOrder,
      ...cancleOrder
    ];

    return allOrders.find(order => order._id === id);
  },

  getOrdersByStatus: (status: string) => {
    const { pendingOrder, processingOrder, completeOrder, cancleOrder } = get();

    switch (status) {
      case 'pending':
        return pendingOrder;
      case 'processing':
        return processingOrder;
      case 'complete':
        return completeOrder;
      case 'cancle':
        return cancleOrder;
      default:
        return [];
    }
  },
  addNotification: async (notify: INotifiData) => {
    if (notify.topic || notify.msg) {
      const { notification } = get();
      const isDuplicate = notification.some(
        (nt) => nt.topic === notify.topic && nt.msg === notify.msg
      );

      if (!isDuplicate) {
        const nt: INotification = {
          id: uuidv4(),
          level: notify.level,
          topic: notify.topic,
          msg: notify.msg,
        };
        set((state) => ({
          notification: [...state.notification, nt],
        }));
      } else {
        console.log("Duplicate notification ignored:", notify);
      }
    }
  },
  refreshOrder: async () => {
    const res = await api.get('/orders/todayorder')
    const orders: IOrder[] = res.data.data
    set({
      pendingOrder: orders.filter(order => order.status === "pending"),
      processingOrder: orders.filter(order => order.status === "processing"),
      completeOrder: orders.filter(order => order.status === "completed"),
      cancleOrder: orders.filter(order => order.status === "cancelled"),
    });
  },
  changeOrderState: async (id: string, state: string) => {
    try {
      // Send an API request to update the order's state
      const res = await api.put(`/orders/status/${id}`, {
        status: state,
        statusKitchen: state
      });

      // Check if the API call was successful
      if (res.status === 200) {
        console.log(`Order ${id} updated successfully to state: ${state}`);

        // Refresh the orders in the local store
        await get().refreshOrder();
      } else {
        console.error(`Failed to update order ${id}:`, res.data);
      }
    } catch (error) {
      console.error(`Error updating order ${id} state:`, error);
    }
  },
  clearNotification: async () => {
    set({ notification: [] })
  },
  removeNotification: async (id: string) => {
    set((state) => ({
      notification: state.notification.filter((notification) => notification.id !== id)
    }));
  }
}));


type WebSocketStore = {
  connectionStatus: string;
  socket: WebSocket | null;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: WSSender<object>) => void;
  lastNotification: INotifiData | null;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  connectionStatus: "disconnect",
  socket: null,
  lastNotification: null,

  connect: (url: string) => {
    // Close existing connection if any
    const existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.close();
    }

    // Create new WebSocket connection
    const socket = new WebSocket(url);

    // Connection opened
    socket.onopen = () => {
      console.log('WebSocket connection established');
      set({ connectionStatus: 'connected', socket });
      const { refreshOrder } = useAppStore.getState();
      refreshOrder().then(() => {
        console.log("orders data refreshed")
      })

    };

    // Listen for messages
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle different types of messages
        if (data.type === 'notification') {
          const { addNotification } = useAppStore.getState();
          const notification: INotifiData = data.payload;

          console.log(data.payload)
          addNotification(notification)
          // Update store with last notification
          set({ lastNotification: notification });

          // Optional: You can also use the existing addNotification method from appStore
          // import { useAppStore } from './appStore';
          // useAppStore.getState().addNotification(notification);

          // Optional: Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.topic, {
              body: notification.msg,
              // icon: notification.icon // If you have an icon
            });
          }
        } else if (data.type == 'add-order') {
          const { addOrder } = useAppStore.getState();
          addOrder(data.data)
        } else if (data.type == 'refresh-order') {
          const { refreshOrder } = useAppStore.getState();
          refreshOrder()
        } else if (data.type == 'state-order') {
          const { changeOrderStateForward } = useAppStore.getState();
          changeOrderStateForward(data.data)
        }
        // Add more message type handlers as needed
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Connection closed
    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      set({ connectionStatus: 'disconnected', socket: null });
    };

    // Connection error
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ connectionStatus: 'disconnected', socket: null });
    };
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set({ connectionStatus: 'disconnected', socket: null });
  },

  sendMessage: (message: WSSender<object>) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {

      const jsonfyMSG = JSON.stringify(message)
      socket.send(jsonfyMSG);
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  }
}));
