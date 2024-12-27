import { create } from "zustand";
import { INotification, IOrder } from "./types/types";

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
  addNotification: (notify: INotification) => Promise<void>
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
        case "complete":
          return { completeOrder: [order, ...state.completeOrder] }
        case "cancle":
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
  addNotification: async (notify: INotification) => {
    set(state => ({
      notification: [...state.notification, notify]
    }))
  }
}));


type WebSocketStore = {
  connectionStatus: string;
  socket: WebSocket | null;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  lastNotification: INotification | null;
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
    };

    // Listen for messages
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle different types of messages
        if (data.type === 'notification') {
          const notification: INotification = data.payload;

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
        } else if (data.type == )
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

  sendMessage: (message: string) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  }
}));
