
'use client';

import { useState, useEffect } from 'react';
import type { Listing } from '@/types';
import ListingCard from '@/components/listings/listing-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { getListings, subscribe } from '@/lib/listings-store';


export default function BrowseListingsPage() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  
  useEffect(() => {
    setAllListings(getListings());
    setIsLoading(false);

    const unsubscribe = subscribe(() => {
      setAllListings(getListings());
    });

    return () => unsubscribe();
  }, []);

  const filteredListings = allListings.filter(listing =>
    (listing.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     listing.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
     listing.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (foodTypeFilter === 'all' || listing.foodType.toLowerCase().includes(foodTypeFilter.toLowerCase()) || 
     (foodTypeFilter !== 'all' && listing.foodType.toLowerCase().startsWith(foodTypeFilter.toLowerCase())))
  );

  const foodTypes = ['all', ...new Set(allListings.map(l => {
    const firstWord = l.foodType.split(' ')[0].replace(/[(),]/g, '').trim();
    return firstWord || l.foodType; // Fallback to full foodType if first word is empty
  }).filter(Boolean))];


  return (
    <div className="space-y-8">
      <section className="bg-primary/10 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-4">Find Surplus Food Near You</h1>
        <p className="text-foreground/70 mb-6">
          Browse available donations from local restaurants. Help reduce food waste and support your community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground/80 mb-1">Search by Name, Food Type, or Description</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="e.g., Pizza Palace, Sandwiches, or Freshly Baked"
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
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters, or check back later for new donations!</p>
        </div>
      )}
    </div>
  );
}
