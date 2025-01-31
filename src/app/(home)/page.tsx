import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <section className="bg-white">
      <div className="container flex items-center justify-between py-24">
        <div>
          <h1 className="text-7xl font-black font-sans">
            Enjoy the Best Pizza in <br /> <span>Only 30 Minutes!</span>
          </h1>
          <p className="text-2xl mt-8 max-w-lg leading-snug">
            We guarantee a free meal if your pizza takes longer than 30 minutes
            to arrive!
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
  );
}
