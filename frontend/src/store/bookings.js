import { csrfFetch } from "./csrf";

const POPULATE_BOOKINGS = "/bookings/populateBookings";
const REMOVE_BOOKING = "/bookings/removeBooking";
const ADD_BOOKING = "/bookings/addBooking";

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
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  dispatch(removeBooking(bookingId));

  return response;
};

export const createBooking = (booking) => async (dispatch) => {
  const { checkin, checkout, spotId } = booking;
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    body: JSON.stringify({
      startDate: checkin,
      endDate: checkout,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  dispatch(addToBookings(data));

  return response;
};

const bookingsReducer = (state = { bookings: [] }, action) => {
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
    default:
      return state;
  }
};

export default bookingsReducer;
