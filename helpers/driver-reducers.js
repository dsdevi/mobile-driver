import {
  GET_ENTRANCE,
  LOGIN,
  LOGOUT,
  SIGNUP,
  VERIFY,
  WARN_DRIVER,
} from "./driver-actions";

const initialState = {
  username: "",
  name: "",
  token: "",
  coords: { lat: "", lng: "" },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ENTRANCE:
      return state;
    case WARN_DRIVER:
      return state;
    case SIGNUP:
      return {
        ...state,
        username: action.username,
        name: action.name,
        token: action.token,
      };
    case VERIFY:
      return {
        ...state,
        username: action.username,
        token: action.token,
      };
    case LOGIN:
      return {
        ...state,
        username: action.username,
        token: action.token,
      };

    case LOGOUT:
      return {
        username: "",
        name: "",
        token: "",
        coords: { lat: "", lng: "" },
      };
  }

  return state;
};
