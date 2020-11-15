import {
  VEHICLE_ADD,
  VEHICLE_DELETE,
  VEHICLE_GET,
  VEHICLE_RESET,
  VEHICLE_SELECT,
} from "./vehicle-actions";

const initialState = {
  selectedVehicle: "",
  details: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case VEHICLE_ADD:
    //   const updatedDetails = state.details.concat({
    //     regNo: action.regNo,
    //     type: action.type,
    //     yom: action.yom,
    //   });
    //   return { details: updatedDetails };
    case VEHICLE_GET:
      return { ...state, details: action.details };
    case VEHICLE_SELECT:
      return { ...state, selectedVehicle: action.regNo };
    case VEHICLE_DELETE:
      const filteredDetails = state.details.filter(
        (item) => item.regNo !== action.regNo
      );
      return { ...state, details: filteredDetails };
    case VEHICLE_RESET:
      return { details: [], selectedVehicle: "" };
  }

  return state;
};
