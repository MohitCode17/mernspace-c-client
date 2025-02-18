import React, { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store/hooks";
import { getProductTotal } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { verifyCoupon } from "@/lib/http/api";
import { useSearchParams } from "next/navigation";
import { CouponCodeData } from "@/lib/types";
import { LoaderCircle } from "lucide-react";

// TODO: IMPLMENT TAX RATE FEATURE IN BACKEND ASSOSCIATED WITH PARTICULAR RESTAURANT & CITY. TAXES CAN BE DIFFER AS PER CITY OR COUNTRY. FOR NOW I TAKE 18% GST ACCORDING TO INDIA.
const TAX_RATE = 18;

// TODO: DELIVERY_CHARGES CAN BE DEPENDS ON RESTAURANT, MOVE THIS LOGIC TO BACKEND (ORDER SERVICE)
const DELIVERY_CHARGES = 50;

const OrderSummary = ({
  isPlaceOrderPending,
  handleCouponCodeChange,
}: {
  isPlaceOrderPending: boolean;
  handleCouponCodeChange: (code: string) => void;
}) => {
  const searchParam = useSearchParams();

  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [discountError, setDiscountError] = useState("");

  const cart = useAppSelector((state) => state.cart.cartItem);

  const couponCodeRef = useRef<HTMLInputElement>(null);

  // CALCULATE SUB TOTAL
  const subTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr.qty * getProductTotal(curr);
    }, 0);
  }, [cart]);

  // CALCULATE DISCOUNT AMOUNT
  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercentage) / 100);
  }, [subTotal, discountPercentage]);

  // CALCULATE TAX AMOUNT
  const taxesAmount = useMemo(() => {
    const amountAfterDiscount = subTotal - discountAmount;
    return Math.round((amountAfterDiscount * TAX_RATE) / 100);
  }, [subTotal, discountAmount]);

  // CALCULATE GRAND TOTAL WITH DISCOUNT APPLIED
  const grandTotalWithDiscount = useMemo(() => {
    return subTotal - discountAmount + taxesAmount + DELIVERY_CHARGES;
  }, [discountAmount, subTotal, taxesAmount]);

  // CALCULATE GRAND TOTAL WITHOUT DISCOUNT APPLIED
  const grandTotalWithoutDiscount = useMemo(() => {
    return subTotal + taxesAmount + DELIVERY_CHARGES;
  }, [subTotal, taxesAmount]);

  // CALL VERIFY COUPON ENDPOINT
  const { mutate } = useMutation({
    mutationKey: ["couponCode"],
    mutationFn: async () => {
      if (!couponCodeRef.current) {
        return;
      }

      const restaurantId = searchParam.get("restaurantId");

      if (!restaurantId) {
        return;
      }

      const data: CouponCodeData = {
        code: couponCodeRef.current.value,
        tenantId: restaurantId,
      };

      return await verifyCoupon(data).then((res) => res.data);
    },
    onSuccess: (data) => {
      if (data.valid) {
        setDiscountError("");
        handleCouponCodeChange(
          couponCodeRef.current ? couponCodeRef.current.value : ""
        );
        setDiscountPercentage(data.discount);
        return;
      }
      setDiscountError("Coupon is expired");
      handleCouponCodeChange("");
      setDiscountPercentage(0);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg || "Something went wrong";

      if (errorMessage.includes("Coupon does not exists")) {
        setDiscountError("Invalid coupon code");
      } else {
        setDiscountError(errorMessage);
      }

      setDiscountPercentage(0);
    },
  });

  const handleCouponValidation = (e: React.MouseEvent) => {
    e.preventDefault();

    mutate();
  };

  return (
    <Card className="w-2/5 border-none h-auto self-start">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold">₹{subTotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes(18%)</span>
          <span className="font-bold">₹{taxesAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery charges</span>
          <span className="font-bold">₹{DELIVERY_CHARGES}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span className="font-bold">₹{discountAmount}</span>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <span className="font-bold">Order total</span>
          <span className="font-bold flex flex-col items-end">
            <span
              className={discountPercentage ? "line-through text-gray-400" : ""}
            >
              ₹{grandTotalWithoutDiscount}
            </span>
            {discountPercentage ? (
              <span className="text-green-700">₹{grandTotalWithDiscount}</span>
            ) : null}
          </span>
        </div>
        {discountError && <div className="text-red-500">{discountError}</div>}
        <div className="flex items-center gap-4">
          <Input
            id="code"
            name="code"
            type="text"
            className="w-full"
            placeholder="Coupon code"
            ref={couponCodeRef}
          />
          <Button onClick={handleCouponValidation} variant={"outline"}>
            Apply
          </Button>
        </div>

        <div className="text-right mt-6">
          <Button disabled={isPlaceOrderPending}>
            {isPlaceOrderPending ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                <span>Please wait...</span>
              </span>
            ) : (
              <span>Place order</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
