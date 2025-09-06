import { ICartResponse, ICartRoot } from "@/interfaces/cart.interface";
import { getUserCart } from "@/services/cart.service";
import React, { createContext, useEffect, useState } from "react";

interface CartContextType {
  cartDetails: ICartResponse | null;
  setCartDetails: React.Dispatch<React.SetStateAction<ICartResponse | null>>;
  getCartDetails: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartDetails, setCartDetails] = useState<ICartResponse | null>(null);

  async function getCartDetails() {
    const res: ICartRoot = await getUserCart();
    setCartDetails(res.data);
  }

  useEffect(() => {
    getCartDetails();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartDetails, setCartDetails, getCartDetails }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
}
