import { csrfFetch } from "./csrf";
import * as spotActions from "./spots";
import * as bookingActions from "./bookings";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// export const restoreUser = createAsyncThunk("/api/session/restore-user", async () => {
//   const response = await csrfFetch("/api/session");
//   const data = await response.json();

//   return data;
// });
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// export const signup = createAsyncThunk("/api/users/signup", async (user) => {
//   const { username, firstName, lastName, email, password } = user;
//   const response = await csrfFetch("/api/users", {
//     method: "POST",
//     body: JSON.stringify({
//       username,
//       firstName,
//       lastName,
//       email,
//       password,
//     }),
//   });
//   const data = await response.json();
//   return data;
// });
export const signup = (user) => async (dispatch) => {
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
  dispatch(setUser(data.user));
  return response;
};

// export const logout = createAsyncThunk("/api/session/logout", async () => {
//     const response = await csrfFetch("/api/session", {
//         method: "DELETE"
//     });

//     const data = await response.json();
//     return data
// })
export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  dispatch(spotActions.clearOwnedSpots())
  dispatch(bookingActions.clearBookings())
  return response;
};

const sessionReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case REMOVE_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default sessionReducer;
