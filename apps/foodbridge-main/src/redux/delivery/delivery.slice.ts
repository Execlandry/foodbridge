import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ExternalApis } from "../../api";

export interface ApiData {
  status: "idle" | "pending" | "rejected";
  data: any;
  error: any;
}

interface OrderState {
  delivery: ApiData;
}

export const FetchCurrentOrder = createAsyncThunk(
  "fetch/activeOrder",
  async (id:any) => {
    return ExternalApis.FetchDeliveryOrder(id);
  }
);

const initialState = {
  delivery: {
    status: "idle",
    data: {},
    error: null,
  },
} as OrderState;

export const DeliverySlice = createSlice({
  name: "dishes",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [FetchCurrentOrder.pending.type]: (state: OrderState, action: any) => {
      state.delivery = {
        status: "pending",
        data: {},
        error: null,
      };
    },
    [FetchCurrentOrder.fulfilled.type]: (state: OrderState, action: any) => {
      state.delivery = {
        status: "idle",
        data: action.payload || {},
        error: null,
      };
    },
    [FetchCurrentOrder.rejected.type]: (state: OrderState, action: any) => {
      state.delivery = {
        status: "idle",
        data: {},
        error: action.payload,
      };
    }
  },
});

export const OrderSelector = (state: any) => state.delivery.order;
export default DeliverySlice.reducer;
