import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { SearchIcon } from "@heroicons/react/outline";

import delivery_bike_icon from "../../assets/banner/2.png";
import banner_image_spags from "../../assets/banner/1.jpeg";
import { UserContext, UserContextType } from "../../hooks/user-context";
import MapComponent from "./RouteDisplay";
import {
  UserAddressSelector,
  createAddress,
  fetchAddress,
  selectAddress,
  selectedUserAddressSelector,
} from "../../redux/user/user.slice";
import {
  CartItemsSelector,
  EmptyCart,
  fetchCartItems,
  removeCartItems
} from "../../redux/cart/cart.slice";
import { PlaceOrder } from "../../redux/order/order.slice";
import {
  fetchDishesForLandingPage,
  listDishesForLandingPage,
  UpdateDishStatus,
} from "../../redux/dishes/dishes.slice";

// Interface definitions
interface MenuItems {
  description: string;
  food_type: string;
  id: string;
  name: string;
  status: string;
  thumbnails: string;
  expires_at: string;
}

interface Business {
  banner: string;
  closes_at: string;
  contact_no: string;
  cuisine: string;
  description: string;
  id: string;
  is_available: boolean;
  latitude: string;
  longitude: string;
  name: string;
  owner_id: string;
}

interface Cart {
  business: Business;
  business_id: string;
  id: string;
  user_id: string;
  menu_items: MenuItems[];
}

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
          <img
            src={delivery_bike_icon}
            alt="Delivery Bike"
            className="w-48 h-44 rounded-l-2xl"
          />
          <div className="flex flex-col items-center justify-center">
            <p className="text-md font-bold">Hello User</p>
            <p className="text-center mt-2">
              <span className="text-gray-500">purchase Surplus food items </span>
              <span className="text-orange-400 font-bold pl-1">
                {" "}
                available for donations{" "}
              </span>
              <span className="text-gray-500"> with delivery service</span>
            </p>
            <button className="text-white h-10 mt-3 bg-gradient-to-r from-orange-500 to-orange-500 rounded-3xl px-10">
              Learn More
            </button>
          </div>
          <img
            src={banner_image_spags}
            alt="Spaghetti"
            className="w-36 h-44 rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext) as UserContextType;
  const { data: addresses } = useSelector(UserAddressSelector);
  const { data } = useSelector(listDishesForLandingPage);
  const selectedAddress = useSelector(selectedUserAddressSelector);
  const { data: menuItem } = useSelector(CartItemsSelector);
  const amount_per_km = 10;
  const [srclat, setSrclat] = useState("");
  const [srclong, setSrclong] = useState("");
  const [checked, setChecked] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Cart | null>(null);
  const [requestForDriver, setRequestForDriver] = useState<boolean[]>([]);
  const [calculateDistance, setCalculateDistance] = useState<number[]>([]);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const [formData, setFormData] = useState({
    city: "delhi",
    state: "delhi",
    lat: "12",
    long: "11",
    country: "INDIA",
    pincode: "6789876",
    street: "street",
    name: "45/11 Vira Path Gurgaon",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRouteDistance = async (
  fromLatLng: [number, number],
  toLatLng: [number, number]
): Promise<number> => {
  console.log(`Calculating distance from: [${fromLatLng}] to [${toLatLng}]`);
  
  try {
    // Validate input coordinates
    if (!isValidCoordinate(fromLatLng[0]) || !isValidCoordinate(fromLatLng[1]) ||
        !isValidCoordinate(toLatLng[0]) || !isValidCoordinate(toLatLng[1])) {
      console.error("Invalid coordinates provided:", { fromLatLng, toLatLng });
      return 5; // Return default distance of 5km if coordinates are invalid
    }
    
    return new Promise((resolve) => {
      // Create a hidden container for the map if it doesn't exist
      let mapContainer = document.getElementById("hidden-map-container");
      if (!mapContainer) {
        mapContainer = document.createElement("div");
        mapContainer.id = "hidden-map-container";
        mapContainer.style.width = "400px";
        mapContainer.style.height = "400px";
        mapContainer.style.visibility = "hidden";
        mapContainer.style.position = "absolute";
        mapContainer.style.zIndex = "-1000";
        document.body.appendChild(mapContainer);
      }

      // Set up timeout for the entire process
      const globalTimeout = setTimeout(() => {
        console.warn("Distance calculation timed out, falling back to haversine distance");
        const distance = calculateHaversineDistance(
          fromLatLng[0], fromLatLng[1],
          toLatLng[0], toLatLng[1]
        );
        resolve(distance);
      }, 12000);

      // Create the Leaflet map
      try {
        const tempMap = L.map(mapContainer).setView(
          [fromLatLng[0], fromLatLng[1]],
          13
        );

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(tempMap);

        // Set up timeout for routing requests
        const routingTimeout = setTimeout(() => {
          console.warn("Routing request timed out");
          try {
            tempMap.remove();
          } catch (e) {
            console.error("Error removing map:", e);
          }
          
          // Calculate straight-line distance as fallback
          const distance = calculateHaversineDistance(
            fromLatLng[0], fromLatLng[1],
            toLatLng[0], toLatLng[1]
          );
          clearTimeout(globalTimeout);
          resolve(distance);
        }, 8000);

        try {
          // Create routing control with error handling
          const control = L.Routing.control({
            waypoints: [
              L.latLng(fromLatLng[0], fromLatLng[1]),
              L.latLng(toLatLng[0], toLatLng[1]),
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            fitSelectedRoutes: false,
            show: false,
            router: L.Routing.osrmv1({
              serviceUrl: "https://router.project-osrm.org/route/v1",
              profile: "car",
              useHints: false,
            }),
          }).addTo(tempMap);

          // Handle successful route
          control.on("routesfound", function (e) {
            clearTimeout(routingTimeout);
            clearTimeout(globalTimeout);
            
            const routes = e.routes;
            if (!routes || routes.length === 0) {
              console.warn("No routes found, using haversine distance");
              const distance = calculateHaversineDistance(
                fromLatLng[0], fromLatLng[1],
                toLatLng[0], toLatLng[1]
              );
              resolve(distance);
            } else {
              const shortest = routes.reduce((prev: any, curr: any) =>
                curr.summary.totalDistance < prev.summary.totalDistance ? curr : prev
              );
              const distanceInKm = shortest.summary.totalDistance / 1000;
              console.log(`Route found: ${distanceInKm.toFixed(2)}km`);
              resolve(distanceInKm);
            }
            
            try {
              control.remove();
              tempMap.remove();
            } catch (e) {
              console.error("Error cleaning up map:", e);
            }
          });

          // Handle errors
          control.on("routingerror", function (err) {
            clearTimeout(routingTimeout);
            clearTimeout(globalTimeout);
            console.error("Routing error:", err);
            
            // Calculate straight-line distance as fallback
            const distance = calculateHaversineDistance(
              fromLatLng[0], fromLatLng[1],
              toLatLng[0], toLatLng[1]
            );
            resolve(distance);
            
            try {
              control.remove();
              tempMap.remove();
            } catch (e) {
              console.error("Error cleaning up map after error:", e);
            }
          });
        } catch (e) {
          clearTimeout(routingTimeout);
          clearTimeout(globalTimeout);
          console.error("Error setting up routing:", e);
          
          // Calculate straight-line distance as fallback
          const distance = calculateHaversineDistance(
            fromLatLng[0], fromLatLng[1],
            toLatLng[0], toLatLng[1]
          );
          resolve(distance);
          
          try {
            tempMap.remove();
          } catch (mapErr) {
            console.error("Error removing map:", mapErr);
          }
        }
      } catch (e) {
        clearTimeout(globalTimeout);
        console.error("Error creating map:", e);
        
        // Calculate straight-line distance as fallback
        const distance = calculateHaversineDistance(
          fromLatLng[0], fromLatLng[1],
          toLatLng[0], toLatLng[1]
        );
        resolve(distance);
      }
    });
  } catch (e) {
    console.error("Unhandled error in getRouteDistance:", e);
    return 5; // Return default distance of 5km
  }
};


  // Validate if coordinate is a valid number and within reasonable range
  function isValidCoordinate(coord: any): boolean {
    if (typeof coord !== 'number') return false;
    if (isNaN(coord)) return false;
    return Math.abs(coord) <= 180; // Basic coordinate range check
  }

  // Haversine formula to calculate straight-line distance
  function calculateHaversineDistance(
    lat1: number, lon1: number, 
    lat2: number, lon2: number
  ): number {
    function toRad(value: number) {
      return value * Math.PI / 180;
    }
    
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    console.log(`Calculated haversine distance: ${distance.toFixed(2)}km`);
    return distance;
  }

  const OrderPlace = () => {
  if (!menuItem || !Array.isArray(menuItem) || menuItem.length === 0) {
    console.error("No menu items to order");
    return;
  }
  
  if (!addresses || addresses.length === 0) {
    console.error("No delivery address selected");
    alert("Please select a delivery address before placing an order");
    return;
  }
  
  try {
    let ordersPlaced = 0;
    
    menuItem.forEach((value: any, index: number) => {
      if (!value || !value.menu_items || !Array.isArray(value.menu_items) || value.menu_items.length === 0) {
        console.warn(`Cart at index ${index} has no menu items`);
        return;
      }
      
      if (!value.business) {
        console.warn(`Cart at index ${index} has no business data`);
        return;
      }
      
      const distance = calculateDistance[index] || 5; // Default to 5km if distance not calculated
      const amount = (distance * amount_per_km).toFixed(2);
      // console.log("amount", String(amount));
      
      dispatch(
        PlaceOrder({
          user: user,
          business: value.business,
          driver_id: "",
          driver: {},
          address: addresses[0],
          request_for_driver: requestForDriver[index] || false,
          amount: String(amount),
          menu_items: value.menu_items,
        })
      );
      
      updateStatus(value.business.id, value.menu_items);
      ordersPlaced++;
    });
    
    if (ordersPlaced > 0) {
      dispatch(EmptyCart());
      alert(`Successfully placed ${ordersPlaced} order(s)`);
    } else {
      alert("No valid orders to place");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an error placing your order. Please try again.");
  }
};

  const updateStatus = (id: string, menuItems: MenuItems[]) => {
    for (const item of menuItems) {
      dispatch(UpdateDishStatus({ id, item }));
    }
  };

  const handleDriverUpdate = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedArray = [...requestForDriver];
    updatedArray[index] = e.target.checked;
    setRequestForDriver(updatedArray);
  };

  async function coordinates(addressObj: any) {
    const { name, street, city, state, country, pincode } = addressObj;

    // Merge address into a single encoded string
    const address = `${name},+${street},+${city},+${state},+${country},${pincode}`;

    // Construct the API URL
    const apiKey = "pk.00118eabe58a823ba3c1eddccba9eda9";
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${address}&format=json`;

    // Set a timeout of 5 seconds using AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "foodbridge-main",
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No coordinates found for the given address");
      }

      return {
        lat: data[0].lat,
        long: data[0].lon,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.error("Fetch timed out.");
      } else {
        console.error("Error fetching coordinates:", error.message);
      }
      return null;
    }
  }

  const selectUserAddress = (address: any) => {
  if (!address) {
    console.warn("No address provided to select");
    return;
  }
  
  try {
    dispatch(selectAddress(address));
    
    // Verify lat/long values are present and valid
    if (address.lat && address.long && 
        !isNaN(parseFloat(address.lat)) && !isNaN(parseFloat(address.long))) {
      
      setSrclat(address.lat);
      setSrclong(address.long);
      
      // Only trigger distance calculation if we have menu items
      if (menuItem && Array.isArray(menuItem) && menuItem.length > 0 && !isCalculatingDistance) {
        addDistance(menuItem);
      }
    } else {
      console.warn("Selected address has invalid coordinates:", address);
    }
  } catch (error) {
    console.error("Error selecting address:", error);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = await coordinates(formData);

    let updatedFormData = formData;

    if (value) {
      updatedFormData = {
        ...formData,
        lat: value.lat,
        long: value.long,
      };
      setFormData(updatedFormData);
    }

    if (user?.id) {
      await dispatch(createAddress({ id: user.id, formdata: updatedFormData }));
      await dispatch(fetchAddress(user.id));
      setShowModal(false);
    }
  };
  
  const addNFalseValues = (n: number) => {
  if (n <= 0) {
    console.warn("Invalid number of items:", n);
    return;
  }
  
  try {
    const newValues = new Array(n).fill(false);
    const newDistance = new Array(n).fill(5); // Initialize with default 5km distance
    
    setRequestForDriver((prev) => {
      // Only add if there's not enough values already
      if (!Array.isArray(prev)) {
        return newValues;
      }
      
      if (prev.length >= n) {
        return prev;
      }
      
      return [...prev, ...newValues.slice(0, n - prev.length)];
    });
    
    setCalculateDistance((prev) => {
      if (!Array.isArray(prev)) {
        return newDistance;
      }
      
      if (prev.length >= n) {
        return prev;
      }
      
      return [...prev, ...newDistance.slice(0, n - prev.length)];
    });
  } catch (error) {
    console.error("Error initializing arrays:", error);
    
    // Ensure default values are set in case of error
    setRequestForDriver(new Array(n).fill(false));
    setCalculateDistance(new Array(n).fill(5));
  }
};
  const checkForAvailability = () => {
    if (!menuItem || !Array.isArray(menuItem) || !Array.isArray(filterAvailable) || !checked) {
      return;
    }

    menuItem.forEach((cart: any) => {
      if (cart.menu_items && Array.isArray(cart.menu_items)) {
        cart.menu_items.forEach((item: any) => {
          if (!filterAvailable.includes(item.id)) {
            dispatch(
              removeCartItems({
                business: cart.business,
                business_id: cart.business_id,
                menu_item: {
                  name: item.name,
                  description: item.description,
                  status: item.status,
                  food_type: item.food_type,
                  thumbnails: item.thumbnails,
                  id: item.id,
                },
              })
            );
          }
        });
      }
    });
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAddress(user.id));
      dispatch(fetchCartItems());
      dispatch(fetchDishesForLandingPage());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!data?.foodHolder || !Array.isArray(data.foodHolder)) {
      return;
    }

    const availableIds: string[] = [];

    const hasAvailableDishes = data.foodHolder.some((dish: any) => {
      if (!dish || typeof dish !== 'object') return false;

      if (dish.expires_at && new Date() > new Date(dish.expires_at)) {
        return false;
      }

      if (dish.status === "available" && dish.id) {
        availableIds.push(dish.id.toString());
        return true;
      }

      return false;
    });

    if (hasAvailableDishes) {
      setFilterAvailable(availableIds);
      setChecked(true);
    } else {
      alert("No available dishes found. Redirecting to business selection.");
      navigate("/fbe/business");
    }
  }, [data, navigate]);

  // Add map initialization effect
  useEffect(() => {
  // Load Leaflet map scripts and prepare environment
  const setupMapEnvironment = () => {
    // Create a hidden container that will be used for map initialization
    let mapContainer = document.getElementById("map-init-container");
    if (!mapContainer) {
      mapContainer = document.createElement("div");
      mapContainer.id = "map-init-container";
      mapContainer.style.width = "400px";
      mapContainer.style.height = "400px";
      mapContainer.style.visibility = "hidden";
      mapContainer.style.position = "absolute";
      mapContainer.style.zIndex = "-1000";
      document.body.appendChild(mapContainer);
      
      // Initialize a map to ensure the Leaflet library is properly loaded
      try {
        const initMap = L.map(mapContainer).setView([20, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(initMap);
        
        // Clean up after initialization
        setTimeout(() => {
          try {
            initMap.remove();
            console.log("Map environment initialized successfully");
            setMapReady(true);
          } catch (e) {
            console.error("Error cleaning up initialization map:", e);
            setMapReady(true); // Still mark as ready to avoid blocking the app
          }
        }, 1000);
      } catch (e) {
        console.error("Error initializing map environment:", e);
        // Still mark as ready to avoid blocking the app
        setMapReady(true);
      }
    } else {
      // Map container already exists, consider it ready
      setMapReady(true);
    }
  };
  
  // Only set up map environment once
  if (!mapReady) {
    setupMapEnvironment();
  }
  
  // Cleanup function to remove map container on component unmount
  return () => {
    const mapContainer = document.getElementById("map-init-container");
    const hiddenMapContainer = document.getElementById("hidden-map-container");
    
    if (mapContainer) {
      try {
        document.body.removeChild(mapContainer);
      } catch (e) {
        console.error("Error removing map container:", e);
      }
    }
    
    if (hiddenMapContainer) {
      try {
        document.body.removeChild(hiddenMapContainer);
      } catch (e) {
        console.error("Error removing hidden map container:", e);
      }
    }
  };
}, [mapReady]);

  useEffect(() => {
    if (menuItem && Array.isArray(menuItem)) {
      addNFalseValues(menuItem.length);
      
      if (addresses?.[0]?.lat && addresses[0]?.long) {
        setSrclat(addresses[0].lat);
        setSrclong(addresses[0].long);
        addDistance(menuItem);
      }
    }
  }, [menuItem, addresses]);

  useEffect(() => {
    if (checked) {
      // checkForAvailability();
    }
  }, [checked, filterAvailable, menuItem]);

  const addDistance = async (menuItem: any) => {
  if (!Array.isArray(menuItem) || !addresses || !addresses[0] || !mapReady) {
    console.log("Cannot calculate distances: missing required data or map not ready");
    return;
  }
  
  if (isCalculatingDistance) {
    console.log("Distance calculation already in progress");
    return;
  }
  
  setIsCalculatingDistance(true);
  console.log("Starting distance calculations...");
  
  try {
    const updatedArray = [...calculateDistance];
    
    // Ensure we have enough elements in the array
    while (updatedArray.length < menuItem.length) {
      updatedArray.push(5); // Add default 5km distances
    }

    // Process each item sequentially to avoid overloading the routing service
    for (let index = 0; index < menuItem.length; index++) {
      const value = menuItem[index];
      
      if (!value || !value.business) {
        console.warn(`No business data for item at index ${index}`);
        updatedArray[index] = 5; // Set default distance
        continue;
      }
      
      if (value.business.latitude && value.business.longitude) {
        try {
          // Parse coordinates, handle potential parsing errors
          const businessLat = parseFloat(value.business.latitude);
          const businessLng = parseFloat(value.business.longitude);
          const addressLat = parseFloat(addresses[0].lat);
          const addressLng = parseFloat(addresses[0].long);
          
          // Validate coordinates before calculating
          if (isNaN(businessLat) || isNaN(businessLng) || isNaN(addressLat) || isNaN(addressLng)) {
            console.warn("Invalid coordinates detected, using default distance");
            updatedArray[index] = 5; // Set default 5km distance
            continue;
          }
          
          const distance = await getRouteDistance(
            [businessLat, businessLng],
            [addressLat, addressLng]
          );
          
          // Ensure distance is reasonable (between 0.5 and 50 km)
          if (distance < 0.5) {
            updatedArray[index] = 0.5; // Minimum delivery distance
          } else if (distance > 50) {
            updatedArray[index] = 50; // Maximum delivery distance
          } else {
            updatedArray[index] = distance;
          }
          
          console.log(`Distance for business ${value.business.name}: ${updatedArray[index]} km`);
        } catch (error) {
          console.error(`Error calculating distance for index ${index}:`, error);
          updatedArray[index] = 5; // Set default 5km distance on error
        }
      } else {
        console.warn(`Business at index ${index} missing valid coordinates`);
        updatedArray[index] = 5; // Set default distance
      }
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log("Finished distance calculations:", updatedArray);
    setCalculateDistance(updatedArray);
  } catch (err) {
    console.error("Error in distance calculation:", err);
  } finally {
    setIsCalculatingDistance(false);
  }
};


  return (
    <>
      <TopSection />
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full space-y-8">
              {/* Account Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 w-full">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome Back
                  </h1>
                  <div className="flex items-center gap-4 text-lg">
                    <span className="text-gray-700 font-medium">User</span>
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
              </div>

              {/* Delivery Address Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Delivery Address
                </h1>
                {user && (
                  <div className="space-y-6">
                    <p className="text-gray-600 font-medium">
                      Your saved addresses
                    </p>
                    <div>
                      {/* Existing Addresses */}
                      <div className="space-y-4 w-full">
                        {addresses && addresses.length > 0 ? (
                          addresses.map((address: any) => (
                            <div
                              key={address.id}
                              className={`p-4 rounded-lg border-2 ${
                                selectedAddress?.id === address.id
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
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
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {address.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {address.street}, {address.city},{" "}
                                    {address.state} {address.pincode},{" "}
                                    {address.country}
                                  </p>
                                  <button
                                    onClick={() => selectUserAddress(address)}
                                    className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                  >
                                    Select Address
                                  </button>
                                  <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                  >
                                    Change Address
                                  </button>
                                </div>
                              </div>

                              {address.lat && address.long && (
                                <div className="mt-4 w-full h-64">
                                  <iframe
                                    title="Address Location"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight={0}
                                    marginWidth={0}
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                                      parseFloat(address.long) - 0.01
                                    }%2C${parseFloat(address.lat) - 0.01}%2C${
                                      parseFloat(address.long) + 0.01
                                    }%2C${
                                      parseFloat(address.lat) + 0.01
                                    }&layer=mapnik&marker=${parseFloat(
                                      address.lat
                                    )}%2C${parseFloat(address.long)}`}
                                    className="rounded-lg border"
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <button
                            onClick={() => setShowModal(true)}
                            className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Create Address
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex flex-row gap-4 justify-around flex-wrap">
                  {Array.isArray(menuItem) &&
                    menuItem.map(
                      (cart: Cart, index: number) =>
                        // Only render if menu_items exist and are not empty
                        Array.isArray(cart.menu_items) &&
                        cart.menu_items.length > 0 && (
                          <div
                            key={index}
                            className="p-5 border border-gray-300 rounded-xl bg-gray-50 m-5 max-w-md"
                          >
                            <h2 className="font-bold text-xl mb-3">{cart.business.name}</h2>

                            {cart.business.banner && (
                              <img
                                src={cart.business.banner}
                                alt="Business Banner"
                                className="w-full rounded-lg mb-4 object-cover h-48"
                              />
                            )}

                            <p className="mb-2">
                              <strong>Description:</strong>{" "}
                              {cart.business.description}
                            </p>
                            <p className="mb-2">
                              <strong>Contact Number:</strong>{" "}
                              {cart.business.contact_no}
                            </p>
                            <p className="mb-2">
                              <strong>Available:</strong>{" "}
                              {cart.business.is_available ? "Yes" : "No"}
                            </p>
                            
                            <h3 className="font-semibold text-lg mt-6 mb-3">Menu Items</h3>

                            {cart.menu_items.map(
                              (dish: MenuItems, dishIndex: number) => (
                                <div
                                  key={dishIndex}
                                  className="border border-gray-200 p-4 rounded-lg mb-4 bg-white shadow-sm"
                                >
                                  <h4 className="font-medium mb-2">{dish.name}</h4>
                                  {dish.thumbnails && (
                                    <img
                                      src={dish.thumbnails}
                                      alt={dish.name}
                                      className="w-full rounded-md mb-3 h-36 object-cover"
                                    />
                                  )}
                                  <p className="text-sm mb-1">
                                    <strong>Food Type:</strong> {dish.food_type}
                                  </p>
                                  <p className="text-sm mb-1">
                                    <strong>Status:</strong> {dish.status}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Description:</strong>{" "}
                                    {dish.description}
                                  </p>
                                </div>
                              )
                            )}
                            <div className="flex items-center gap-2 mt-4 mb-3">
                              <label htmlFor={`driver-${index}`} className="font-medium">Request For Driver:</label>
                              <input
                                id={`driver-${index}`}
                                type="checkbox"
                                onChange={handleDriverUpdate(index)}
                                onClick={() => setSelectedOrder(cart)}
                                className="h-5 w-5"
                              />
                            </div>
                            {calculateDistance[index] !== undefined && (
                              <div className="mt-2 font-semibold text-green-700">
                                Delivery Amount: ₹{(calculateDistance[index] * amount_per_km).toFixed(2)}
                              </div>
                            )}
                          </div>
                        )
                    )}
                </div>

                <button 
                  onClick={OrderPlace}
                  className="mx-auto mt-6 bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 font-medium text-lg transition-colors"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {addresses && addresses.length > 0 ? "Change Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {["name", "street", "city", "state", "pincode"].map((field) => (
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
                {addresses && addresses.length > 0 ? "Change Address" : "Add Address"}
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
      
      {selectedOrder && (
        <MapComponent
          orderCoordinates={{
            lat: parseFloat(selectedOrder.business.latitude),
            lng: parseFloat(selectedOrder.business.longitude),
          }}
          geocodedCoords={{
            lat: parseFloat(srclat),
            lng: parseFloat(srclong),
          }}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

export default Checkout;
