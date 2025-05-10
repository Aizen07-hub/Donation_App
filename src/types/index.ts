export interface Listing {
  id: string;
  restaurantName: string;
  foodType: string;
  description: string;
  quantity: string; // e.g., "10 meals", "5 kg"
  pickupTime: string; // Could be a suggested time or a window "HH:mm - HH:mm" or "Around HH:mm"
  address: string;
  imageUrl?: string; // For picsum
  distance?: string; // e.g., "0.5 miles"
}

// For AI integration
export type DonationSize = "small" | "medium" | "large";
