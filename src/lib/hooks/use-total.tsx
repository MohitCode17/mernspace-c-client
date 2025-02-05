import React from "react";
import { CartItem } from "../store/features/cart/cartSlice";
import { getProductTotal } from "../utils";

const useTotal = (product: CartItem) => {
  const totalPrice = React.useMemo(() => {
    return getProductTotal(product);
  }, [product]);
  return totalPrice;
};

export default useTotal;
