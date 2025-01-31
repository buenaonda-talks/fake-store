"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCartIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type ProductItem = {
  id: number;
  title: string;
  price: string;
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <header>
        <div className="container mx-auto py-20">
          <Dialog>
            <DialogTrigger asChild>
              <ShoppingCartIcon className="size-4" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Carrito de compras</DialogTitle>

                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.product.id}>
                      <p>{item.product.title}</p>
                      <p>{item.quantity}</p>
                    </div>
                  ))}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
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
