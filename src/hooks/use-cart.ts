import { ProductItem } from "@/app/page";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "cart1";

type CartItem = {
  quantity: number;
  product: ProductItem;
};

const getCart = () => {
  const cart = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

const addToCart = (product: ProductItem) => {
  const cart = getCart();
  const existingItem = cart.find(
    (item: CartItem) => item.product.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ quantity: 1, product });
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
};

const substractFromCart = (productId: number) => {
  const cart = getCart();
  const existingItem = cart.find(
    (item: CartItem) => item.product.id === productId
  );

  if (existingItem && existingItem.quantity > 1) {
    existingItem.quantity -= 1;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
};

const clearCart = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

const PrincipalCartService = {
  getCart,
  addToCart,
  substractFromCart,
  clearCart,
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(PrincipalCartService.getCart());

  useEffect(() => {
    setCart(PrincipalCartService.getCart());
  }, []);

  const addToCart = (product: ProductItem) => {
    PrincipalCartService.addToCart(product);
    setCart(PrincipalCartService.getCart());
  };

  const substractFromCart = (productId: number) => {
    PrincipalCartService.substractFromCart(productId);
    setCart(PrincipalCartService.getCart());
  };

  const clearCart = () => {
    PrincipalCartService.clearCart();
    setCart(PrincipalCartService.getCart());
  };

  return {
    cart,
    CartService: {
      addToCart,
      substractFromCart,
      clearCart,
    },
  };
};
