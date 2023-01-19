import { csrfFetch } from "./csrf";

const POPULATE_SPOTS = "/spots/populateSpots";
const POPULATE_OWNED_SPOTS = "/spots/populateOwnedSpots";
const POPULATE_SPOT = "/spots/populateSpot";
const ADD_SPOT = "/spots/addSpot";
const EDIT_SPOT = "/spots/editSpot";
const REMOVE_SPOT = "/spots/removeSpot";
const ADD_IMG = "/spots/addImage";

const addImageToSpot = (spotWithImg) => {
  return {
    type: ADD_IMG,
    payload: spotWithImg,
  };
};

const removeSpot = (spotId) => {
  return {
    type: REMOVE_SPOT,
    payload: spotId,
  };
};

const editSpot = (spot) => {
  return {
    type: EDIT_SPOT,
    payload: spot,
  };
};

const populateSpots = (spots) => {
  return {
    type: POPULATE_SPOTS,
    payload: spots,
  };
};

const populateSpotDetails = (spot) => {
  return {
    type: POPULATE_SPOT,
    payload: spot,
  };
};

const populateOwnedSpots = (spots) => {
  return {
    type: POPULATE_OWNED_SPOTS,
    payload: spots,
  };
};

const addToSpots = (spot) => {
  return {
    type: ADD_SPOT,
    payload: spot,
  };
};

export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  const data = await response.json();
  dispatch(populateSpots(data));
  return response;
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  const data = await response.json();
  dispatch(populateSpotDetails(data));
  return response;
};

export const getOwnedSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots/current");
  const data = await response.json();
  dispatch(populateOwnedSpots(data));
  return response;
};

export const createSpot = (newSpot) => async (dispatch, getState) => {
  const {
    address,
    city,
    state,
    country,
    name,
    description,
    price,
    url,
    preview,
  } = newSpot;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat: -22.22,
      lng: -19.33,
      name,
      description,
      price,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  dispatch(addToSpots(data));

  const spots = getState().spots.spots;
  const spot = spots[spots.length - 1];

  const responseImg = await csrfFetch(`/api/spots/${spot.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });

  const dataImg = await responseImg.json();

  dispatch(addImageToSpot({ ...data, previewImage: dataImg.url }));

  return [response, responseImg];
};

export const updateSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, name, description, price, id } = spot;

  const response = await csrfFetch(`/api/spots/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat: -22.22,
      lng: -19.33,
      name,
      description,
      price,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  dispatch(editSpot(data));

  return response;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  dispatch(removeSpot(spotId));

  return response;
};

const spotsReducer = (state = { spots: [], spot: {} }, action) => {
  switch (action.type) {
    case POPULATE_SPOTS:
      return {
        ...state,
        spots: action.payload.Spots,
      };
    case POPULATE_SPOT:
      return {
        ...state,
        spot: action.payload,
      };
    case POPULATE_OWNED_SPOTS:
      return {
        ...state,
        spots: action.payload.spots,
      };
    case ADD_SPOT:
      return {
        // returning a copy of orignal state
        ...state,
        //copying the original state
        spots: [...state.spots, action.payload],
      };
    case EDIT_SPOT:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.payload.id ? (spot = action.payload) : spot
        ),
      };
    case REMOVE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.payload),
      };
    case ADD_IMG:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.payload.id ? (spot = action.payload) : spot
        ),
      };
    default:
      return state;
  }
};
export default spotsReducer;
