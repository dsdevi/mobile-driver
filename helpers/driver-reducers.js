import { GET_ENTRANCE, WARN_DRIVER } from "./driver-actions";

const initialState = {
    "lat":"",
    "lng":""
}

export default (state = initialState, action) => {
    switch(action.type) {
        case GET_ENTRANCE:
            return state;
        case WARN_DRIVER:
            return state;
    }
    return state;
}
