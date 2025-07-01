export interface MenuItemDto {
  id: string;
  name: string;
  food_type: string;
  quantity: string;
  ingredients: string;
  status: string;
  description: string;
  thumbnails: string;
  expires_st: string;
}

export interface Business {
  name: string;
  address: any;
  latitude: string;
  longitude: string;
  contact_no: string;
  banner: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  lat: string;
  long: string;
}


export interface Order {
  id: string;
  user_id: string;
  business: Business;
  address: Address | null;
  request_for_driver: boolean;
  amount: string;
  menu_items: MenuItemDto[];
}
