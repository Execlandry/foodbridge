export interface DishCategory {
  id: string;
  name: string;
  description: string;
  category: string;
  food_type: string;
  meal_type: string;
  cuisine_type: string;
  ingredients: string;
  thumbnails: string;
  price: number;
  delivery_time: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Dishes {
  category: DishCategory[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  website_url: string | null;
  social_links: string | null;
  cuisine: string | null;
  average_price: number;
  average_rating: number | null;
  latitude: string;
  longitude: string;
  contact_no: string;
  banner: string;
  delivery_options: string;
  pickup_options: string;
  opens_at: string;
  closes_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_available: boolean;
  dishes: Dishes;
}
