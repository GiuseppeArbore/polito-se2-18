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
            video: <ReactPlayer url="https://youtu.be/tBeTpJUX_DI" width='40rem' height='20rem' />,
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
            video: <ReactPlayer url="https://youtu.be/XMJWFfebEF4" width='40rem' height='20rem' />,
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
                style={{ marginTop: '1rem' }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex flex-col lg:flex-row items-center"
                    >
                        <div className="custom-slide-content">
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
                                <div className="w-full h-auto custom-video-container " style={{ marginBottom: '3rem' }} >
                                    {slide.video}
                                </div>
                            ) : slide.cards ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 card-container" style={{ gap: '1rem' }}>
                                    {slide.cards.map((card, cardIndex) => (
                                        <Card
                                            key={cardIndex}
                                            className="custom-card bg-white dark:bg-white text-black rounded-lg shadow-md p-4"
                                        >
                                            <img
                                                src={card.image}
                                                alt={card.title}
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                            <h5 className="mt-2 text-lg font-bold">{card.title}</h5>
                                            <p>{card.description}</p>
                                        </Card>
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
