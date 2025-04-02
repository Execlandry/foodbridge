import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface BusinessState {
  business: any;
  dishes?: any;
  filteredDishes?: any;
  selectedBusiness?: any;
}

const axiosConfig = {
  headers: {
    Accept: "*/*",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MjFmODRmYi0zZTU5LTRmZDMtOGU4NS02YzhkYjJhMjA5NWMiLCJlbWFpbCI6InBlZG5la2FycHJhc2hhbnQzOTlAZ21haWwuY29tIiwiaWF0IjoxNzQzNjA0ODIxLCJleHAiOjE3NDM2OTEyMjF9.wp3zv-DrJ4T_AL8LI2SAIDZDJ36Tcm5_MeoX0Vpgtzw"
  }
};

export const fetchBusinesses = createAsyncThunk(
  "api/fetchBusinessesData",
  async () => {
    const { data } = await axios.get("http://localhost:3000/api/v1/business-service/businesses", axiosConfig);
    return data;
  }
);

export const fetchBusinessById = createAsyncThunk(
  "api/fetchBusinessById",
  async (id: string) => {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/business-service/business/${id}`,
      axiosConfig
    );
    return data;
  }
);

export const filteredBusinesses = createAsyncThunk(
  "api/fetchBusinesses",
  async (filters: string) => {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/business-service/dishes?${filters}&page=1&limit=20`,
      axiosConfig
    );
    return data;
  }
);

export const fetchTopDishes = createAsyncThunk(
  "api/fetchDishes",
  async (filters: string) => {
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/business-service/dishes?${filters}&page=1&limit=10`,
      axiosConfig
    );
    return data;
  }
);

const initialState: BusinessState = {
  business: {
    status: "not-started",
    data: [],
    error: null,
  },
  dishes: {
    status: "not-started",
    data: [],
    error: null,
  },
  filteredDishes: {
    status: "not-started",
    data: [],
    error: null,
  },
  selectedBusiness: {
    status: "not-started",
    data: [],
    error: null,
  },
};

export const BusinessSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [fetchBusinesses.pending.type]: (state: BusinessState) => {
      state.business = {
        status: "pending",
        data: [],
        error: null,
      };
    },
    [fetchBusinesses.fulfilled.type]: (state: BusinessState, action: any) => {
      state.business = {
        status: "resolved",
        data: action.payload,
        error: null,
      };
    },
    [fetchBusinesses.rejected.type]: (state: BusinessState) => {
      state.business = {
        status: "rejected",
        data: [],
        error: null,
      };
    },
    [fetchTopDishes.pending.type]: (state: BusinessState) => {
      state.dishes = {
        status: "pending",
        data: [],
        error: null,
      };
    },
    [fetchTopDishes.fulfilled.type]: (state: BusinessState, action: any) => {
      state.dishes = {
        status: "resolved",
        data: action.payload,
        error: null,
      };
    },
    [fetchTopDishes.rejected.type]: (state: BusinessState) => {
      state.dishes = {
        status: "rejected",
        data: [],
        error: null,
      };
    },
    [filteredBusinesses.pending.type]: (state: BusinessState) => {
      state.filteredDishes = {
        status: "pending",
        data: [],
        error: null,
      };
    },
    [filteredBusinesses.fulfilled.type]: (state: BusinessState, action: any) => {
      state.filteredDishes = {
        status: "resolved",
        data: action.payload,
        error: null,
      };
    },
    [filteredBusinesses.rejected.type]: (state: BusinessState) => {
      state.filteredDishes = {
        status: "rejected",
        data: [],
        error: null,
      };
    },
    [fetchBusinessById.pending.type]: (state: BusinessState) => {
      state.selectedBusiness = {
        status: "pending",
        data: [],
        error: null,
      };
    },
    [fetchBusinessById.fulfilled.type]: (state: BusinessState, action: any) => {
      state.selectedBusiness = {
        status: "resolved",
        data: action.payload,
        error: null,
      };
    },
    [fetchBusinessById.rejected.type]: (state: BusinessState) => {
      state.selectedBusiness = {
        status: "rejected",
        data: [],
        error: null,
      };
    },
  },
});

export const userSelector = (state: any) => state;
export const topBusinesses = (state: any) => state.business.business;
export const filteredDishes = (state: any) => state.business.filteredDishes;
export const topDishes = (state: any) => state.business.dishes;

export default BusinessSlice.reducer;