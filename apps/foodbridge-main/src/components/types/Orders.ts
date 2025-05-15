export interface MenuItemDto {
  id: string;
  name: string;
  food_type:string;
  quantity: string;
  ingredients:string;
  status:string;
  description:string;
  thumbnails:string;
  expires_st:string;
}

export interface Business {
  name: string;
  address: any;
  latitude:string;
  longitude:string;
  contact_no:string;
  banner:string;
}

export interface Address {
  name:string;
  street: string;
  city: string;
  state: string;
  country:string;
  pincode: string;
  lat:string;
  long:string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  location:string;
}

export interface Order {
  id: string;
  user_id: string;
  driver_id: string | null;
  driver: Driver | null;
  business: Business;
  address: Address | null;
  request_for_driver: boolean;
  payment_status: 'pending' | 'success' | 'failed';
  payment_method: 'upi' | 'cod';
  order_status: 'pending' | 'accepted' | 'in_transit' | 'delivered';
  amount: string;
  menu_items: MenuItemDto[];
}