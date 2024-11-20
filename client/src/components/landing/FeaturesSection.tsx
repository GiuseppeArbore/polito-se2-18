import React from "react";
import {
  RiMapPinLine,
  RiNavigationLine,
  RiMapPin2Line,
} from "@remixicon/react";
const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "FIRST COLONIZATION",
      description:
        "Add something here and change icons to something related to the first colonization",
      icon: <RiMapPinLine />,
    },
    {
      title: "SECOND COLONIZATION",
      description:
        "Add something here and change icons to something related to the THINK WE'RE SPEAKING ABOUT",
      icon: <RiNavigationLine />,
    },
    {
      title: "BHO",
      description:
        "Add something here and change icons to something related to the THING WE'RE SPEAKING ABOUT",
      icon: <RiMapPin2Line />,
    },
  ];

  return (
    <section className="features-section text-white">
      <h2>Features</h2>
      <div className="feature-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-card bg-blue-600 text-white">
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
