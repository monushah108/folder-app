import { configureStore } from "@reduxjs/toolkit";
import { FileApiSlice } from "./slices/Flieslice.js";
import { UserApiSlice } from "./slices/UserSlice.js";

export const Store = configureStore({
  reducer: {
    [FileApiSlice.reducerPath]: FileApiSlice.reducer,
    [UserApiSlice.reducerPath]: UserApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      FileApiSlice.middleware,
      UserApiSlice.middleware
    );
  },
});
