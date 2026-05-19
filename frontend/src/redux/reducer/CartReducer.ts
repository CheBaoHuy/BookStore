import { CartState, Product } from "../../models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart")
const initialState: CartState = {
    cartItems: storedCart ? JSON.parse(storedCart)
        : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
}
export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const item = state.cartItems.findIndex(item => item.id === action.payload.id);
            if (item !== -1) {
                state.cartItems[item].cartTotal += 1;
            } else {
                const tempProduct = { ...action.payload, cartTotal: 1 }
                state.cartItems.push(tempProduct)
            }
            localStorage.setItem("cart", JSON.stringify(state.cartItems))

        },
        removeFromCart: (state, action: PayloadAction<Product>) => {
            const nextCartItems = state.cartItems.filter(item => item.id !== action.payload.id)
            state.cartItems = nextCartItems
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        decreaseCart: (state, action: PayloadAction<Product>) => {
            const item = state.cartItems.findIndex(item => item.id === action.payload.id);
            if (state.cartItems[item].cartTotal > 1) {
                state.cartItems[item].cartTotal -= 1
            } else if (state.cartItems[item].cartTotal === 1) {
                const nextCartItems = state.cartItems.filter(item => item.id !== action.payload.id)
                state.cartItems = nextCartItems
            }
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        clearCart: (state) => {
            state.cartItems = []
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        getTotals: (state) => {
            const { totalQuantity, totalAmount } = state.cartItems.reduce(
                (cart, cartItem) => {
                    const { cartTotal, currentPrice } = cartItem;
                    const itemTotal = cartTotal * currentPrice;

                    cart.totalQuantity += cartTotal;
                    cart.totalAmount += itemTotal;

                    return cart;
                },
                {
                    totalQuantity: 0,
                    totalAmount: 0,
                }
            );

            state.cartTotalQuantity = totalQuantity;
            state.cartTotalAmount = totalAmount;
        },
    }
})

export const { addToCart, removeFromCart, decreaseCart, getTotals, clearCart } = cartSlice.actions
export default cartSlice.reducer