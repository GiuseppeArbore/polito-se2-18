import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Card } from '@tremor/react';
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ProcessCarousel.css";
// Adjust the import path as necessary

const ProcessCarousel = () => {
    const [enlargedCard, setEnlargedCard] = useState<number | null>(null);

    const slides = [
        {
            title: "Where is Kiruna?",
            description: "Kiruna is the northernmost city in Sweden, situated in the province of Lapland, was founded in 1900. The city was originally built in the 1890s to serve the Kiruna Mine.",
            video: <ReactPlayer url="https://youtu.be/tBeTpJUX_DI" width='100%' height='100%' />,
        },
        {
            title: "Northern Lights (Aurora Borealis)",
            description: "Aurora hunting with reindeer sledding",
            cards: [
                {
                    image: "/home/northern-lights.png",
                },
            ],
        },
        {
            title: "Abisko National Park",
            description: "A beautiful national park known for its natural beauty",
            cards: [

                {

                    image: "/home/abisko-national-park.png",
                },
            ],
        },
        {
            title: "Lake Torneträsk",
            description: "One of the largest lakes in Sweden, located in the Lapland province",
            cards: [
                {

                    image: "/home/lake-tornetrask.png",
                },
            ],
        },
        {
            title: "Kiruna Movement (Why? Plan and Future)",
            description: "The Swedish town of Kiruna will be moved building by building to a new location in the country due to years of mining that have caused it to sink into the ground.Valuable minerals have also been found in and around it, including Europe's largest deposit of rare earth minerals, used to make green technologies.",
            video: <ReactPlayer url="https://youtu.be/XMJWFfebEF4" width='100%' height='100%' />,
        },

    ];

    const handleCardClick = (index: number) => {
        setEnlargedCard(enlargedCard === index ? null : index);
    };

    return (
        <div className="process-carousel text-white max-w-screen-xl mx-auto flex-grow">
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
                        <div className="w-full lg:w-1/3 text-center lg:text-center p-2 lg:p-4 desc-container" style={{ marginLeft: 'auto' }}>
                            <h4 className="mb-1 text-lg md:text-xl lg:text-2xl font-bold">
                                {slide.title}
                            </h4>
                            {slide.description && (
                                <p className="text-sm md:text-md lg:text-lg">
                                    {slide.description}
                                </p>
                            )}
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center items-center" style={{ marginRight: 'auto', minHeight: '50vh', height: 'auto' }}>
                            {slide.video ? (
                                <div className="w-1/2 xl:w-[35vw] 2xl:w-[40vw] h-[35vh] rounded-lg" style={{ marginBottom: '3rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                    <div className="w-full h-full object-cover">
                                        {slide.video}
                                    </div>
                                </div>
                            ) : slide.cards ? (
                                <div style={{ gap: '2rem', maxWidth: '100%', maxHeight: '100%' }}>
                                    {slide.cards.map((card, cardIndex) => (
                                       
                                            <img
                                                src={card.image}
                                                className=" images w-full h-auto h-40 md:h-50 lg:h-60 object-cover rounded-lg"
                                            />
                                        
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
