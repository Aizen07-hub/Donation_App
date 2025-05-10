'use client';

import { useState, useEffect } from 'react';
import type { Listing } from '@/types';
import ListingCard from '@/components/listings/listing-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const mockListings: Listing[] = [
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

export default function BrowseListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setListings(mockListings);
      setIsLoading(false);
    }, 1500); // Simulate 1.5 second loading
    return () => clearTimeout(timer);
  }, []);

  const filteredListings = listings.filter(listing =>
    (listing.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     listing.foodType.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (foodTypeFilter === 'all' || listing.foodType.toLowerCase().includes(foodTypeFilter.toLowerCase()))
  );

  const foodTypes = ['all', ...new Set(mockListings.map(l => l.foodType.split(' ')[0]))]; // simplified food types

  return (
    <div className="space-y-8">
      <section className="bg-primary/10 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-4">Find Surplus Food Near You</h1>
        <p className="text-foreground/70 mb-6">
          Browse available donations from local restaurants. Help reduce food waste and support your community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground/80 mb-1">Search by Name or Food Type</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="e.g., Pizza Palace or Sandwiches"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="foodType" className="block text-sm font-medium text-foreground/80 mb-1">Filter by Food Category</label>
            <Select value={foodTypeFilter} onValueChange={setFoodTypeFilter}>
              <SelectTrigger id="foodType" className="w-full">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Food Types" />
              </SelectTrigger>
              <SelectContent>
                {foodTypes.map(type => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type === 'all' ? 'All Food Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col h-full">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No listings found matching your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
