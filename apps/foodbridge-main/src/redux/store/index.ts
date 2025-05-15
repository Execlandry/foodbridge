import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../auth/auth.slice";
import BusinessReducer from "../business/business.slice";
import DishReducer from "../dishes/dishes.slice";
import CartReducer from "../cart/cart.slice";
import UserReducer from "../user/user.slice";
import OrderReducer from "../order/order.slice";
import DeliveryReducer from "../delivery/delivery.slice";

export default configureStore({
  reducer: {
    auth: AuthReducer,
    business: BusinessReducer,
    dishes: DishReducer,
    cart: CartReducer,
    user: UserReducer,
    order: OrderReducer,
    delivery:DeliveryReducer,
  },
  devTools: true,
});
