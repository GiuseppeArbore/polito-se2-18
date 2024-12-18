import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ProcessCarousel.css";

const ProcessCarousel = () => {
    const [enlargedCard, setEnlargedCard] = useState<number | null>(null);

    const slides = [
        {
            title: "Where is Kiruna?",
            description: "Kiruna is the northernmost city in Sweden, situated in the province of Lapland, was founded in 1900. The city was originally built in the 1890s to serve the Kiruna Mine.",
            video: <ReactPlayer url="https://youtu.be/tBeTpJUX_DI" width="100%" height="100%" />,
        },
        {
            title: "Kiruna Attractions",
            description: "Northern lights, Midnight Sun, and more",
            cards: [
                {
                    title: "Northern Lights (Aurora Borealis)",
                    description: "Aurora hunting with reindeer sledding",
                    image: "/home/northern-lights.png",
                },
                {
                    title: "Abisko National Park",
                    description: "A beautiful national park known for its natural beauty",
                    image: "/home/abisko-national-park.png",
                },
                {
                    title: "Lake Torneträsk",
                    description: "One of the largest lakes in Sweden, located in the Lapland province",
                    image: "/home/lake-tornetrask.png",
                },
            ],
        },
        {
            title: "Kiruna Movement (Why? Plan and Future)",
            description: "The Swedish town of Kiruna will be moved building by building to a new location in the country due to years of mining that have caused it to sink into the ground.Valuable minerals have also been found in and around it, including Europe's largest deposit of rare earth minerals, used to make green technologies.",
            video: <ReactPlayer url="https://youtu.be/XMJWFfebEF4" width="100%" height="100%" />,
        },

    ];

    const handleCardClick = (index: number) => {
        setEnlargedCard(enlargedCard === index ? null : index);
    };

    return (
        <div className="process-carousel text-white max-w-screen-xl mx-auto">
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex flex-col lg:flex-row items-center justify-between gap-2 p-2"
                    >
                        <div className="w-full lg:w-1/2 text-center lg:text-center p-2 lg:p-4 ">
                            <h4 className="mb-1 text-lg md:text-xl lg:text-2xl font-bold">
                                {slide.title}
                            </h4>
                            {slide.description && (
                                <p className="text-sm md:text-md lg:text-lg">
                                    {slide.description}
                                </p>
                            )}
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center">
                            {slide.video ? (
                                <div className="w-full h-auto rounded-lg overflow-hidden" style={{ height: '20rem', width: '40rem' }}>
                                    {slide.video}
                                </div>
                            ) : slide.cards ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {slide.cards.map((card, cardIndex) => (
                                        <div
                                            key={cardIndex}
                                            className={`bg-white text-black rounded-lg shadow-md p-6 cursor-pointer transition-transform duration-300 ${enlargedCard === cardIndex ? 'transform scale-110' : ''}`}
                                            onClick={() => handleCardClick(cardIndex)}
                                            style={{ width: '20rem', height: '20rem', margin: '2rem' }} 
                                        >
                                            <img
                                                src={card.image}
                                                alt={card.title}
                                                className="w-full h-40 object-cover rounded-t-lg"
                                            />
                                            <h5 className="mt-2 text-lg font-bold">{card.title}</h5>
                                            <p className="text-xxs">{card.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProcessCarousel;
