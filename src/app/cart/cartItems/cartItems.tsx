"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import CartItem from "./cartItem";
import { Button } from "@/components/ui/button";
import { getProductTotal } from "@/lib/utils";

const CartItems = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ACCESS CART FROM STORE
  const cart = useAppSelector((state) => state.cart.cartItem);

  // CALCULATE CART TOTAL
  const finalTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr.qty * getProductTotal(curr);
    }, 0);
  }, [cart]);

  if (!isClient) {
    return null;
  }

  // UI FOR IF NO ITEMS IN THE CART
  if (!cart.length) {
    return (
      <div className="flex items-center gap-2">
        <ShoppingCart />
        <p className="text-gray-500">
          Your cart is empty!{" "}
          <Link className="text-orange-500" href={`/`}>
            continue shopping?
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 ">
      {cart.map((cartItem) => (
        <CartItem key={cartItem.hash} item={cartItem} />
      ))}
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl">&#8377;{finalTotal}</span>
        <Button>
          Checkout
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CartItems;
