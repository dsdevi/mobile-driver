import ENV from "../env";

export const VEHICLE_ADD = "VEHICLE_ADD";
export const VEHICLE_GET = "VEHICLE_GET";
export const VEHICLE_SELECT = "VEHICLE_SELECT";
export const VEHICLE_DELETE = "VEHICLE_DELETE";
export const VEHICLE_RESET = "VEHICLE_RESET";

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

    dispatch(vehicleGet(token));
  };
};

export const vehicleGet = (token) => {
  return async (dispatch) => {
    const response = await fetch(`http://${ENV.localhost}:5000/vehicle/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Vehicle actions vehicle get function error");
    }

    const resData = await response.json();

    if (!resData.success) {
      throw new Error(resData.message);
    }

    const vehicleDetails = resData.data.map((item) => {
      return {
        id: item._id,
        regNo: item.regno,
        type: item.type,
        yom: item.yom,
      };
    });

    dispatch({ type: VEHICLE_GET, details: vehicleDetails });
  };
};

export const vehicleSelect = (regNo) => {
  return { type: VEHICLE_SELECT, regNo: regNo };
};

export const vehicleReset = () => {
  return { type: VEHICLE_RESET };
};

export const vehicleDelete = (token, regNo) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/vehicle/remove`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: token,
          regno: regNo,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Vehicle actions vehicleDelete function error");
    }

    const resData = await response.json();
    console.log(resData);

    if (!resData.success) {
      throw new Error(resData.message);
    }

    dispatch({ type: VEHICLE_DELETE, regNo: regNo });
  };
};
