/*eslint no-constant-condition: 0*/

import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import delivery_bike_icon from '../../assets/banner/2.png';
import banner_image_spags from '../../assets/banner/1.jpeg';
import { loadStripe } from '@stripe/stripe-js';
import { SearchIcon } from '@heroicons/react/outline';
import { UserContext, UserContextType } from '../../hooks/user-context';
import {
  UserAddressSelector,
  createAddress,
  fetchAddress,
  selectAddress,
  selectedUserAddressSelector,
} from '../../redux/user/user.slice';
import { CartItemsSelector, fetchCartItems } from '../../redux/cart/cart.slice';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutCredit from './checkout-credit';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY || '');

export function TopSection() {
  return (
    <div className="max-w-[1400px]">
      <div className="flex flex-row justify-between mr-10">
        <p className="text-2xl mt-4 font-bold">Food is on the way...</p>

        <div className="bg-white h-10 items-center justify-center flex shadow-2xl rounded-3xl">
          <input
            className="w-full ml-5 mr-8 bg-transparent h-full text-gray-700 outline-none"
            id="username"
            type="text"
            placeholder="Search food by name"
          />
          <SearchIcon className="h-8 w-8 text-gray-500 px-1 mr-5" />
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl mt-5 mr-10 shadow-xl">
        <div className="flex flex-row justify-between mt-3">
          <img src={delivery_bike_icon} alt="Delivery Bike" className="w-48 h-44 rounded-l-2xl" />
          <div className="flex flex-col items-center justify-center">
            <p className="text-md font-bold">Hello Jeremy</p>
            <p className="text-center mt-2">
              <span className="text-gray-500">Get free delivery every</span>
              <span className="text-orange-400 font-bold"> $20</span>
              <span className="text-gray-500"> purchase</span>
            </p>
            <button className="text-white h-10 mt-3 bg-gradient-to-r from-orange-500 to-orange-500 rounded-3xl px-10">
              Learn More
            </button>
          </div>
          <img src={banner_image_spags} alt="Spaghetti" className="w-36 h-44 rounded-r-2xl" />
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext) as UserContextType;
  const { data: addresses } = useSelector(UserAddressSelector);
  const selectedAddress = useSelector(selectedUserAddressSelector);
  const { data: menuItem } = useSelector(CartItemsSelector);

  const [formData, setFormData] = useState({
    city: 'delhi',
    state: 'delhi',
    lat: '12',
    long: '11',
    country: 'INDIA',
    pincode: '6789876',
    street: 'street',
    name: '45/11 Vira Path Gurgaon',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectUserAddress = (address: any) => {
    dispatch(selectAddress(address));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createAddress(formData));
    setShowModal(false);
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchAddress());
      dispatch(fetchCartItems());
    }
  }, [user, dispatch]);

  return (
    <>
  <TopSection />
  <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-8">
          {/* Account Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            {user ? (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <div className="flex items-center gap-4 text-lg">
                  <span className="text-gray-700 font-medium">{user.email}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Account</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Login or signup to place your order
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Have an account? <br />
                    <span className="font-bold">Login</span>
                  </button>
                  <button className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                    New here? <br />
                    <span className="font-bold">Signup</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Delivery Address</h1>
            {user && (
              <div className="space-y-6">
                <p className="text-gray-600 font-medium">
                  Your saved addresses
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Existing Addresses */}
                  <div className="space-y-4">
                    {addresses?.map((address:any) => (
                      <div
                        key={address.id}
                        className={`p-4 rounded-lg border-2 ${
                          selectedAddress?.id === address.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } transition-colors`}
                      >
                        <div className="flex items-start gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-500 mt-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                          </svg>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.street}, {address.city}, {address.state} {address.pincode}, {address.country}
                            </p>
                            <button
                              onClick={() => selectUserAddress(address)}
                              className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Deliver Here
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Address */}
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500 mt-1"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Add a new delivery location
                        </p>
                        <button
                          onClick={() => setShowModal(true)}
                          className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Add New
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h1>
            {user && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg">
                  {[
                    { icon: 'M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3', text: 'Wallets' },
                    { icon: 'M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'UPI' },
                    { icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z', text: 'NetBanking' },
                    { icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', text: 'Credit & Debit Cards' },
                    { icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', text: 'Pay on Delivery' },
                  ].map(({ icon, text }) => (
                    <button
                      key={text}
                      className="w-full py-3 px-4 text-left text-gray-700 font-medium hover:bg-white rounded-lg flex items-center gap-3 transition-colors mb-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                      {text}
                    </button>
                  ))}
                </div>
                <div className="md:w-2/3 p-4">
                  <Elements stripe={stripePromise}>
                    <CheckoutCredit address={selectedAddress} cart={menuItem} />
                  </Elements>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add New Address</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {['name', 'street', 'city', 'state', 'pincode'].map((field) => (
            <input
              key={field}
              onChange={handleChange}
              type="text"
              name={field}
              id={field}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 text-sm"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
          ))}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Add Address
          </button>
        </form>
        <div className="p-5 border-t border-gray-200 text-right">
          <button
            onClick={() => setShowModal(false)}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</>
  );
}

export default Checkout;