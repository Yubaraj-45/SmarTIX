import { faker } from '@faker-js/faker';
import { Event, EventCategory, TicketTier, Booking } from '../types';

const categories: EventCategory[] = [
  'Music',
  'Sports',
  'Arts & Theatre',
  'Food & Drink',
  'Technology',
  'Business',
  'Comedy',
  'Film'
];

const venues = [
  'Phoenix Marketcity', 'Jawaharlal Nehru Stadium', 'NSCI Dome',
  'DLF Cyber Hub', 'Kingdom of Dreams', 'Siri Fort Auditorium',
  'The Leela Palace', 'Hyderabad International Convention Centre',
  'Palace Grounds', 'Taj Lands End', 'ITC Grand Bharat'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Goa'
];

const eventImages = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop'
];

const mockEvents = Array.from({ length: 24 }, (_, index) => {
    const category = faker.helpers.arrayElement(categories);
    const city = faker.helpers.arrayElement(cities);
    const minPrice = faker.number.int({ min: 500, max: 2000 });
    const maxPrice = minPrice + faker.number.int({ min: 1000, max: 5000 });
    const totalTickets = faker.number.int({ min: 100, max: 5000 });
    const ticketsAvailable = faker.number.int({ min: 0, max: totalTickets });

    return {
      id: `event-${index + 1}`,
      title: generateEventTitle(category),
      description: faker.lorem.paragraph(3),
      category,
      date: faker.date.future({ years: 0.5 }),
      time: faker.date.future().toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      venue: faker.helpers.arrayElement(venues),
      city,
      country: 'India',
      image: faker.helpers.arrayElement(eventImages),
      price: {
        min: minPrice,
        max: maxPrice,
        currency: '₹'
      },
      ticketsAvailable,
      totalTickets,
      organizer: faker.company.name(),
      tags: generateTags(category),
      rating: parseFloat(faker.number.float({ min: 3.5, max: 5.0 }).toFixed(1)),
      attendees: faker.number.int({ min: 50, max: 2000 }),
      featured: index < 6,
      aiScore: parseFloat(faker.number.float({ min: 0.7, max: 0.99 }).toFixed(2))
    };
});

export const generateMockEvents = (count: number = 24): Event[] => {
  return mockEvents.slice(0, count);
};

function generateEventTitle(category: EventCategory): string {
  const titles: Record<EventCategory, string[]> = {
    'Music': ['Sunburn Music Festival 2025', 'NH7 Weekender', 'Bollywood Nights Live'],
    'Sports': ['IPL 2025 Finals', 'Mumbai Marathon', 'ISL Football Championship'],
    'Arts & Theatre': ['The Merchant of Venice', 'Contemporary Art Exhibition', 'Kathak Dance Performance'],
    'Food & Drink': ['Street Food Festival', 'Wine Tasting Evening', 'Culinary Masterclass'],
    'Technology': ['Tech Summit India 2025', 'AI & ML Conference', 'Startup Pitch Night'],
    'Business': ['Leadership Summit', 'Entrepreneur\'s Forum', 'Business Networking Event'],
    'Comedy': ['Stand-Up Comedy Night', 'Comedy Central Live', 'Improv Theatre Show'],
    'Film': ['International Film Festival', 'Bollywood Premier Night', 'Documentary Screening']
  };
  return faker.helpers.arrayElement(titles[category]);
};

function generateTags(category: EventCategory): string[] {
  const baseTags = ['Popular', 'Trending', 'Limited Seats'];
  const categoryTags: Record<EventCategory, string[]> = {
    'Music': ['Live', 'Concert', 'Festival'],
    'Sports': ['Championship', 'Tournament', 'Live'],
    'Arts & Theatre': ['Performance', 'Exhibition', 'Cultural'],
    'Food & Drink': ['Tasting', 'Gourmet', 'Festival'],
    'Technology': ['Conference', 'Workshop', 'Networking'],
    'Business': ['Professional', 'Networking', 'Summit'],
    'Comedy': ['Stand-up', 'Live Show', 'Entertainment'],
    'Film': ['Screening', 'Premier', 'Festival']
  };
  return [...faker.helpers.arrayElements(baseTags, 1), ...faker.helpers.arrayElements(categoryTags[category], 2)];
};

export const generateTicketTiers = (eventId: string): TicketTier[] => {
  const event = mockEvents.find(e => e.id === eventId);
  const basePrice = event ? event.price.min : 750;
  return [
    { id: `${eventId}-general`, name: 'General Admission', price: basePrice, available: faker.number.int({ min: 50, max: 200 }), total: 200, benefits: ['Entry to event', 'General seating'] },
    { id: `${eventId}-premium`, name: 'Premium', price: Math.floor(basePrice * 2.5), available: faker.number.int({ min: 20, max: 100 }), total: 100, benefits: ['Priority entry', 'Premium seating', 'Complimentary refreshments'] },
    { id: `${eventId}-vip`, name: 'VIP', price: Math.floor(basePrice * 5), available: faker.number.int({ min: 5, max: 50 }), total: 50, benefits: ['VIP lounge access', 'Meet & greet', 'Exclusive merchandise', 'Premium bar'] }
  ];
};

export const generateMockBookings = (count: number = 150): Booking[] => {
  const bookings: Booking[] = [];
  for (let i = 0; i < count; i++) {
    const event = faker.helpers.arrayElement(mockEvents);
    const quantity = faker.number.int({ min: 1, max: 5 });
    bookings.push({
      id: `booking-${i + 1}`,
      eventId: event.id,
      eventTitle: event.title,
      userId: `user-${faker.number.int({ min: 1, max: 25 })}`,
      userName: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 65 }),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      quantity,
      totalPrice: event.price.min * quantity * 1.05,
      bookingDate: faker.date.recent({ days: 30 }),
      status: faker.helpers.arrayElement(['Confirmed', 'Pending', 'Cancelled']),
    });
  }

  // Add some flagged bookings
  const duplicateEvent = faker.helpers.arrayElement(mockEvents);
  bookings.push({ ...bookings[0], id: 'booking-duplicate-1', flag: 'Potential Duplicate' });
  bookings.push({ ...bookings[0], id: 'booking-duplicate-2', bookingDate: new Date(bookings[0].bookingDate.getTime() + 1000), flag: 'Potential Duplicate' });
  bookings.push({ ...bookings[5], id: 'booking-high-volume', quantity: 15, totalPrice: bookings[5].totalPrice * 3, flag: 'High Volume' });
  const irregularTimeBooking = { ...bookings[10], id: 'booking-irregular-time', flag: 'Irregular Time' };
  irregularTimeBooking.bookingDate.setHours(3); // 3 AM booking
  bookings.push(irregularTimeBooking);

  return bookings.sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime());
};
