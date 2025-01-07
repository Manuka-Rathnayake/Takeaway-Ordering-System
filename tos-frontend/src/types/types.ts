
export interface INotifiData {
  level: "NORMAL" | "ERROR" | "WARNNIG",
  topic: string,
  msg: string,
};

export interface INotification {
  id: string,
  level: "NORMAL" | "ERROR" | "WARNNIG",
  topic: string,
  msg: string,
};

export interface IWSType<T> {
  type: string,
  data: T,
}


// Base Decimal type (MongoDB `$numberDecimal`)
export type DecimalType = {
  $numberDecimal: string;
};

export interface IUnitData {
  unit: DecimalType;
  warningLevel?: DecimalType;
  unitSymbol: string
}

// Ingredient Type
export interface IIngredient {
  stockLevel: IUnitData;
  createdAt: string;
  updatedAt: string;
  name: string;
  _id: string;
  __v: number;
}

export interface IMenuItemIngredient {
  _id: string;
  stockLevel: IUnitData;
  id: IIngredient;
}

// Menu Item Type
export interface IMenuItem {
  _id: string;
  name: string;
  des: string;
  imagePath?: string;
  price: DecimalType;
  ingredients: IMenuItemIngredient[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOrderMenuItem {
  _id: string,
  id: IMenuItem;
  quantity: number;
}

// Payment Type
export interface IPayment {
  isPaid: boolean;
  user: string; // User ID
}

// Main Order Type
export interface IOrder {
  payment: IPayment;
  _id: string;
  customerNumber: string;
  customerName: string;
  status: string;
  statusKitchen: string;
  addUser: string; // User ID
  price: DecimalType;
  totalPrice: DecimalType;
  discount: DecimalType;
  menuItem: IOrderMenuItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WSSender<T> {
  msgType: string;
  payload: T;
}
