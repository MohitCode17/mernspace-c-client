import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ProductCard from "./components/product-card";
import { Category, Product } from "@/lib/types";

export default async function Home() {
  // TODO: DO CONCURRENT REQUEST -> USING PROMISE.ALL()

  // FETCH CATEGORIES
  const categoriesResponse = await fetch(
    `${process.env.BACKEND_URL}/api/catalog/categories`,
    {
      next: {
        revalidate: 3600, // 1hr
      },
    }
  );

  if (!categoriesResponse.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories: Category[] = await categoriesResponse.json();

  // FETCH PRODUCTS
  // TODO: ADD PAGINATION IF REQUIRED
  // TODO: **ADD DYNAMIC TENANT ID AS PER USER SELECTION ON TENANTS
  const productsResponse = await fetch(
    `${process.env.BACKEND_URL}/api/catalog/products?limit=100&tenantId=1`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!productsResponse.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: { data: Product[] } = await productsResponse.json();

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-white">
        <div className="container flex items-center justify-between py-24">
          <div>
            <h1 className="text-7xl font-black font-sans">
              Enjoy the Best Pizza in <br /> <span>Only 30 Minutes!</span>
            </h1>
            <p className="text-2xl mt-8 max-w-lg leading-snug">
              We guarantee a free meal if your pizza takes longer than 30
              minutes to arrive!
            </p>
            <Button className="mt-8 text-lg rounded-full py-7 px-6 font-bold">
              Get your pizza now
            </Button>
          </div>
          <div>
            <Image
              alt="pizza-main"
              src={"/pizza-main.png"}
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* CATEGORY TABS AND PRODUCT RELATED TO CATEGORY */}
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
    </>
  );
}
