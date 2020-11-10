import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";

import Colours from "../constants/colours";
import * as driverActions from "../helpers/driver-actions";

const VerifySession = (props) => {
  const dispatch = useDispatch();

  const getData = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("@token");
      if (token !== null) {
        console.log(token);
        await dispatch(driverActions.verifySession(token));
        props.navigation.navigate("AppNav");
      } else {
        props.navigation.navigate("LoginNav");
      }
    } catch (err) {
      console.log("Error in VerifySession getData");
      console.log(err);

      if (token !== null) {
        try {
          await AsyncStorage.removeItem("@token");
        } catch (err) {
          console.log("Error in removing token");
        }
      }
      props.navigation.navigate("LoginNav");
    }
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={Colours.main} />
    </View>
  );
};

export default VerifySession;
