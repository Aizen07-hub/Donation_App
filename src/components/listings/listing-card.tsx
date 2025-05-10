import Image from 'next/image';
import type { Listing } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Package, Utensils } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

// Helper to get a relevant food icon based on type
const FoodIcon = ({ foodType }: { foodType: string }) => {
  const type = foodType.toLowerCase();
  if (type.includes('pizza')) return <PizzaIcon className="h-5 w-5 text-primary" />;
  if (type.includes('salad') || type.includes('vegetable')) return <SaladIcon className="h-5 w-5 text-primary" />;
  if (type.includes('bakery') || type.includes('bread') || type.includes('cake')) return <CakeSliceIcon className="h-5 w-5 text-primary" />;
  if (type.includes('soup') || type.includes('stew')) return <SoupIcon className="h-5 w-5 text-primary" />;
  return <Utensils className="h-5 w-5 text-primary" />;
};

// Placeholder icons for specific food types (lucide-react doesn't have all)
// Using a few available ones and generic for others
const PizzaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 4v5.5l4.5 2.5"/>
    <path d="M12 12.5L7.5 15"/>
    <path d="M12 12.5l4.5 2.5"/>
    <path d="M12 12.5L7.5 10"/>
  </svg>
);

const SaladIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Lucide 'Salad' or similar
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 21h10"/>
    <path d="M12 11a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5z"/>
    <path d="m6 11 2-9"/>
    <path d="m18 11-2-9"/>
    <path d="M12 2v2"/>
    <path d="M12 16v5"/>
  </svg>
);

const CakeSliceIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Lucide 'CakeSlice'
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m8 10 4-2 4 2"/><path d="M12 13V8"/><path d="M8.15 10.38a2 2 0 0 0-1.04-.44 2 2 0 0 0-2.02 2.6C6.14 15.2 12 17 12 17s5.86-1.8 6.91-4.46a2 2 0 0 0-2.02-2.6 2 2 0 0 0-1.04.44Z"/><path d="M12 17V19.5A1.5 1.5 0 0 1 10.5 21A1.5 1.5 0 0 1 9 19.5V17Z"/></svg>
);

const SoupIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Lucide 'Soup'
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c-2.2 0-4-2-4-3.5C8 15 12 3 12 3s4 12 4 15.5c0 1.5-1.8 3.5-4 3.5Z"/><path d="M6 20h12"/></svg>
);


export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      {listing.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={listing.imageUrl}
            alt={listing.foodType}
            layout="fill"
            objectFit="cover"
            data-ai-hint="food item"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{listing.restaurantName}</CardTitle>
        <CardDescription className="flex items-center text-foreground/70">
          <FoodIcon foodType={listing.foodType} />
          <span className="ml-2">{listing.foodType}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-foreground/90">{listing.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Package className="h-4 w-4 mr-2 text-primary" />
          <span>Quantity: {listing.quantity}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>Pickup: {listing.pickupTime}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <span>{listing.address} {listing.distance && `(${listing.distance})`}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">View Details & Claim</Button>
      </CardFooter>
    </Card>
  );
}
