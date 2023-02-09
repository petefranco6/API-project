import { csrfFetch } from "./csrf";

const POPULATE_BOOKINGS = "/bookings/populateBookings";
const REMOVE_BOOKING = "/bookings/removeBooking";
const ADD_BOOKING = "/bookings/addBooking";
const SET_BANNER_MESSAGE = "/bookings/setBannerMessage";
const CLEAR_BANNER_MESSAGE = "/bookings/clearBannerMessage";
const CLEAR_BOOKINGS = "/bookings/clearBookings"
let bannerTimer;

export const clearBookings = () => {
  return {
    type: CLEAR_BOOKINGS
  }
}

const clearBannerMessage = () => {
  return {
    type: CLEAR_BANNER_MESSAGE,
  };
};

const setBannerMessage = (bannerMessage) => {
  return {
    type: SET_BANNER_MESSAGE,
    payload: bannerMessage,
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

export const setMessage = (message) => async (dispatch) => {
  dispatch(setBannerMessage({ error: message }));
  setTimeout(() => dispatch(clearBannerMessage()), 3000);
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  clearTimeout(bannerTimer);

  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  dispatch(removeBooking(bookingId));
  dispatch(setBannerMessage({ success: data.message }));
  bannerTimer = setTimeout(() => dispatch(clearBannerMessage()), 3000);

  return response;
};

export const createBooking = (booking) => async (dispatch) => {
  const { checkin, checkout, spotId } = booking;

  clearTimeout(bannerTimer);

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
  dispatch(setBannerMessage({ success: "Booking added successfully!" }));
  bannerTimer = setTimeout(() => dispatch(clearBannerMessage()), 3000);

  return response;
};

const bookingsReducer = (
  state = { bookings: [], bannerMessage: {}, errors: [], isLoading: true },
  action
) => {
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
    case SET_BANNER_MESSAGE:
      return {
        ...state,
        bannerMessage: action.payload,
      };
    case CLEAR_BANNER_MESSAGE:
      return {
        ...state,
        bannerMessage: {},
      };
      case CLEAR_BOOKINGS:
      return {
        ...state,
        bookings: [],
      };
    default:
      return state;
  }
};

export default bookingsReducer;
