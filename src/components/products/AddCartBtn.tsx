"use client";
import React, { useTransition } from "react";
import CustomButton from "../shared/CustomButton";
import { addToCart } from "@/services/cart.service";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export default function AddCartBtn({
  productId,
  ...props
}: {
  productId: string;
  [key: string]: string;
}) {
  const { getCartDetails } = useCart();
  const [isPending, startTransition] = useTransition();

  async function addProductToCart(productId: string) {
    startTransition(async () => {
      const res = await addToCart(productId);
      console.log(res);
      if (res.success) {
        toast.success(res.message, { position: "top-center" });
        getCartDetails();
      } else toast.error(res.message, { position: "top-center" });
    });
  }

  return (
    <CustomButton
      disabled={isPending}
      onClick={() => addProductToCart(productId)}
      {...props}>
      {isPending ? <LoaderCircle className="animate-spin" /> : "Add to Cart"}
    </CustomButton>
  );
}
