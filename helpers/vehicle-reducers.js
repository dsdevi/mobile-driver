import { VEHICLE_ADD } from "./vehicle-actions";

const initialState = {
  details: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VEHICLE_ADD:
      const updatedDetails = state.details.concat({
        regNo: action.regNo,
        type: action.type,
        yom: action.yom,
      });
      return { details: updatedDetails };
  }

  return state;
};
