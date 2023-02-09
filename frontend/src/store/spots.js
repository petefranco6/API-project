import { csrfFetch } from "./csrf";

const POPULATE_SPOTS = "/spots/populateSpots";
const POPULATE_OWNED_SPOTS = "/spots/populateOwnedSpots";
const POPULATE_SPOT = "/spots/populateSpot";
const ADD_SPOT = "/spots/addSpot";
const EDIT_SPOT = "/spots/editSpot";
const REMOVE_SPOT = "/spots/removeSpot";
const ADD_IMG = "/spots/addImage";
const SET_BANNER_MESSAGE = "/spots/setBannerMessage";
const CLEAR_BANNER_MESSAGE = "/spots/clearBannerMessage";
const SET_IS_LOADING = "/spots/setIsLoading";
const CLEAR_OWNED_SPOTS = "/spots/clearOwnedSpots";
let bannerTimer;

export const clearOwnedSpots = () => {
  return {
    type: CLEAR_OWNED_SPOTS,
  };
};

const setIsLoading = (boolean) => {
  return {
    type: SET_IS_LOADING,
    payload: boolean,
  };
};

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
  dispatch(setIsLoading(true));
  const response = await fetch(`/api/spots/${spotId}`);
  const data = await response.json();
  dispatch(populateSpotDetails(data));
  dispatch(setIsLoading(false));
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

  clearTimeout(bannerTimer);

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

  const ownedSpots = getState().spots.ownedSpots;
  const ownedSpot = ownedSpots[ownedSpots.length - 1];

  const responseImg = await csrfFetch(`/api/spots/${ownedSpot.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });

  const dataImg = await responseImg.json();

  dispatch(addImageToSpot({ ...data, previewImage: dataImg.url }));
  dispatch(setBannerMessage({ success: "successfully created listing!" }));
  bannerTimer = setTimeout(() => dispatch(clearBannerMessage()), 3000);
  return response;
};

export const updateSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, name, description, price, id } = spot;

  clearTimeout(bannerTimer);

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
  dispatch(setBannerMessage({ success: "successfully updated listing!" }));
  bannerTimer = setTimeout(() => dispatch(clearBannerMessage()), 3000);

  return response;
};

export const setMessage = (message) => async (dispatch) => {
  dispatch(setBannerMessage({ error: message }));
  setTimeout(() => dispatch(clearBannerMessage()), 3000);
};

export const deleteSpot = (spotId) => async (dispatch) => {
  clearTimeout(bannerTimer);

  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  dispatch(removeSpot(spotId));
  dispatch(setBannerMessage({ success: data.message }));
  bannerTimer = setTimeout(() => dispatch(clearBannerMessage()), 3000);

  return response;
};

const spotsReducer = (
  state = {
    spots: [],
    spot: {},
    ownedSpots: [],
    bannerMessage: {},
    isLoading: false,
  },
  action
) => {
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
        ownedSpots: action.payload.spots,
      };
    case ADD_SPOT:
      return {
        // returning a copy of orignal state
        ...state,
        //copying the original state
        ownedSpots: [...state.ownedSpots, action.payload],
      };
    case EDIT_SPOT:
      return {
        ...state,
        ownedSpots: state.ownedSpots.map((spot) =>
          spot.id === action.payload.id
            ? (spot = { ...spot, ...action.payload })
            : spot
        ),
      };
    case REMOVE_SPOT:
      return {
        ...state,
        ownedSpots: state.ownedSpots.filter(
          (spot) => spot.id !== parseInt(action.payload)
        ),
      };
    case ADD_IMG:
      return {
        ...state,
        ownedSpots: state.ownedSpots.map((spot) =>
          spot.id === action.payload.id ? (spot = action.payload) : spot
        ),
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
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case CLEAR_OWNED_SPOTS:
      return {
        ...state,
        ownedSpots: [],
      };
    default:
      return state;
  }
};
export default spotsReducer;
