import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import Image from "next/image";
import React from "react";
import { Product } from "@/lib/types";
import ProductModal from "./product-modal";
import { getFromPrice } from "@/lib/utils";

type PropTypes = { product: Product };

const ProductCard = ({ product }: PropTypes) => {
  return (
    <Card className="border-none">
      <CardHeader className="flex items-center justify-center h-44">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={150}
            height={150}
            className="object-cover max-h-full max-w-full"
          />
        </div>
      </CardHeader>

      <CardContent className="mt-2">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="mt-2 text-sm line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-2">
        <p>from ₹{getFromPrice(product)}</p>

        {/* PRODUCT MODAL */}
        <ProductModal product={product} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
