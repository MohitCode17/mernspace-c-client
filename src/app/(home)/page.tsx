import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ProductCard, { Product } from "./components/product-card";
import { Category } from "@/lib/types";

// Demo list of product
const products: Product[] = [
  {
    id: "1",
    name: "Margarita Pizza",
    description: "This is a very tasty pizza",
    image: "/pizza-main.png",
    price: 500,
  },
  {
    id: "2",
    name: "Margarita Pizza",
    description: "This is a very tasty pizza",
    image: "/pizza-main.png",
    price: 500,
  },
  {
    id: "3",
    name: "Margarita Pizza",
    description: "This is a very tasty pizza",
    image: "/pizza-main.png",
    price: 500,
  },
  {
    id: "4",
    name: "Margarita Pizza",
    description: "This is a very tasty pizza",
    image: "/pizza-main.png",
    price: 500,
  },
  {
    id: "5",
    name: "Margarita Pizza",
    description: "This is a very tasty pizza",
    image: "/pizza-main.png",
    price: 500,
  },
];

const beverages: Product[] = [
  {
    id: "1",
    name: "Classic Cold Coffee",
    description: "Cold and Refreshing Coffee",
    image: "/beverages.png",
    price: 80,
  },
  {
    id: "2",
    name: "Classic Cold Coffee",
    description: "Cold and Refreshing Coffee",
    image: "/beverages.png",
    price: 80,
  },
  {
    id: "3",
    name: "Classic Cold Coffee",
    description: "Cold and Refreshing Coffee",
    image: "/beverages.png",
    price: 80,
  },
  {
    id: "4",
    name: "Classic Cold Coffee",
    description: "Cold and Refreshing Coffee",
    image: "/beverages.png",
    price: 80,
  },
  {
    id: "5",
    name: "Classic Cold Coffee",
    description: "Cold and Refreshing Coffee",
    image: "/beverages.png",
    price: 80,
  },
];

export default async function Home() {
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
          <Tabs defaultValue="pizza">
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
            <TabsContent value="pizza">
              <div className="grid grid-cols-4 gap-6 mt-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="beverages">
              <div className="grid grid-cols-4 gap-6 mt-6">
                {beverages.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
