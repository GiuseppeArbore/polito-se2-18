import React from "react";
import ProcessCarousel from "./ProcessCarousel";

const Phases: React.FC = () => {
    return (
        <section className="phases-section h-[60vh] flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h2 className="text-white text-sm md:text-xl lg:text-2xl xl:text-3xl font-bold">
                    Discover Kiruna
                </h2>
                <ProcessCarousel />
            </div>
        </section>
    );
};

export default Phases;
