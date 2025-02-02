import { Button } from "@/components/ui/button";
import { Topping } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

type PropType = {
  topping: Topping;
  selectedToppings: Topping[];
  handleToppingCheckbox: (topping: Topping) => void;
};

const ToppingCard = ({
  topping,
  selectedToppings,
  handleToppingCheckbox,
}: PropType) => {
  // Logic to check current selected toppings
  const isCurrentSelected = selectedToppings.some(
    (elem) => elem.id === topping.id
  );

  return (
    <Button
      onClick={() => handleToppingCheckbox(topping)}
      variant={"outline"}
      className={cn(
        "flex flex-col h-42 relative",
        isCurrentSelected ? "border-primary" : ""
      )}
    >
      <Image src={topping.image} alt={topping.name} width={80} height={80} />
      <h4>{topping.name}</h4>
      <p>&#8377; {topping.price}</p>
      {isCurrentSelected && (
        <CircleCheck className="absolute top-1 right-1 text-primary" />
      )}
    </Button>
  );
};

export default ToppingCard;
