import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// use ExternalApis -- refactor code
export interface BusinessState {
  dishes?: any;
}
// we will add types in @fbe/types package

export const fetchDishesForLandingPage = createAsyncThunk(
  "api/fetchDishesForLandingPage",
  // make these apis in external service
  // we are hitting proxy
  async () => {
    const data  = await axios.get(
      `http://localhost:3000/api/v1/business-service/dishes?&page=1&limit=50`
    );
    // console.log(data);

    const foodData = data.data.map((item: any) => {
      if(item.status==="available")
      {
        return {
        id: item.id,
        dish_id: item.id,
        name: item.name,
        quantitity:item.quantity,
        description: item.description,
        thumbnails: item.thumbnails,
        ingredients:item.ingredients,
        quantity:item.quantity,
        // food_image: item.thumbnails,
        // cuisine_type: item.cuisine_type,
        food_type: item.food_type,
        // meal_type: item.meal_type,
        // price: item.price,
        // menu_id: item.category,
        business_id: item.business.id,
        business: item.business,
        status: item.status,
      };
    }
    });
    // console.log(foodData)
    // duplicates removal

    // const categories = data.map((item: any) => {
    //   return {
    //     name: item.category,
    //     id: item.category,
    //     menu_image: item.thumbnails,
    //   };
    // });
    // const uniqueCategory: any = removeDuplicates(categories);

    return {
      // set one category default selected
      // selectedCategory: uniqueCategory[0],
      // all menu category
      // menuCategory: uniqueCategory,
      foodHolder: foodData,
      food: foodData,
    };
  }
);

const initialState: BusinessState = {
  dishes: {
    status: "not-started",
    data: {
      // selectedCategory: null,
      // menuCategory: [],
      food: [],
      foodHolder: [],
    },
    error: null,
  },
};
export const DishMenuItemSlice = createSlice({
  name: "dishes",
  initialState: initialState,
  reducers: {
    // ADD ANY SYNC FUNCTION
    changeFoodCategorySelection: (state: BusinessState, action: any) => {
      const data = state.dishes.data;
      const menu = action.payload;
      const food=data;
      // apply filter based ons selected category
      // const food = data.food.filter((i: any) => menu.id === i.menu_id);
      state.dishes = {
        status: "resolved",
        data: {
          ...data,
          selectedCategory: menu,
          foodHolder: food,
        },
        error: null,
      };
    },
  },
  extraReducers: {
    [fetchDishesForLandingPage.pending.type]: (
      state: BusinessState,
      action: any
    ) => {
      state.dishes = {
        status: "pending",
        data: [],
        error: null,
      };
    },
    [fetchDishesForLandingPage.fulfilled.type]: (
      state: BusinessState,
      action: any
    ) => {
      state.dishes = {
        status: "resolved",
        data: action.payload,
        error: null,
      };
    },
    [fetchDishesForLandingPage.rejected.type]: (
      state: BusinessState,
      action: any
    ) => {
      state.dishes = {
        status: "rejected",
        data: [],
        error: null,
      };
    },
  },
});

const removeDuplicates = (array: any) => {
  const jsonObject = array.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse as any);

  return uniqueArray;
};
export const listDishesForLandingPage = (state: any) => state.dishes.dishes;
const { actions, reducer } = DishMenuItemSlice;

export const { changeFoodCategorySelection } = actions;

export default DishMenuItemSlice.reducer;
