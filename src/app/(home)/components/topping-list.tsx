"use client";

import React, { useState } from "react";
import ToppingCard, { Topping } from "./topping-card";

const toppings = [
  {
    id: "1",
    name: "Chicken",
    image: "/chicken.png",
    price: 90,
    isAvailable: true,
  },
  {
    id: "2",
    name: "jelapeno",
    image: "/Jelapeno.png",
    price: 50,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Cheese",
    image: "/cheese.png",
    price: 120,
    isAvailable: true,
  },
];

const ToppingList = () => {
  const [selectedToppings, setSelectedToppings] = useState([toppings[0]]);

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

  return (
    <section className="mt-6">
      <h3>Extra toppings</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {toppings.map((topping) => (
          <ToppingCard
            key={topping.id}
            topping={topping}
            selectedToppings={selectedToppings}
            handleToppingCheckbox={handleToppingCheckbox}
          />
        ))}
      </div>
    </section>
  );
};

export default ToppingList;
