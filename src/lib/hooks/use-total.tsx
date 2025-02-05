import React from "react";
import { CartItem } from "../store/features/cart/cartSlice";

const useTotal = (product: CartItem) => {
  const totalPrice = React.useMemo(() => {
    const toppingsTotal = product.chosenConfiguration.selectedToppings.reduce(
      (acc, curr) => acc + curr.price,
      0
    );

    const configPricing = Object.entries(
      product.chosenConfiguration.priceConfiguration
    ).reduce((acc, [key, value]) => {
      const price = product.priceConfiguration[key].availableOptions[value];
      return acc + price;
    }, 0);

    return toppingsTotal + configPricing;
  }, [product]);
  return totalPrice;
};

export default useTotal;
