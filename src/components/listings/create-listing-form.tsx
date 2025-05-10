
// src/components/listings/create-listing-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestPickupTime, type SuggestPickupTimeInput, type SuggestPickupTimeOutput } from '@/ai/flows/suggest-pickup-time';
import { suggestFoodDescription, type SuggestFoodDescriptionInput, type SuggestFoodDescriptionOutput } from '@/ai/flows/suggest-food-description';
import { useState, useEffect } from 'react';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DonationSize } from '@/types';
import { addListing, type CreateListingFormData as StoreCreateListingFormData } from '@/lib/listings-store'; 

const foodTypeOptions = [
  "Bakery (Bread, Pastries, Cakes)",
  "Italian (Pizza, Pasta)",
  "Asian (Sushi, Noodles, Rice dishes)",
  "Sandwiches & Salads",
  "Mexican (Tacos, Burritos)",
  "Indian (Curries, Biryani)",
  "Fast Food (Burgers, Fries)",
  "Beverages",
  "Groceries (Canned goods, Produce)",
  "Desserts",
  "Other",
] as const;

const formSchema = z.object({
  restaurantName: z.string().min(2, { message: 'Restaurant name must be at least 2 characters.' }),
  foodType: z.enum(foodTypeOptions, { required_error: "Please select a food type." }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(300, { message: 'Description must be at most 300 characters.'}),
  quantity: z.string().min(1, { message: 'Quantity is required.' }),
  donationSize: z.enum(['small', 'medium', 'large'], { required_error: "Please select donation size."}),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  pickupWindowStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  pickupWindowEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
}).refine(data => {
    if (!data.pickupWindowStart || !data.pickupWindowEnd) return true; 
    return data.pickupWindowStart < data.pickupWindowEnd;
  }, {
  message: "Pickup start time must be before end time.",
  path: ["pickupWindowEnd"],
});

type CreateListingFormData = z.infer<typeof formSchema>;

export default function CreateListingForm() {
  const [isSuggestingTime, setIsSuggestingTime] = useState(false);
  const [suggestedTimeInfo, setSuggestedTimeInfo] = useState<SuggestPickupTimeOutput | null>(null);
  const [isSuggestingDescription, setIsSuggestingDescription] = useState(false);
  const [suggestedDescriptionInfo, setSuggestedDescriptionInfo] = useState<SuggestFoodDescriptionOutput | null>(null);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);


  const form = useForm<CreateListingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: '',
      foodType: undefined,
      description: '',
      quantity: '',
      donationSize: undefined,
      closingTime: '22:00', 
      pickupWindowStart: '',
      pickupWindowEnd: '',
      address: '',
    },
  });

  useEffect(() => {
    if (currentTime) {
        form.resetField('closingTime', { defaultValue: '22:00' }); 
    }
  }, [currentTime, form]);


  async function onSubmit(values: CreateListingFormData) {
    const newListing = addListing(values as StoreCreateListingFormData); 
    console.log('Form submitted, new listing added:', newListing);
    toast({
      title: 'Listing Created!',
      description: `${newListing.foodType} from ${newListing.restaurantName} has been successfully listed.`,
      variant: 'default',
    });
    form.reset();
    setSuggestedTimeInfo(null);
    setSuggestedDescriptionInfo(null);
  }

  async function handleSuggestPickupTime() {
    const { closingTime, donationSize, foodType } = form.getValues();
    if (!closingTime || !donationSize || !foodType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in Closing Time, Donation Size, and Food Type to get a time suggestion.',
        variant: 'destructive',
      });
      return;
    }

    setIsSuggestingTime(true);
    setSuggestedTimeInfo(null);
    try {
      const input: SuggestPickupTimeInput = {
        closingTime,
        donationSize: donationSize as DonationSize, 
        foodType,
      };
      const result = await suggestPickupTime(input);
      setSuggestedTimeInfo(result);
      toast({
        title: 'Pickup Time Suggested!',
        description: `AI suggests picking up around ${result.suggestedPickupTime}.`,
      });
    } catch (error) {
      console.error('Error suggesting pickup time:', error);
      toast({
        title: 'Error Suggesting Time',
        description: 'Could not get an AI suggestion. Please try again or enter manually.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestingTime(false);
    }
  }

  async function handleSuggestDescription() {
    const { foodType, quantity } = form.getValues();
    if (!foodType || !quantity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in Food Type and Quantity to get a description suggestion.',
        variant: 'destructive',
      });
      return;
    }

    setIsSuggestingDescription(true);
    setSuggestedDescriptionInfo(null);
    try {
      const input: SuggestFoodDescriptionInput = { foodType, quantity };
      const result = await suggestFoodDescription(input);
      setSuggestedDescriptionInfo(result);
      toast({
        title: 'Description Suggested!',
        description: 'AI has generated a description for your listing.',
      });
    } catch (error) {
      console.error('Error suggesting description:', error);
      toast({
        title: 'Error Suggesting Description',
        description: 'Could not get an AI suggestion. Please try again or write manually.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestingDescription(false);
    }
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl text-primary">Create a New Food Listing</CardTitle>
        <CardDescription>Fill in the details of the surplus food you want to donate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Green Eatery" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="foodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Type / Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select food type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {foodTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 Pizzas, Approx 10 meals, 2kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Description</FormLabel>
                      <Button
                        type="button"
                        onClick={handleSuggestDescription}
                        disabled={isSuggestingDescription || !form.watch('foodType') || !form.watch('quantity')}
                        variant="outline"
                        size="sm"
                        className="border-accent text-accent hover:bg-accent/10 text-xs"
                      >
                        {isSuggestingDescription ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Lightbulb className="mr-1 h-3 w-3" />
                        )}
                        Suggest Description
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the food items, ingredients, or any special notes (e.g., vegetarian, contains nuts)."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {suggestedDescriptionInfo && (
                <div className="mt-2 p-3 bg-accent/10 border border-accent/30 rounded-md">
                  <p className="font-semibold text-accent-foreground/80 flex items-start text-sm">
                    <Lightbulb className="inline mr-2 h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>AI Suggestion: <span className="italic">"{suggestedDescriptionInfo.suggestedDescription}"</span></span>
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    className="text-accent p-0 h-auto mt-1 text-xs hover:underline"
                    onClick={() => {
                      form.setValue('description', suggestedDescriptionInfo.suggestedDescription, { shouldValidate: true });
                      toast({ title: "Description Applied!", description: `AI suggested description has been filled in.`})
                    }}
                  >
                    Use this description
                  </Button>
                </div>
              )}
            </div>


            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full address for pickup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className="bg-secondary/30 p-6 rounded-lg">
              <CardTitle className="text-xl mb-4 text-primary/90">Scheduling Details</CardTitle>
              <div className="grid md:grid-cols-3 gap-6 items-end">
                 <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restaurant Closing Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donationSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Donation Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Small (1-5 servings)</SelectItem>
                          <SelectItem value="medium">Medium (6-15 servings)</SelectItem>
                          <SelectItem value="large">Large (15+ servings)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={handleSuggestPickupTime}
                  disabled={isSuggestingTime || !form.watch('closingTime') || !form.watch('donationSize') || !form.watch('foodType')}
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent/10"
                >
                  {isSuggestingTime ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                  )}
                  Suggest Pickup Time
                </Button>
              </div>

              {suggestedTimeInfo && (
                <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-md">
                  <p className="font-semibold text-accent-foreground/80 flex items-center">
                    <Lightbulb className="inline mr-2 h-4 w-4 text-accent" />
                    AI Suggestion: Pickup around <span className="text-accent font-bold ml-1">{suggestedTimeInfo.suggestedPickupTime}</span>.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Reasoning: {suggestedTimeInfo.reasoning}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    className="text-accent p-0 h-auto mt-1 hover:underline"
                    onClick={() => {
                      const suggested = suggestedTimeInfo.suggestedPickupTime;
                      const [hours, minutes] = suggested.split(':').map(Number);
                      
                      const startDate = new Date();
                      startDate.setHours(hours, minutes, 0, 0);
                      
                      const endDate = new Date(startDate.getTime() + 30 * 60000); // Add 30 minutes

                      const formatTime = (date: Date) => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                      
                      form.setValue('pickupWindowStart', formatTime(startDate), { shouldValidate: true });
                      form.setValue('pickupWindowEnd', formatTime(endDate), { shouldValidate: true });
                       toast({ title: "Time Applied!", description: `Pickup window set to ${formatTime(startDate)} - ${formatTime(endDate)}.`})
                    }}
                  >
                    Use this time (sets a 30min window)
                  </Button>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <FormField
                  control={form.control}
                  name="pickupWindowStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Pickup Window Start</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pickupWindowEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Pickup Window End</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormDescription className="mt-2 text-sm">
                Set your preferred pickup window or use the AI suggestion. The suggested time can help you set a 30-minute window.
              </FormDescription>
            </Card>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Listing
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
