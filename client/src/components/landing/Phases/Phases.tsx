import React from "react";
import ProcessCarousel from "./ProcessCarousel";

const Phases: React.FC = () => {
    return (
        <section className="phases-section">
            <h2 className="text-white text-sm md:text-xl lg:text-2xl xl:text-3xl font-bold mt-2 ">
                Discover Kiruna
            </h2>
            <div className="flex flex-col h-full flex-grow">
                <ProcessCarousel />
            </div>
        </section>
    );
};

export default Phases;
