
'use client';

import type { Listing } from '@/types';
import type { z } from 'zod';

// Define a type for the payload based on an assumed Zod schema from CreateListingForm
// This is a simplified version. Ideally, it would be imported or derived from the actual form schema.
export interface CreateListingFormData {
  restaurantName: string;
  foodType: string;
  description: string;
  quantity: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  address: string;
  // Fields like donationSize, closingTime are used by AI, not directly stored in Listing.
}


let listings: Listing[] = [
  {
    id: '1',
    restaurantName: 'Green Leaf Cafe',
    foodType: 'Salads and Sandwiches',
    description: 'Freshly made salads and assorted sandwiches from today.',
    quantity: 'Approx. 10-12 meals',
    pickupTime: '18:00 - 19:00',
    address: '123 Main St, Anytown',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    distance: '0.5 miles',
  },
  {
    id: '2',
    restaurantName: 'The Daily Bread Bakery',
    foodType: 'Assorted Breads and Pastries',
    description: 'Sourdough, croissants, muffins. Baked fresh this morning.',
    quantity: '2 large boxes',
    pickupTime: '16:30 - 17:30',
    address: '456 Oak Ave, Anytown',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    distance: '1.2 miles',
  },
  {
    id: '3',
    restaurantName: 'Pizza Palace',
    foodType: 'Pepperoni and Veggie Pizzas',
    description: 'Unsold pizzas from the lunch rush, still warm!',
    quantity: '5 large pizzas',
    pickupTime: '19:00 - 20:00 Suggested by AI',
    address: '789 Pine Rd, Anytown',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    distance: '2.5 miles',
  },
   {
    id: '4',
    restaurantName: 'Mama Mia Pasta',
    foodType: 'Pasta Dishes',
    description: 'Generous portions of lasagna and spaghetti bolognese.',
    quantity: 'Approx. 8-10 portions',
    pickupTime: '20:00 - 20:30',
    address: '101 Pasta Ln, Anytown',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    distance: '0.8 miles',
  },
  {
    id: '5',
    restaurantName: 'Sushi Central',
    foodType: 'Sushi Rolls and Nigiri',
    description: 'Variety of sushi rolls and nigiri, made today.',
    quantity: 'About 30-40 pieces',
    pickupTime: '21:00 - 21:30',
    address: '222 Fish St, Anytown',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    distance: '3.1 miles',
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const getListings = (): Listing[] => {
  return [...listings]; // Return a copy to prevent direct mutation
};

export const addListing = (payload: CreateListingFormData): Listing => {
  const newListing: Listing = {
    id: String(Date.now() + Math.random()), // Simple unique ID
    restaurantName: payload.restaurantName,
    foodType: payload.foodType,
    description: payload.description,
    quantity: payload.quantity,
    pickupTime: `${payload.pickupWindowStart} - ${payload.pickupWindowEnd}`,
    address: payload.address,
    imageUrl: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000) + 6}`, // Random image
    distance: `${(Math.random() * 5 + 0.1).toFixed(1)} miles` // Random distance
  };
  listings = [newListing, ...listings]; // Prepend new listing
  notifyListeners();
  return newListing;
};

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener); // Unsubscribe function
  };
};
