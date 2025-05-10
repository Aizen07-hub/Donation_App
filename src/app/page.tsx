import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Handshake, Truck, ChefHat } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <UtensilsCrossed className="mx-auto h-20 w-20 text-primary mb-6" />
          <h1 className="text-5xl font-bold mb-6 text-primary-foreground bg-primary py-2 px-4 rounded-md inline-block shadow-md">
            Welcome to PlateShare
          </h1>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Connecting restaurants with surplus food to communities in need. Reduce waste, fight hunger, and make a difference, one plate at a time.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-shadow">
              <Link href="/browse">Find Food Donations</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-md hover:shadow-lg transition-shadow">
              <Link href="/create-listing">Share Your Surplus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <h2 className="text-4xl font-semibold text-center mb-12 text-primary">How PlateShare Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <ChefHat className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">1. Restaurants List Surplus</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p>Eateries easily list available food items, quantity, and preferred pickup times through our simple form.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Truck className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">2. Get Pickup Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p>Our smart scheduling AI suggests optimal pickup times based on closing hours and donation size to maximize freshness.</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Handshake className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">3. Communities Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-foreground/70">
              <p>Charities and individuals browse listings and arrange pickups, ensuring good food reaches those who need it.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-secondary/30 rounded-xl shadow-lg">
         <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-semibold mb-8 text-primary">Join the Movement</h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-3xl mx-auto">
            Every meal shared is a step towards a more sustainable and equitable world. PlateShare empowers you to be part of the solution.
          </p>
          <Image 
            src="https://picsum.photos/1200/400?random=1" 
            alt="Community sharing food" 
            width={1200} 
            height={400} 
            className="rounded-lg shadow-md object-cover mx-auto"
            data-ai-hint="community food sharing" 
          />
        </div>
      </section>
    </div>
  );
}
