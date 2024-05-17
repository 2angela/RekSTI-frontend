import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "root/redux/slices/global";
const store = configureStore({
	reducer: {
		globals: globalReducer,
	},
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
