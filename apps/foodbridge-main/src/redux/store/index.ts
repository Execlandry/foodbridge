import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../auth/auth.slice";
import BusinessReducer from "../business/business.slice";
import DishReducer from "../dishes/dishes.slice";
import CartReducer from "../cart/cart.slice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    business: BusinessReducer,
    dishes: DishReducer,
    cart: CartReducer,
  },
  devTools: true,
});
