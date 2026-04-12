import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGrocery {
  _id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  category?: string;
  quantity: number;
}

interface Icartslice {
  cartdata: IGrocery[];
}

const saveToStorage = (cart: IGrocery[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const initialState: Icartslice = {
  cartdata: [], 
};

const cartslice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ✅ Load cart after page mounts
    setInitialCart: (state, action: PayloadAction<IGrocery[]>) => {
      state.cartdata = action.payload;
    },

    // ✅ Add to cart
    setcartdata: (state, action: PayloadAction<IGrocery>) => {
      const existingItem = state.cartdata.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartdata.push({
          ...action.payload,
          quantity: 1,
        });
      }

      saveToStorage(state.cartdata);
    },

   
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartdata.find(i => i._id === action.payload);
      if (item) item.quantity += 1;

      saveToStorage(state.cartdata);
    },

    // ✅ Decrease
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartdata.find(i => i._id === action.payload);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartdata = state.cartdata.filter(
            (i) => i._id !== action.payload
          );
        }
      }

      saveToStorage(state.cartdata);
    },

    // ✅ Remove item
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartdata = state.cartdata.filter(
        (item) => item._id !== action.payload
      );

      saveToStorage(state.cartdata);
    },

    // ✅ Clear cart
    clearCart: (state) => {
      state.cartdata = [];

      saveToStorage(state.cartdata);
    },
  },
});

export const {
  setcartdata,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
  setInitialCart,
} = cartslice.actions;

export default cartslice.reducer;