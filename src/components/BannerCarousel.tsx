import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { generateMockEvents } from '../utils/mockData';

const bannerSlidesData = [
  {
    eventTitle: 'IPL 2025 Finals',
    image: 'https://images.unsplash.com/photo-1629280179425-4b156a7c9011?q=80&w=2070&auto=format&fit=crop',
    alt: 'A brightly lit cricket stadium at night during a match',
    content: {
      title: 'IPL 2025 Finals',
      description: 'Witness the crowning of the champion! Early bird tickets now available with 15% off.',
      buttonText: 'Book Now'
    }
  },
  {
    eventTitle: 'Stand-Up Comedy Night',
    image: 'https://images.unsplash.com/photo-1543794532-9b2834c68494?q=80&w=2070&auto=format&fit=crop',
    alt: 'A comedian on a dimly lit stage holding a microphone',
    content: {
      title: 'Stand-Up Comedy Night',
      description: 'Get ready for a night of laughter with top comedians. Tickets starting from just ₹499.',
      buttonText: 'Get Tickets'
    }
  },
  {
    eventTitle: 'Sunburn Music Festival 2025',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop',
    alt: 'A large crowd at a music festival with colorful stage lights',
    content: {
      title: 'Sunburn Festival 2025',
      description: 'The biggest music festival is back! Phase 1 tickets are now live. Don\'t miss out!',
      buttonText: 'Register Now'
    }
  },
  {
    eventTitle: 'Tech Summit India 2025',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop',
    alt: 'A team of professionals collaborating in a modern office space',
    content: {
      title: 'Tech Summit India 2025',
      description: 'Join industry leaders and innovators to explore the future of technology.',
      buttonText: 'Learn More'
    }
  }
];

const OPTIONS: EmblaOptionsType = { loop: true };

const BannerCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allEvents = generateMockEvents();
  const bannerSlides = bannerSlidesData.map(slideData => {
    const event = allEvents.find(e => e.title === slideData.eventTitle);
    return {
      ...slideData,
      eventId: event ? event.id : ''
    };
  }).filter(slide => slide.eventId);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    
    const autoplay = setInterval(() => {
        emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <div className="relative bg-slate-200 dark:bg-slate-900 w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bannerSlides.map((slide, index) => {
            const isSelected = index === selectedIndex;
            return (
              <Link
                to={`/event/${slide.eventId}`}
                key={index}
                className="block flex-shrink-0 w-full relative h-64 md:h-80 lg:h-[400px] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-label={slide.alt}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <motion.h2 
                      className="text-3xl md:text-5xl font-bold mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isSelected ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                  >
                      {slide.content.title}
                  </motion.h2>
                  <motion.p 
                      className="text-base md:text-lg max-w-xl mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isSelected ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                  >
                      {slide.content.description}
                  </motion.p>
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isSelected ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                  >
                      <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors shadow-lg">
                          {slide.content.buttonText}
                      </button>
                  </motion.div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      
      <button onClick={scrollPrev} className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button onClick={scrollNext} className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors">
        <ArrowRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-white w-6' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
