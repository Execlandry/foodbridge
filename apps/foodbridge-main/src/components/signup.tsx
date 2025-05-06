import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/use-auth";
import { UserContext, UserContextType } from "../hooks/user-context";
import { Link } from "react-router-dom";
import { ExternalApis } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const { signupUser, loginUser } = useAuth(); // Uncommented and assuming it exists
  const { user } = useContext(UserContext) as UserContextType;
  const [profile, setProfile] = useState<File | string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setname] = useState("");
  const [mobno, setmobno] = useState("");
  const [street, setstreet] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [country, setcountry] = useState("");
  const [pincode, setpincode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [showAddressForm, setShowAddressForm] = useState(false);

  // const handleSignup = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await signupUser({
  //       email: email,
  //       first_name: firstName,
  //       last_name: lastName,
  //       password: password,
  //     });
  //     loginUser({ email, password });
  //     // navigate("/"); // Navigate to home page on successful signup
  //   } catch (error) {
  //     console.error("Signup failed:", error);
  //     // Add error handling UI here if needed
  //   }
  // };

  // const handleSignup = (e: any) => {
  //   e.preventDefault();
  //   setShowAddressForm(true);
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile(file);
    }
  };

  const GoogleSignup = () => {
    window.open(
      `http://localhost:3001/api/v1/auth-service/auth/google`,
      "_self"
    );
  };

  const handleAddressSubmit = async (e: any) => {
    e.preventDefault();

    // const coords = await Coordinates({name,street,city,state,country,pincode});
    // console.log("coords",coords);
    let bannerUrl = "";
    if (profile instanceof File) {
      bannerUrl = await ExternalApis.uploadImage(profile);
    } else if (typeof profile === "string") {
      bannerUrl = profile;
    } else {
      throw new Error("No valid banner image provided");
    }

    const fullData = {
      firstName,
      lastName,
      email,
      mobno,
      password,
      name,
      address: {
        street,
        city,
        state,
        country,
        pincode,
      },
    };
    const updatedFormData = {
      ...fullData,
      // latitude: coords?.lat ,
      // longitude: coords?.long,
      picture_url: bannerUrl,
    };

    console.log("Updated form data:", updatedFormData);
    // console.log(coords?.lat ,coords?.long)

    setFirstName("");
    setEmail("");
    setLastName("");
    setPassword("");
    setProfile("");
    setcity("");
    setcountry("");
    setpincode("");
    setname("");
    setstate("");
    setstreet("");
    setmobno("");
    console.log("Submitted Data:", fullData);

    await sendData(updatedFormData);

    // Submit this to backend
  };

  const sendData = async (Data: any) => {
    const address = {
      name: Data.address.name,
      street: Data.address.street,
      city: Data.address.city,
      state: Data.address.state,
      country: Data.address.country,
      pincode: Data.address.pincode,
      lat: String(Data.latitude),
      long: String(Data.longitude),
    };
    await signupUser({
      email: Data.email,
      first_name: Data.firstName,
      last_name: Data.lastName,
      password: Data.password,
      name: Data.name,
      picture_url: Data.picture_url,
      mobno: Data.mobno,
    });
    await loginUser({ email: Data.email, password: Data.password });
    // await ExternalApis.createAddress(address);
    navigate("/fbe/business");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg transform transition-all hover:shadow-xl duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 tracking-tight">
            Join FoodBridge
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        {/* <form className="space-y-6" onSubmit={handleSignup}>
          <div className="space-y-5">
            <div className="relative">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 peer"
                required
              />
              <label className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 peer-focus:text-green-500">
                First Name
              </label>
            </div>

            <div className="relative">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 peer"
                required
              />
              <label className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 peer-focus:text-green-500">
                Last Name
              </label>
            </div>

            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 peer"
                required
              />
              <label className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 peer-focus:text-green-500">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 peer"
                required
              />
              <label className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all duration-200 peer-focus:text-green-500">
                Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-200 focus:outline-none transform transition-all duration-200 hover:-translate-y-0.5"
          >
            Sign Up
          </button>
        </form> */}

        <div className="relative w-full max-w-md mx-auto ">
          <form
            className={`w-fit space-y-6 bg-white p-6 rounded-lg shadow flex transition-transform duration-500 ${
              showAddressForm ? "bloack" : "block"
            }`}
            onSubmit={handleAddressSubmit}
          >
            <div className="space-y-5 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Sign Up</h2>

              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  type="text"
                  placeholder="Charity Name"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Charity Name
                </label>
              </div>

              <div className="relative">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  First Name
                </label>
              </div>

              <div className="relative">
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Last Name
                </label>
              </div>
              <input
                type="file"
                id="banner"
                name="Profile Pic"
                accept="image/*"
                onChange={handleFileChange}
                className="pl-10 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />

              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  value={mobno}
                  onChange={(e) => setmobno(e.target.value)}
                  type="text"
                  placeholder="Mobile Number"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Mobile Number
                </label>
              </div>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Password
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Submit
              </button>

              <div className="text-center mt-4">
                <Link
                  to="/signin"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </form>

          {/* Step 2: Address Form */}
          {/* <form
            className={`space-y-6  w-full ${
              showAddressForm ? "block" : "hidden"
            }`}
            onSubmit={handleAddressSubmit}
          >
            <div className="space-y-5 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Address Details</h2>

              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  type="text"
                  placeholder="Landmark"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Landmark
                </label>
              </div>

              <div className="relative">
                <input
                  value={street}
                  onChange={(e) => setstreet(e.target.value)}
                  type="text"
                  placeholder="Street"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Street
                </label>
              </div>

              <div className="relative">
                <input
                  value={city}
                  onChange={(e) => setcity(e.target.value)}
                  type="text"
                  placeholder="City"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  City
                </label>
              </div>

              <div className="relative">
                <input
                  value={state}
                  onChange={(e) => setstate(e.target.value)}
                  type="text"
                  placeholder="State"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  State
                </label>
              </div>

              <div className="relative">
                <input
                  value={country}
                  onChange={(e) => setcountry(e.target.value)}
                  type="text"
                  placeholder="Country"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Country
                </label>
              </div>

              <div className="relative">
                <input
                  value={pincode}
                  onChange={(e) => setpincode(e.target.value)}
                  type="text"
                  placeholder="Pincode"
                  required
                  className="peer w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
                <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500 peer-focus:text-green-500">
                  Pincode
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Complete Signup
              </button>
            </div>
          </form> */}
        </div>

        {/* Signin Link */}
        <div className="text-center mt-4">
          <Link
            to="/signin"
            className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>

        {/* Divider */}
        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div> */}

        {/* Google Sign Up */}
        {/* <button
          onClick={GoogleSignup}
          className="w-full flex items-center justify-center py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.07 7.57 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.57 1 4.01 3.93 2.18 7.07L5.84 9.9c.87-2.6 3.30-4.52 6.16-4.52z"
            />
          </svg>
          Sign up with Google
        </button> */}
      </div>
    </main>
  );
}
