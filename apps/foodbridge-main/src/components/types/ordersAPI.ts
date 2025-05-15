import { Order } from './Orders';

// Mock data for demonstration purposes
// In a real application, this would fetch from a backend API
export const fetchOrders = async (): Promise<Order[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      user_id: 'user123',
      driver_id: 'driver1',
      driver: {
        id: 'driver1',
        name: 'John Driver',
        phone: '+1234567890'
      },
      business: {
        name: 'Pizza Express',
        address: '123 Main St, New York, NY'
      },
      address: {
        street: '456 Customer St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      request_for_driver: false,
      payment_status: 'success',
      payment_method: 'upi',
      order_status: 'delivered',
      amount: '45.99',
      menu_items: [
        { id: 'item1', name: 'Margherita Pizza', price: 12.99, quantity: 2 },
        { id: 'item2', name: 'Pepsi', price: 2.99, quantity: 1 }
      ]
    },
    {
      id: '2',
      user_id: 'user123',
      driver_id: null,
      driver: null,
      business: {
        name: 'Burger King',
        address: '789 Fast Food Ave, New York, NY'
      },
      address: {
        street: '456 Customer St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      request_for_driver: true,
      payment_status: 'pending',
      payment_method: 'cod',
      order_status: 'pending',
      amount: '29.99',
      menu_items: [
        { id: 'item3', name: 'Whopper', price: 7.99, quantity: 2 },
        { id: 'item4', name: 'French Fries', price: 3.99, quantity: 2 },
        { id: 'item5', name: 'Coke', price: 2.99, quantity: 1 }
      ]
    },
    {
      id: '3',
      user_id: 'user123',
      driver_id: 'driver2',
      driver: {
        id: 'driver2',
        name: 'Mike Transit',
        phone: '+1987654321'
      },
      business: {
        name: 'Sushi Palace',
        address: '555 Asian Blvd, New York, NY'
      },
      address: {
        street: '456 Customer St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      request_for_driver: false,
      payment_status: 'success',
      payment_method: 'upi',
      order_status: 'in_transit',
      amount: '75.50',
      menu_items: [
        { id: 'item6', name: 'California Roll', price: 15.99, quantity: 2 },
        { id: 'item7', name: 'Salmon Nigiri', price: 12.99, quantity: 1 },
        { id: 'item8', name: 'Miso Soup', price: 5.99, quantity: 2 }
      ]
    }
  ];
};