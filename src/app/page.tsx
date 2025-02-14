"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import {
  ShoppingCartIcon,
  StarIcon,
  Trash,
  WalletIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCredits } from "@/hooks/use-credits";
import { cn } from "@/lib/utils";

export type ProductItem = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export default function Home() {
  const [data, setData] = useState<ProductItem[]>([]);
  const { cart, CartService } = useCart();
  const { credits, CreditsService } = useCredits();

  const [selectedCredit, setSelectedCredit] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, []);

  const total = cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <div>
      <header>
        <div className="container mx-auto py-4 flex items-center justify-between gap-4">
          <span className="font-extrabold tracking-widest uppercase">
            Tienda BuenaOnda Talks
          </span>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <ShoppingCartIcon className="size-4" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Carrito de compras</DialogTitle>

                  <div className="flex flex-col gap-4">
                    {cart.length === 0 ? (
                      <p>No hay productos en el carrito</p>
                    ) : (
                      <>
                        {cart.map((item) => (
                          <div key={item.product.id}>
                            <p>{item.product.title}</p>
                            <div className="flex items-center gap-2">
                              <p>{item.quantity} u</p>

                              <p>x ${item.product.price}</p>

                              <button
                                onClick={() => {
                                  CartService.substractFromCart(
                                    item.product.id
                                  );
                                }}
                              >
                                -
                              </button>

                              <button
                                onClick={() => {
                                  CartService.addToCart(item.product);
                                }}
                              >
                                +
                              </button>

                              <button
                                onClick={() => {
                                  CartService.deleteFromCart(item.product.id);
                                }}
                              >
                                <Trash className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between">
                          <p>
                            Total: <span className="font-bold">${total}</span>
                          </p>

                          <Button
                            onClick={() => {
                              CreditsService.substractFromCredits(total);

                              CartService.clearCart();

                              alert("Compra realizada correctamente");
                            }}
                            variant="default"
                          >
                            Comprar
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 border rounded-full border-primary"
                >
                  <WalletIcon className="size-4" />
                  <p>{credits.credits.toFixed(2)}</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tus créditos</DialogTitle>

                  {[100, 200, 300].map((credit) => {
                    return (
                      <Button
                        key={credit}
                        variant="outline"
                        className={cn(
                          selectedCredit === credit && "bg-blue-500 text-white"
                        )}
                        onClick={() => {
                          setSelectedCredit(credit);
                        }}
                      >
                        {credit}
                      </Button>
                    );
                  })}

                  <Button
                    variant="default"
                    onClick={() => {
                      CreditsService.addCredits(selectedCredit);

                      setSelectedCredit(0);

                      alert("Créditos agregados correctamente");
                    }}
                    disabled={selectedCredit === 0}
                  >
                    Agregar créditos
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="bg-muted min-h-screen">
        <div className="container mx-auto py-20">
          <div className="grid grid-cols-4 gap-4">
            {data.map((item) => (
              <div
                className="border border-gray-300 rounded-md p-6 bg-white flex flex-col"
                key={item.id}
              >
                <div className="aspect-square relative mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    height={500}
                    width={500}
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="uppercase">{item.category}</p>

                <h2 className="text-lg font-medium truncate mb-2">
                  {item.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {item.description.slice(0, 100)}...
                </p>

                {/* Precio y rating */}
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${item.price}</p>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const rating = item.rating.rate;

                          const finalRating = Math.round(rating);

                          return (
                            <span key={index}>
                              <StarIcon
                                className={`w-4 h-4 ${
                                  index < finalRating
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </span>
                          );
                        })}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        ({item.rating.count})
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      CartService.addToCart(item);
                      alert("Producto agregado al carrito");
                    }}
                  >
                    Agregar al carrito
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
