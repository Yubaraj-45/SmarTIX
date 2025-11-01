export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: Date;
  time: string;
  venue: string;
  city: string;
  country: string;
  image: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  ticketsAvailable: number;
  totalTickets: number;
  organizer: string;
  tags: string[];
  rating: number;
  attendees: number;
  featured: boolean;
  aiScore?: number;
}

export type EventCategory = 
  | 'Music' 
  | 'Sports' 
  | 'Arts & Theatre' 
  | 'Food & Drink' 
  | 'Technology' 
  | 'Business' 
  | 'Comedy' 
  | 'Film';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  available: number;
  total: number;
  benefits: string[];
}

export interface BookingDetails {
  eventId: string;
  ticketTier: string;
  quantity: number;
  totalPrice: number;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  quantity: number;
  totalPrice: number;
  bookingDate: Date;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  flag?: 'Potential Duplicate' | 'High Volume' | 'Irregular Time';
}
