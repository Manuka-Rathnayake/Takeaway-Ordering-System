import { Document, model, Schema, Types } from "mongoose";

export interface IUsers {
  username: string;
  email: string;
  phonenumber: string;
  password: string;
  role: string;
  nic: string;
}

const userSchema = new Schema<IUsers>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  nic: { type: String, required: true },
},
  {
    timestamps: true
  }
)

export const Users = model("users", userSchema);

export interface IUnitData {
  unit: Types.Decimal128,
  warningLevel: Types.Decimal128,
  unitSymbol: string,
}

export interface IIngredient extends Document {
  name: string,
  stockLevel: IUnitData,
}

const ingredientsSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  stockLevel: {
    unit: { type: Types.Decimal128, required: true },
    warningLevel: { type: Types.Decimal128, required: true },
    unitSymbol: { type: String, required: true }
  }
},
  {
    timestamps: true,
    optimisticConcurrency: true
  });

export const Ingredient = model("ingredients", ingredientsSchema);

export interface IUnitDataMenu {
  unit: Types.Decimal128,
  unitSymbol: string,
}

export interface IMenuIngredients {
  id: Types.ObjectId,
  stockLevel: IUnitDataMenu,
}

// Menu Item Interface and Schema
export interface IMenuItem extends Document {
  name: string,
  des: string,
  price: Types.Decimal128,
  ingredients: IMenuIngredients[],
}

const menuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  des: {
    type: String,
  },
  price: {
    type: Types.Decimal128,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  ingredients: [{
    id: {
      type: Types.ObjectId,
      ref: 'ingredients',
      required: true
    },
    stockLevel: {
      unit: {
        type: Types.Decimal128,
        required: true
      },
      unitSymbol: {
        type: String,
        required: true,
        trim: true
      }
    }
  }]
}, {
  timestamps: true
});

export const MenuItem = model<IMenuItem>("menuitems", menuItemSchema);

export interface IOrderMenuItem {
  id: Types.ObjectId,
  quantity: number
}

export interface IPayment {
  isPaid: boolean,
  paymentMethod: string,
  time: Date
  user: Types.ObjectId
}

// Order Interface and Schema
export interface IOrder extends Document {
  customerNumber: string,
  customerName: string,
  status: string,
  statusKitchen: string,
  addUser: string,
  price: Types.Decimal128,
  totalPrice: Types.Decimal128,
  discount: Types.Decimal128,
  menuItem: IOrderMenuItem[],
  payment: IPayment
}

const orderSchema = new Schema<IOrder>({
  customerNumber: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  statusKitchen: {
    type: String,
    required: true,
    enum: ['queued', 'preparing', 'ready', 'served'],
    default: 'queued'
  },
  addUser: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Types.Decimal128,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  totalPrice: {
    type: Types.Decimal128,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  discount: {
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
    min: [0, 'Discount cannot be negative']
  },
  menuItem: [{
    id: {
      type: Types.ObjectId,
      ref: 'menuitems',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'quantity can not be zero'],
      default: 1
    }
  }],
  payment: {
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String
    },
    time: {
      type: Date
    },
    user: {
      type: Types.ObjectId,
      ref: 'users'
    }
  }

}, {
  timestamps: true
});

export const Order = model<IOrder>("orders", orderSchema);


export interface IstockUpdate extends Document {
  ingredientId: Types.ObjectId,
  productBrand: string,
  stockedUnit: IUnitDataMenu
}

const stockUpdateSchema = new Schema<IstockUpdate>({
  ingredientId: {
    type: Schema.Types.ObjectId,
    ref: 'ingredients',
    required: true
  },
  productBrand: {
    type: String,
    required: true,
    trim: true
  },
  stockedUnit: {
    unit: {
      type: Types.Decimal128,
      required: true
    },
    unitSymbol: {
      type: String,
      required: true,
      trim: true
    }
  }
}, {
  timestamps: true
});

export const StockUpdate = model<IstockUpdate>("stockupdates", stockUpdateSchema);
