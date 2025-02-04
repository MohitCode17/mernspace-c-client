/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import ToppingList from "./topping-list";
import { CircleCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, Topping } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart, CartItem } from "@/lib/store/features/cart/cartSlice";
import { hashThePayload } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const SucessToast = () => {
  return (
    <>
      <div className="flex items-center gap-2">
        <CircleCheck className="text-green-700" />
        <span className="font-bold">Added to cart</span>
      </div>
    </>
  );
};

type ChosenConfig = {
  [key: string]: string;
};

const ProductModal = ({ product }: { product: Product }) => {
  // DEFAULT CONFIFURATION
  const defaultConfiguration = Object.entries(
    product.category.priceConfiguration
  )
    .map(([key, value]) => {
      return { [key]: value.availableOptions[0] };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const [chosenConfig, setChosenConfig] = useState<ChosenConfig>(
    defaultConfiguration as unknown as ChosenConfig
  );
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.cartItem);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // HANDLE THE RADIO BUTTON
  const handleRadioChange = (key: string, data: string) => {
    setChosenConfig((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  // HANDLE TOPPING CHECKBOX
  const handleToppingCheckbox = (topping: Topping) => {
    // Check if topping already exist in selectedToppings list
    const isAlreadyExists = selectedToppings.some(
      (elem) => elem.id === topping.id
    );

    if (isAlreadyExists) {
      // Remove from list
      setSelectedToppings((prev) =>
        prev.filter((elem) => elem.id !== topping.id)
      );

      return;
    }

    // Add toppings to list
    setSelectedToppings((prev) => [...prev, topping]);
  };

  // CHECK IF ANY PRODUCT COMBINATION ADDED TO CART
  const alreadyHasInCart = useMemo(() => {
    // CURRENT CONFIG COMBINATION THAT WE WANT TO CHECK
    const currentConfiguration = {
      _id: product._id,
      name: product.name,
      image: product.image,
      priceConfiguration: product.priceConfiguration,
      chosenConfiguration: {
        priceConfiguration: { ...chosenConfig },
        selectedToppings: selectedToppings,
      },
      qty: 1,
    };

    // HASH THE CURRENT CONFIG
    const hash = hashThePayload(currentConfiguration);

    return cartItems.some((item) => item.hash === hash);
  }, [cartItems, product, chosenConfig, selectedToppings]);

  // HANDLE ADD TO CART FUNCTIONALITY
  const handleAddToCart = (product: Product) => {
    const itemToAdd: CartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      priceConfiguration: product.priceConfiguration,
      chosenConfiguration: {
        priceConfiguration: chosenConfig!,
        selectedToppings: selectedToppings,
      },
      qty: 1,
    };
    dispatch(addToCart(itemToAdd));
    setSelectedToppings([]);
    setDialogOpen(false);
    toast({
      // @ts-expect-error
      title: <SucessToast />,
    });
  };

  // COMPUTE TOTAL PRICE OF PRODUCT
  const totalPrice = useMemo(() => {
    const toppingsTotal = selectedToppings.reduce(
      (acc, curr) => acc + curr.price,
      0
    );

    const configPricing = Object.entries(chosenConfig).reduce(
      (acc, [key, value]: [string, string]) => {
        const price = product.priceConfiguration[key].availableOptions[value];
        return acc + price;
      },
      0
    );

    return toppingsTotal + configPricing;
  }, [selectedToppings, chosenConfig, product]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="bg-orange-200 hover:bg-orange-300 text-orange-500 px-4 py-1.5 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150">
        Choose
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <DialogTitle className="sr-only">Customize {product.name}</DialogTitle>
        <div className="flex">
          <div className="w-1/3 bg-white rounded p-8 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              width={450}
              height={450}
            />
          </div>
          <div className="w-2/3 p-8">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="mt-1">{product.description}</p>

            {Object.entries(product.category.priceConfiguration).map(
              ([key, value]) => (
                <div key={key}>
                  <h4 className="mt-6">Choose the {key}</h4>
                  <RadioGroup
                    defaultValue={value.availableOptions[0]}
                    onValueChange={(data) => {
                      handleRadioChange(key, data);
                    }}
                    className="grid grid-cols-3 gap-4 mt-2"
                  >
                    {value.availableOptions.map((option) => (
                      <div key={option}>
                        <RadioGroupItem
                          value={option}
                          id={option}
                          className="peer sr-only"
                          aria-label={option}
                        />
                        <Label
                          htmlFor={option}
                          className="flex flex-col items-center justify-between rounded-md border-2 bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )
            )}

            {/* Toppings */}
            {/* TODO: RENDER TOPPINGLIST DYNAMIC IF CATEGORY HAS TOPPINGS
             * ADD FLAG TO BACKEND IN CATEGORY DOCUMENT *HASTOPPINGS MAKE IT TRUE AND FALSE
             * NOW DISPLAY TOPPINGS LIST ACCORDING TO CATEGORY HASTOPPINGS OR NOT
             *
             * FOR NOW I HAVE TWO CATEGORY IN BACKEND PIZZA AND BEVERAGES
             * SINCE BEVERAGES HAS NO TOPPINGS, I DISPLAY TOPPINGS FOR PIZZA CATEGORY
             */}
            {product.category.name === "Pizza" && (
              <ToppingList
                selectedToppings={selectedToppings}
                handleToppingCheckbox={handleToppingCheckbox}
              />
            )}

            <div className="flex items-center justify-between mt-12">
              <span className="font-bold">₹{totalPrice}</span>
              <Button
                className={alreadyHasInCart ? "bg-gray-700" : "bg-primary"}
                disabled={alreadyHasInCart}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart size={20} />
                <span className="ml-2">
                  {alreadyHasInCart ? "Already in cart" : "Add to cart"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
