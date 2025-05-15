import React from 'react';
import { Order } from '../types/Orders';
import {
  XIcon,
  CheckCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  LocationMarkerIcon,
} from '@heroicons/react/solid';
// import { X } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;
  
  const getStepStatus = (step: string) => {
    const statuses = {
      pending: 0,
      accepted: 1,
      in_transit: 2,
      delivered: 3
    };
    
    const currentStatusValue = statuses[order.order_status as keyof typeof statuses];
    const stepValue = statuses[step as keyof typeof statuses];
    
    if (stepValue < currentStatusValue) return 'completed';
    if (stepValue === currentStatusValue) return 'current';
    return 'upcoming';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div>
  <div className="relative pb-12">
          {/* Vertical line */}
          <div className="absolute left-8 top-2 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2"></div>
          
          {/* Order placed */}
          <div className="relative flex items-start mb-8">
            <div className={`rounded-full h-7 w-7 flex items-center justify-center z-10 ${
              getStepStatus('pending') === 'completed' 
                ? 'bg-green-500 text-white' 
                : getStepStatus('pending') === 'current' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-white'
            }`}>
              {getStepStatus('pending') === 'completed' ? <CheckCircleIcon /> : <ClockIcon  />}
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-800">Order Placed</h4>
              <p className="text-sm text-gray-600">Your order has been received</p>
            </div>
          </div>
          
          {/* Order accepted */}
          <div className="relative flex items-start mb-8">
            <div className={`rounded-full h-7 w-7 flex items-center justify-center z-10 ${
              getStepStatus('accepted') === 'completed' 
                ? 'bg-green-500 text-white' 
                : getStepStatus('accepted') === 'current' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-white'
            }`}>
              {getStepStatus('accepted') === 'completed' ? <CheckCircleIcon /> : <ShoppingBagIcon />}
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-800">Order Accepted</h4>
              <p className="text-sm text-gray-600">Restaurant is preparing your food</p>
            </div>
          </div>
          
          {/* In transit */}
          <div className="relative flex items-start mb-8">
            <div className={`rounded-full h-7 w-7 flex items-center justify-center z-10 ${
              getStepStatus('in_transit') === 'completed' 
                ? 'bg-green-500 text-white' 
                : getStepStatus('in_transit') === 'current' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-white'
            }`}>
              {getStepStatus('in_transit') === 'completed' ? <CheckCircleIcon /> : <LocationMarkerIcon />}
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-800">In Transit</h4>
              <p className="text-sm text-gray-600">
                {order.driver 
                  ? `${order.driver.name} is delivering your order` 
                  : 'Your order is on the way'}
              </p>
            </div>
          </div>
          
          {/* Delivered */}
          <div className="relative flex items-start">
            <div className={`rounded-full h-7 w-7 flex items-center justify-center z-10 ${
              getStepStatus('delivered') === 'completed' 
                ? 'bg-green-500 text-white' 
                : getStepStatus('delivered') === 'current' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-white'
            }`}>
              <CheckCircleIcon />
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-800">Delivered</h4>
              <p className="text-sm text-gray-600">Your order has been delivered</p>
            </div>
          </div>
        </div>
        </div>
      <div 
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {/* <X size={24} /> */}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Business</h3>
            <p className="text-gray-800 font-medium">{order.business.name}</p>
            <p className="text-gray-600">{order.business.address}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Order:</span>
                <span className={`font-medium ${
                  order.order_status === 'delivered' 
                    ? 'text-green-600' 
                    : order.order_status === 'in_transit' 
                      ? 'text-blue-600' 
                      : 'text-yellow-600'
                }`}>
                  {order.order_status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className={`font-medium ${
                  order.payment_status === 'success' 
                    ? 'text-green-600' 
                    : order.payment_status === 'pending' 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium text-gray-800">{order.payment_method.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-800">${order.amount}</span>
              </div>
            </div>
          </div>
          
          {order.driver && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Driver</h3>
              <p className="text-gray-800 font-medium">{order?.driver.name}</p>
              <p className="text-gray-600">{order?.driver.phone}</p>
            </div>
          )}
          
          {order.address && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
              <p className="text-gray-600">{order.address.name}{order.address.street}</p>
              <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.pincode}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Item</th>
                  <th className="px-4 py-2 text-right text-gray-700">Food_type</th>
                  <th className="px-4 py-2 text-right text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-right text-gray-700">Ingredients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.menu_items.map(item => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{item.food_type}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {item.ingredients}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-700">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">${order.amount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;