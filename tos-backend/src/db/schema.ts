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
  updatedate: Date,
  stockLevel: IUnitData,
}

const ingredientsSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  updatedate: { type: Date, required: true },
  stockLevel: {
    unit: { type: Types.Decimal128, required: true },
    warningLevel: { type: Types.Decimal128, required: true },
    unitSymbol: { type: String, required: true }
  }
},
  {
    timestamps: true
  });

export const Ingredient = model("ingredients", ingredientsSchema);


export interface IMenuIngredients {
  id: Types.ObjectId,
  name: string,
  updatedate: Date,
  stockLevel: IUnitData,
}

// Menu Item Interface and Schema
export interface IMenuItem extends Document {
  name: string,
  createdate: Date,
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
  createdate: {
    type: Date,
    required: true,
    default: Date.now
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
    name: {
      type: String,
      required: true,
      trim: true
    },
    updatedate: {
      type: Date,
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

// export interface IOrderMenuItem {
//   id: Types.ObjectId,
//   name: string,
//   price: Types.Decimal128,
// }
//
// export interface IOrder {
//   createdate: Date,
//   customerNumber: string,
//   customeName: string,
//   status: string,
//   statusKitchen: string,
//   addUser: string,
//   price: Types.Decimal128,
//   totalPrice: Types.Decimal128,
//   discount: Types.Decimal128,
//   menuItem: IOrderMenuItem[],
// }
// Order MenuItem Interface
export interface IOrderMenuItem {
  id: Types.ObjectId,
  name: string,
  price: Types.Decimal128,
}

// Order Interface and Schema
export interface IOrder extends Document {
  createdate: Date,
  customerNumber: string,
  customeName: string,
  status: string,
  statusKitchen: string,
  addUser: string,
  price: Types.Decimal128,
  totalPrice: Types.Decimal128,
  discount: Types.Decimal128,
  menuItem: IOrderMenuItem[],
}

const orderSchema = new Schema<IOrder>({
  createdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  customerNumber: {
    type: String,
    required: true,
    trim: true
  },
  customeName: {
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
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Types.Decimal128,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }]
}, {
  timestamps: true
});

export const Order = model<IOrder>("orders", orderSchema);
