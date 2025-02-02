"use client";

import { increment } from "@/lib/store/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import React from "react";

const CartCounter = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.cart.value);

  const handleIncrement = () => {
    dispatch(increment());
  };

  return (
    <>
      <div className="relative">
        {/* Cart Icon */}
        <Link href={"/cart"}>
          <ShoppingBasket size={20} className="hover:text-primary" />
        </Link>
        <span className="absolute -top-4 -right-2 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-primary font-bold text-white">
          {value}
        </span>
      </div>
      <button onClick={handleIncrement}>Increment</button>
    </>
  );
};

export default CartCounter;
