import { Product, Topping } from "@/lib/types";
import { hashThePayload } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
  hash?: string;
}

export interface CartState {
  cartItem: CartItem[];
}

const initialState: CartState = {
  cartItem: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // HASH THE ACTION.PAYLOAD
      const hash = hashThePayload(action.payload);
      const newItem = {
        ...action.payload,
        hash: hash,
        // product: action.payload.product,
        // chosenConfiguration: action.payload.chosenConfiguration,
      };

      window.localStorage.setItem(
        "cartItems",
        JSON.stringify([...state.cartItem, newItem])
      );

      return {
        cartItem: [...state.cartItem, newItem],
      };
    },

    setInitialCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItem.push(...action.payload);
    },

    changeQty: (
      state,
      action: PayloadAction<{ hash: string; qty: number }>
    ) => {
      const index = state.cartItem.findIndex(
        (item) => item.hash === action.payload.hash
      );

      if (index === -1) return;

      // LOGIC TO REMOVE ITEMS FROM CART
      if (action.payload.qty === 0) {
        state.cartItem.splice(index, 1);
        window.localStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItem)
        );
        return;
      }

      state.cartItem[index].qty = Math.max(
        1,
        state.cartItem[index].qty + action.payload.qty
      );

      window.localStorage.setItem("cartItems", JSON.stringify(state.cartItem));
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, setInitialCartItems, changeQty } = cartSlice.actions;

export default cartSlice.reducer;
