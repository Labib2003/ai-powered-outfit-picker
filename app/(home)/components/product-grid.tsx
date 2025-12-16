"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState } from "react"

export default function ProductGrid() {
  const [favorites, setFavorites] = useState<number[]>([])

  const products = [
    { id: 1, name: "Classic White Tee", price: 29.99, image: "/white-tshirt.png", rating: 4.5 },
    { id: 2, name: "Denim Jacket", price: 89.99, image: "/denim-jacket.jpg", rating: 4.8 },
    { id: 3, name: "Black Skinny Jeans", price: 59.99, image: "/black-jeans.jpg", rating: 4.6 },
    { id: 4, name: "Summer Dress", price: 49.99, image: "/summer-dress.jpg", rating: 4.7 },
    { id: 5, name: "Leather Boots", price: 129.99, image: "/leather-boots.jpg", rating: 4.9 },
    { id: 6, name: "Casual Hoodie", price: 44.99, image: "/cozy-hoodie.png", rating: 4.4 },
    { id: 7, name: "Floral Blouse", price: 39.99, image: "/floral-blouse.jpg", rating: 4.5 },
    { id: 8, name: "Cargo Pants", price: 69.99, image: "/cargo-pants.jpg", rating: 4.3 },
  ]

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition group">
          <div className="relative overflow-hidden bg-muted h-64">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition"
            >
              <Heart
                className={`h-5 w-5 transition ${
                  favorites.includes(product.id) ? "fill-primary text-primary" : "text-foreground"
                }`}
              />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-muted-foreground">★ {product.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">${product.price}</span>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
