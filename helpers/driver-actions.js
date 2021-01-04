import ENV from "../env";

export const GET_ENTRANCE = "GET_ENTRANCE";
export const WARN_DRIVER = "WARN_DRIVER";
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const VERIFY = "VERIFY";

import AsyncStorage from "@react-native-community/async-storage";

export const signUp = (name, email, password, dob, gender, licenseDate) => {
  return async (dispatch) => {
    const response = await fetch(`http://${ENV.localhost}:5000/driver/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: email,
        password: password,
        age: new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970,
        gender: gender.toLowerCase(),
        licenseIssueDate:
          licenseDate.getUTCFullYear() +
          "-" +
          (licenseDate.getUTCMonth() + 1) +
          "-" +
          licenseDate.getUTCDate(),
      }),
    });

    if (!response.ok) {
      throw new Error("Actions SignUp Error");
    }

    const resData = await response.json();
    console.log(resData);

    if (!resData.success) {
      throw new Error(resData.message);
    }

    try {
      const loginDetails = await dispatch(login(email, password, true));
      console.log(loginDetails);
      dispatch({
        type: SIGNUP,
        username: email,
        name: name,
        token: loginDetails.token,
      });
    } catch (err) {
      console.log("Actions signup login error");
      console.log(err);
    }
  };
};

export const login = (username, password, fromSignUp) => {
  return async (dispatch) => {
    const response = await fetch(`http://${ENV.localhost}:5000/driver/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Actions login Error");
    }

    const resData = await response.json();
    console.log(resData);

    if (!resData.success) {
      throw new Error(resData.message);
    }

    if (fromSignUp) {
      return resData;
    } else {
      const token = resData.token;
      try {
        await AsyncStorage.setItem("@token", token);
        dispatch({ type: LOGIN, username: username, token: token });
      } catch (err) {
        throw new Error("DriverActions login storing token Error" + err);
      }
    }
  };
};

export const logOut = (token) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/driver/logout?token=${token}`
    );

    if (!response.ok) {
      throw new Error("Driver Actions log out Error");
    }

    const resData = await response.json();

    if (!resData.success) {
      throw new Error(resData.message);
    }

    try {
      await AsyncStorage.removeItem("@token");
      dispatch({ type: LOGOUT });
    } catch (err) {
      throw new Error("Driver actions log out delete token error");
    }
  };
};

export const verifySession = (token) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/driver/verifysession?token=${token}`
    );

    if (!response.ok) {
      throw new Error("Driver Actions verifySession Error");
    }

    const resData = await response.json();
    console.log(resData);

    if (!resData.success) {
      throw new Error(resData.message);
    }

    dispatch({ type: VERIFY, username: resData.username, token: token });
  };
};

export const getEntrance = (token, username, regNo, lat, lng) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/epoints/nearEntrance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          username: username,
          regNo: regNo,
          lat: lat,
          lng: lng,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error in Driver-Actions");
    }

    const resData = await response.json();
    console.log(resData);

    if (!resData.success) {
      return "INVALID";
    } else {
      return resData.message;
    }
  };
};

export const warnDriver = (username, lat, lng) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/epoints/nearDanger`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          lat: lat,
          lng: lng,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("warnDriver driver-actions error");
    }

    const resData = await response.json();
    console.log(resData);

    return resData;
  };
};

export const recheckWeather = (username, lat, lng) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/epoints/recheckWeather`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          lat: lat,
          lng: lng,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("DriverActions recheckWeather error");
    }

    const resData = await response.json();
    console.log(resData);
  };
};

export const endSession = (username) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/epoints/endSession`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("driver actions endSession function error");
    }

    const resData = await response.json();
    console.log(resData);

    if (!resData.success) {
      throw new Error(resData.message);
    } else {
      console.log(resData.message);
    }
  };
};
