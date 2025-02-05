"use client";

import React, { useEffect, useState } from "react";
import ToppingCard from "./topping-card";
import { Topping } from "@/lib/types";
import { useSearchParams } from "next/navigation";

const ToppingList = ({
  selectedToppings,
  handleToppingCheckbox,
}: {
  selectedToppings: Topping[];
  handleToppingCheckbox: (topping: Topping) => void;
}) => {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const searchParams = useSearchParams();

  // FETCH TOPPINGS
  useEffect(() => {
    const fetchData = async () => {
      const toppingsResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/catalog/toppings?tenantId=${searchParams.get("restaurantId")}`
      );
      const toppings = await toppingsResponse.json();
      setToppings(toppings);
    };
    fetchData();
  }, [searchParams]);

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
