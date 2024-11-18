import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@tremor/react";
import { Link } from "react-router-dom";
import { Badge } from "@tremor/react";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section bg-[#003d8e] text-white h-[40vh] flex flex-col justify-center items-center p-4 rounded-tl-lg rounded-tr-lg">
      <h1 className="text-4xl font-bold animate__animated animate__fadeIn animate__delay-1s">
        Kiruna Explorer: A City on the Move
      </h1>
      <Text className="text-xl mt-4 animate__animated animate__fadeIn animate__delay-2s">
        Discover the journey of Sweden's moving city
      </Text>
      <div className="animate__animated animate__fadeIn animate__delay-2s mb-4 custom-blink">
        <Link to="/dashboard">
          <Badge color="white" size="lg" className="cursor-pointer ">
            Start Exploring
          </Badge>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
