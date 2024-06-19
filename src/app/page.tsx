import Image from "next/image";
import img from "../../public/bg2.webp";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-full w-full transition-transform duration-700 ease-in-out">
      <div className="h-full w-full flex-shrink-0">
        <Image
          src={img}
          alt="Background"
          fill
          priority={true}
          style={{ objectFit: "cover" }}
          /*    fill
   

    sizes="100vw"
    quality={75} */
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute left-10 top-[35%] flex flex-col items-start justify-center gap-y-4 p-4">
          <h1 className=" text-4xl font-bold text-[#FFFFE0]">Ai Assistant</h1>
          <Button className="mt-4 rounded-none bg-white text-black hover:bg-white hover:text-green-500">
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
}
