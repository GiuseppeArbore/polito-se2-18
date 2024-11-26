import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ProcessCarousel.css";

const ProcessCarousel = () => {
  return (
    <div className="process-carousel text-white">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <h3>Phase 1: Planning</h3>
          <p>Description for phase 1</p>
        </SwiperSlide>
        <SwiperSlide>
          <h3>Phase 2: Development</h3>
          <p className="mb-8">Description for phase 2</p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ProcessCarousel;
