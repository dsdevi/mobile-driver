export const GET_ENTRANCE = "GET_ENTRANCE";
export const WARN_DRIVER = "WARN_DRIVER";

import ENV from "../env";

export const getEntrance = (lat, lng) => {
  return async (dispatch) => {
    const response = await fetch(
      `http://${ENV.localhost}:5000/epoints/nearEntrance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

    if (resData === "Not near any entrances") {
      return "INVALID";
    } else {
      return resData;
    }
  };
};

export const warnDriver = (lat,lng) => {
    return async (dispatch) => {
        const response = await fetch(`http://${ENV.localhost}:5000/epoints/nearDanger`, 
        {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                lat:lat,
                lng:lng
            })
        })

        if (!response.ok) {
            throw new Error("warnDriver driver-actions error")
        }

        const resData = await response.json();
        
        return resData;
    }
}
