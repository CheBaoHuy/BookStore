import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { getTotals } from "./reducer/CartReducer";

export const store = configureStore({
    reducer: {
        carts: cartReducer
    }
})
store.dispatch(getTotals())
export type RootState = ReturnType<typeof store.getState>