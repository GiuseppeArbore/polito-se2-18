import React from "react";
import {
  RiMapPinLine,
  RiNavigationLine,
  RiMapPin2Line,
} from "@remixicon/react";
const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "",
      description: "Enhanced interaction with MapGL for seamless navigation",
      icon: <RiMapPinLine />,
    },
    {
      title: "",
      description:
        "Clear, concise information presented in an easily digestible format",
      icon: <RiNavigationLine />,
    },
    {
      title: "",
      description:
        "Optimized document storage for superior performance and efficiency.",
      icon: <RiMapPin2Line />,
    },
  ];

  return (
    <section className="features-section">
      <h2>Features</h2>
      <div className="feature-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div
              className="text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-transform duration-300 text-2xl"
              title="Explore"
            >
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
