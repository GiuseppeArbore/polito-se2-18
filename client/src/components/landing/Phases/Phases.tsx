import React from "react";
import ProcessCarousel from "./ProcessCarousel";

const Phases: React.FC = () => {
  return (
    <section className="phases-section">
      <h2 className="text-white">Phases of The Project</h2>
      <ProcessCarousel />
    </section>
  );
};

export default Phases;
