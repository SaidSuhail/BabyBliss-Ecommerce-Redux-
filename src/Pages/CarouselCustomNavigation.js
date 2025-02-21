import React, { useState, useEffect } from "react";

// Define your local image paths
const imagePaths = [
  "/images/baby-product-1.jpg",
  "/images/baby-product-2.jpg",
  "/images/baby-product-3.jpg",
  "/images/baby-product-4.jpg",
  "https://bornbabies.com/cdn/shop/files/feeding_bottle_banner_0271b574-5e11-4c17-88ef-94856835c585.jpg?v=1725882312&width=1100",
];

export function CarouselCustomNavigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = imagePaths.length;

  // Automatically transition slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval); 
  }, [totalSlides]);

  // Function to jump to a specific slide
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div
      id="default-carousel"
      className="relative w-full z-10" 
      data-carousel="slide"
      aria-live="polite"
    >
      {/* Image Slides */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {imagePaths.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
            data-carousel-item
            role="tabpanel"
            aria-labelledby={`carousel-slide-${index}`}
          >
            <img
              src={image}
              className="absolute block w-full h-full object-cover"
              alt={`Baby Product ${index + 1}`}
              aria-hidden={activeIndex !== index}
            />
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute z-20 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {imagePaths.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-blue-600" : "bg-white"
            }`}
            aria-current={activeIndex === index ? "true" : "false"}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            id={`carousel-slide-${index}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
