import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
type InitialStateType = {
	loggedIn: boolean;
	sidebar: boolean;
	user_metadata: {
		id: string;
		email: string;
		full_name: string;
		role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
	} | null;
};

const initialState: InitialStateType = {
	loggedIn: false,
	sidebar: false,
	user_metadata: null,
};

const globalSlice = createSlice({
	name: "globals",
	initialState,
	reducers: {
		login: (state) => {
			state.loggedIn = true;
		},
		logout: (state) => {
			state.loggedIn = false;
			state.user_metadata = null;
		},
		toggleSidebar: (state) => {
			state.sidebar = !state.sidebar;
		},
		setUser: (
			state,
			action: PayloadAction<{
				id: string;
				email: string;
				full_name: string;
				role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
			}>
		) => {
			state.user_metadata = action.payload;
		},
	},
});
export default globalSlice.reducer;
export const { login, logout, toggleSidebar, setUser } = globalSlice.actions;
