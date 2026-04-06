import { configureStore } from "@reduxjs/toolkit";
import userslice from "./userslice";
import cartslice from "./cartslice";


export const store=configureStore({
    reducer:{
        user:userslice,
        cart:cartslice
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


