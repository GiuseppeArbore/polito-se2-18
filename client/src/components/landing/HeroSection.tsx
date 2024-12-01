import React from "react";
import { Text } from "@tremor/react";
import { Link } from "react-router-dom";
import { Badge } from "@tremor/react";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section bg-[#003d8e] text-white lg:h-[20vh] sm: h-[30vh] flex justify-between items-center p-4 rounded-tl-lg rounded-tr-lg">
      <div className="flex flex-col">
        <h1 className="lg:text-2xl sm:text-xl font-bold animate__animated animate__fadeIn animate__delay-1s text-white">
          Kiruna Explorer: A City on the Move
        </h1>
        <Text className="text-md mt-2 animate__animated animate__fadeIn animate__delay-2s">
          Discover the journey of Sweden's moving city
        </Text>
      </div>
      <div className="animate__animated animate__fadeIn animate__delay-2s custom-blink ml-[-20px]">
        <Link to="/dashboard">
          <Badge color="white" size="lg" className="cursor-pointer">
            Start Exploring
          </Badge>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
