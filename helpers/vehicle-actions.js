import ENV from "../env";

export const VEHICLE_ADD = "VEHICLE_ADD";

export const vehicleAdd = (token, regNo, type, yom) => {
  return async (dispatch) => {
    const response = await fetch(`http://${ENV.localhost}:5000/vehicle/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken: token,
        regno: regNo,
        type: type,
        yom: yom,
      }),
    });

    if (!response.ok) {
      throw new Error("Actions vehicleAdd Error");
    }

    const resData = await response.json();
    console.log(resData);

    dispatch({ type: VEHICLE_ADD, regNo: regNo, type: type, yom: yom });
  };
};
