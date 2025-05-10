// src/components/claims/claim-form.tsx
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Building } from 'lucide-react';
import type { ClaimantType, ClaimFormData as ClaimFormDataType } from '@/types';

const claimFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  location: z.string().min(5, { message: 'Location/Address must be at least 5 characters.' }),
  phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: 'Please enter a valid phone number (e.g., +1XXXXXXXXXX or XXXXXXXXXX).' }),
  claimantType: z.enum(['individual', 'organisation'], { required_error: 'Please select if you are an individual or an organisation.' }),
});

type FormValues = Omit<ClaimFormDataType, 'listingId' | 'listingRestaurantName'>;

interface ClaimFormProps {
  listingId: string;
  listingRestaurantName: string;
  onClaimSubmitted: () => void;
}

export default function ClaimForm({ listingId, listingRestaurantName, onClaimSubmitted }: ClaimFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      name: '',
      location: '',
      phoneNumber: '',
      claimantType: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    const claimData: ClaimFormDataType = {
      ...values,
      listingId,
      listingRestaurantName,
    };

    // In a real app, you would send this data to a backend
    console.log('Claim submitted:', claimData);

    toast({
      title: 'Claim Submitted!',
      description: `Your request to claim food from ${listingRestaurantName} has been received.`,
      variant: 'default',
    });
    form.reset();
    onClaimSubmitted(); // Close the dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Location / Address for Pickup</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 123 Community Rd, Anytown, or general area for coordination" {...field} />
              </FormControl>
              <FormDescription>
                Provide an address or general location for pickup coordination.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., 555-123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="claimantType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Are you claiming as an individual or an organisation?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 p-2 border rounded-md hover:bg-muted/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary transition-all">
                    <FormControl>
                      <RadioGroupItem value="individual" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center cursor-pointer">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      Individual
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 p-2 border rounded-md hover:bg-muted/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary transition-all">
                    <FormControl>
                      <RadioGroupItem value="organisation" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center cursor-pointer">
                     <Building className="mr-2 h-5 w-5 text-primary" />
                      Organisation
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClaimSubmitted}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Claim
            </Button>
        </div>
      </form>
    </Form>
  );
}
