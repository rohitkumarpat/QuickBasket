import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGrocery {
  _id: string; // ✅ string instead of mongoose
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

const initialState: Icartslice = {
  cartdata: [],
};

const cartslice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    setcartdata: (state, action: PayloadAction<IGrocery>) => {
      const existingItem = state.cartdata.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartdata.push(action.payload);
      }
    },


    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartdata.find(
        (i) => i._id === action.payload
      );
      if (item) item.quantity += 1;
    },


    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartdata.find(
        (i) => i._id === action.payload
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartdata = state.cartdata.filter(
            (i) => i._id !== action.payload
          );
        }
      }
    },
  },
});

export const { setcartdata, increaseQuantity, decreaseQuantity } =
  cartslice.actions;

export default cartslice.reducer;