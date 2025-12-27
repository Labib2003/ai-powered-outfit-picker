import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/db/schema/product";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group pt-0">
      <div className="relative overflow-hidden bg-muted h-64">
        <img
          src={product.imageUrl || undefined}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
      </div>

      <div className="px-5 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2">
          {product.name}
        </h3>

        <p
          className="text-sm text-muted-foreground line-clamp-3"
          title={product.description}
        >
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${product.price}
          </span>
          <Button
            size="sm"
            className="bg-linear-to-r from-primary to-accent hover:opacity-90"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};
export default ProductCard;
