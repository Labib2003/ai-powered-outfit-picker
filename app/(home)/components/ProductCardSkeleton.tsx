import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group pt-0">
      <div className="relative overflow-hidden bg-muted h-64">
        <Skeleton className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <Skeleton>
          <h3 className="font-semibold text-foreground line-clamp-2 opacity-0">
            abc
          </h3>
        </Skeleton>

        <Skeleton>
          <p className="text-sm text-muted-foreground line-clamp-3 opacity-0">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Consequuntur esse asperiores eveniet commodi, ad molestias qui in
            accusantium aliquam distinctio iusto earum fugit aperiam dicta.
            Maxime, quidem. Doloremque, ipsam optio?
          </p>
        </Skeleton>

        <div className="flex items-center justify-between">
          <Skeleton>
            <span className="text-xl font-bold text-primary opacity-0">
              123
            </span>
          </Skeleton>

          <Skeleton>
            <Button
              size="sm"
              className="bg-linear-to-r from-primary to-accent opacity-0"
            >
              Add to Cart
            </Button>
          </Skeleton>
        </div>
      </div>
    </Card>
  );
};
export default ProductCardSkeleton;
