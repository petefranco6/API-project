import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { csrfFetch } from "./csrf";

export const login = createAsyncThunk(
  "/api/session/login",
  async (user, thunkAPI) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password,
      }),
    });

    const data = await response.json();
    return data;
  }
);

export const restoreUser = createAsyncThunk("/api/session/restore-user", async () => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();

  return data;
});

export const signup = createAsyncThunk("/api/users/signup", async (user) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  return data;
});

export const logout = createAsyncThunk("/api/session/logout", async () => {
    const response = await csrfFetch("/api/session", {
        method: "DELETE"
    });

    const data = await response.json();
    return data
})

const sessionSlice = createSlice({
  name: "session",
  initialState: { user: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    builder.addCase(restoreUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
        state.user = null;
      });
  },
});

export const sessionActions = sessionSlice.actions;

export default sessionSlice.reducer;
