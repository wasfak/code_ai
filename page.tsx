"use client";
import Image from "next/image";
import img1 from "../public/background-1.jpg";
import img2 from "../public/background-2.jpg";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Featured from "@/sections/Featured";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      text: "Fashion Week",
      img: img1,
      description: "Some introductory text goes here.",
    },
    {
      text: "The Next One",
      img: img2,
      description: "Next introductory text goes here.",
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 overflow-y-scroll overflow-x-hidden relative">
        <div
          className="relative w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative w-full flex-shrink-0 h-full">
              <Image
                src={slide.img}
                alt="Background"
                fill
                priority={true}
                style={{ objectFit: "cover" }}
                /*    fill
         
    
          sizes="100vw"
          quality={75} */
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="absolute top-[35%] left-10 p-4 mobile:left-5 flex items-start flex-col gap-y-4">
                <h1 className="text-white text-7xl tablet:text-6xl mobile:text-red-500">
                  {slide.text}
                </h1>
                <p className="text-white mt-2 tablet:text-base">
                  {slide.description}
                </p>
                <Button className="mt-4 bg-white text-black rounded-none hover:bg-white hover:text-green-500">
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-10 right-20 transform -translate-y-1/2 z-10 flex space-x-2">
          <Button
            onClick={handlePrev}
            className="rounded-full bg-white text-black px-4 py-2 w-16 h-16 tablet:w-14 tablet:h-14 hover:bg-white hover:text-green-500"
          >
            <FaArrowLeft />
          </Button>
          <Button
            onClick={handleNext}
            className="rounded-full bg-white text-black px-4 py-2 w-16 h-16 tablet:w-14 tablet:h-14 hover:bg-white hover:text-green-500"
          >
            <FaArrowRight />
          </Button>
        </div>
      </div>
      <Featured />
    </>
  );
}
