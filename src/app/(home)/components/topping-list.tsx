"use client";

import React, { useEffect, useState } from "react";
import ToppingCard from "./topping-card";
import { Topping } from "@/lib/types";

const ToppingList = ({
  selectedToppings,
  handleToppingCheckbox,
}: {
  selectedToppings: Topping[];
  handleToppingCheckbox: (topping: Topping) => void;
}) => {
  const [toppings, setToppings] = useState<Topping[]>([]);

  // FETCH TOPPINGS
  useEffect(() => {
    const fetchData = async () => {
      const toppingsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalog/toppings?tenantId=1`
      );
      const toppings = await toppingsResponse.json();
      setToppings(toppings);
    };
    fetchData();
  }, []);

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
