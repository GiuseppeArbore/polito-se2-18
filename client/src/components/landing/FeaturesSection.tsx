import React from "react";
import {
  faMapMarkerAlt,
  faLocationArrow,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "",
      description: "Enhanced interaction with MapGL for seamless navigation",
      icon: faMapMarkerAlt,
    },
    {
      title: "",
      description:
        "Clear, concise information presented in an easily digestible format",
      icon: faLocationArrow,
    },
    {
      title: "",
      description:
        "Optimized document storage for superior performance and efficiency.",
      icon: faMapPin,
    },
  ];

  return (
    <section className="features-section">
      <h2>Features</h2>
      <div className="feature-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <FontAwesomeIcon
              icon={feature.icon}
              size="2x"
              className="text-white hover:scale-110 hover:shadow-lg transition-transform duration-300"
              title="Explore"
            />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
