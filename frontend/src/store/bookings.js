import { csrfFetch } from "./csrf";

const POPULATE_BOOKINGS = "/bookings/populateBookings";
const REMOVE_BOOKING = "/bookings/removeBooking";
const ADD_BOOKING = "/bookings/addBooking";
const SET_MESSAGE = "/bookings/setMessage";
const CLEAR_MESSAGE = "/bookings/clearMessage";

const clearMessage = () => {
  return {
    type: CLEAR_MESSAGE,
  };
};

const setMessage = (message) => {
  return {
    type: SET_MESSAGE,
    payload: message,
  };
};

const addToBookings = (booking) => {
  return {
    type: ADD_BOOKING,
    payload: booking,
  };
};

const removeBooking = (bookingId) => {
  return {
    type: REMOVE_BOOKING,
    payload: bookingId,
  };
};

const populateBookings = (bookings) => {
  return {
    type: POPULATE_BOOKINGS,
    payload: bookings,
  };
};

export const getCurrentBookings = () => async (dispatch) => {
  const response = await csrfFetch("/api/bookings/current");
  const data = await response.json();
  dispatch(populateBookings(data));
  return response;
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(removeBooking(bookingId));
    dispatch(setMessage({'success':data.message}));
    setTimeout(() => dispatch(clearMessage()), 3000);
    return response;
  } catch (error) {
    dispatch(setMessage({'error':error.message}));
    setTimeout(() => dispatch(clearMessage()), 3000);
  }
};

export const createBooking = (booking) => async (dispatch) => {
  const { checkin, checkout, spotId } = booking;

  try {

    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: "POST",
      body: JSON.stringify({
        startDate: checkin,
        endDate: checkout,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(addToBookings(data));
    dispatch(setMessage({'success': "Booking added successfully!"}));
    setTimeout(() => dispatch(clearMessage()), 3000);

    return response;

  } catch (error) {
    dispatch(setMessage({'error': error.message}));
    setTimeout(() => dispatch(clearMessage()), 3000);
  }
};

const bookingsReducer = (state = { bookings: [], message: {} }, action) => {
  switch (action.type) {
    case POPULATE_BOOKINGS:
      return {
        ...state,
        bookings: action.payload.Bookings,
      };
    case REMOVE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => booking.id !== parseInt(action.payload)
        ),
      };
    case ADD_BOOKING:
      return {
        ...state,
        //copying the original state
        bookings: [...state.bookings, action.payload],
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: {},
      };
    default:
      return state;
  }
};

export default bookingsReducer;
