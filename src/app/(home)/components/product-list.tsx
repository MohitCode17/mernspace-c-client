import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ProductCard from "./product-card";
import { Category, Product } from "@/lib/types";

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/catalog/categories`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function fetchProducts(): Promise<{ data: Product[] }> {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/catalog/products?limit=100&tenantId=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

const ProductList = async () => {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return (
    <section>
      <div className="container py-12">
        <Tabs defaultValue={categories[0]._id}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category._id}
                value={category._id}
                className="text-md"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category._id} value={category._id}>
              <div className="grid grid-cols-4 gap-6 mt-6">
                {products.data
                  .filter((product) => product.category._id === category._id)
                  .map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ProductList;
