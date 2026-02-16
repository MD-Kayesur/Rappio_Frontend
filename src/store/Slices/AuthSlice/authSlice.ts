import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  role: string;
  name?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null,
  token: Cookies.get("access_token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      Cookies.set("access_token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("access_token");
      Cookies.remove("user");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
