import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ExternalApis } from "../../api";

export interface ApiData {
  status: "idle" | "pending" | "rejected";
  data: any;
  error: any;
}

interface OrderState {
  order: ApiData;
}

export const fetchOrderItems = createAsyncThunk(
  "fetch/activeOrder",
  async () => {
    return ExternalApis.fetchLatestOrder();
  }
);

export const PlaceOrder = createAsyncThunk(
  "fetch/creatOrder",
  async (payload: any) => {
    return ExternalApis.createOrder(payload);
  }
);

export const fetchAllOrders = createAsyncThunk(
  "fetch/activeOrder",
  async () => {
    const data= await ExternalApis.fetchAllOrders();
    console.log(data);
    return data;
  }
);

const initialState = {
  order: {
    status: "idle",
    data: {},
    error: null,
  },
} as OrderState;

export const OrderSlice = createSlice({
  name: "dishes",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [fetchOrderItems.pending.type]: (state: OrderState, action: any) => {
      state.order = {
        status: "pending",
        data: {},
        error: null,
      };
    },
    [fetchOrderItems.fulfilled.type]: (state: OrderState, action: any) => {
      state.order = {
        status: "idle",
        data: action.payload || {},
        error: null,
      };
    },
    [fetchOrderItems.rejected.type]: (state: OrderState, action: any) => {
      state.order = {
        status: "idle",
        data: {},
        error: action.payload,
      };
    },
    [fetchAllOrders.pending.type]: (state: OrderState, action: any) => {
      state.order = {
        status: "pending",
        data: {},
        error: null,
      };
    },
    [fetchAllOrders.fulfilled.type]: (state: OrderState, action: any) => {
      state.order = {
        status: "idle",
        data: action.payload || {},
        error: null,
      };
    },
    [fetchAllOrders.rejected.type]: (state: OrderState, action: any) => {
      state.order = {
        status: "idle",
        data: {},
        error: action.payload,
      };
    },
  },
});

export const OrderItemsSelector = (state: any) => state.order.order;
export default OrderSlice.reducer;
