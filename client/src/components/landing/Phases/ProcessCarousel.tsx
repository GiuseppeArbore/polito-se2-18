import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ProcessCarousel.css";

const ProcessCarousel = () => {
  const slides = [
    {
      title: "Research and analysis of the documents",
      description: "",
      image: "/home/phase1.png",
    },
    {
      title: "Trip to Kiruna",
      description:
        "Including Reorganization of documents through interviews and site visits",
      image: "/home/phase2-1.png",
    },
    {
      title: "Trip to Kiruna",
      description: "Drafting the tales",
      image: "/home/phase2-2.png",
    },
    {
      title: "Trip to Kiruna",
      description: "Reorganizing the stories into a hypertext",
      image: "/home/phase2-3.png",
    },
    {
      title: "Design a web app for Kiruna kommun",
      description: "",
      image: "/home/phase3.png",
    },
  ];

  return (
    <div className="process-carousel text-white">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-full lg:w-1/2 text-center lg:text-left p-8">
              <h4 className="mb-2 text-xl font-bold">{slide.title}</h4>
              {slide.description && (
                <p className="text-md">{slide.description}</p>
              )}
            </div>

            <div className="w-full lg:w-1/2 mb-4">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-[20vw] h-[20vh] object-cover rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProcessCarousel;
