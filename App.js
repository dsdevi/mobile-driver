import React from "react";
import { applyMiddleware, combineReducers, createStore } from "redux";
import driverReducers from "./helpers/driver-reducers";
import DriverTrack from "./screens/DriverTrack";
import ReduxThunk from "redux-thunk";
import { Provider } from "react-redux";

const rootReducer = combineReducers({
  location: driverReducers,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <DriverTrack />
    </Provider>
  );
}
