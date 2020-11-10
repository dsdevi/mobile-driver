import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Input, Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";

import * as vehicleActions from "../helpers/vehicle-actions";
import Colours from "../constants/colours";
import AsyncStorage from "@react-native-community/async-storage";

const VehicleAdd = (props) => {
  //Redux State
  const username = useSelector((state) => state.driver.username);
  const token = useSelector((state) => state.driver.token);

  //RegNo State
  const [regNo, setRegNo] = useState(null);
  //Type State
  const [type, setType] = useState(null);
  //YOM State
  const [yom, setYOM] = useState(null);
  //Validation State
  const [submitDisabled, setSubmitDisabled] = useState(true);

  //Validation
  useEffect(() => {
    if (regNo && type && yom) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [regNo, type, yom]);

  const dispatch = useDispatch();

  //Vehicle Info Dispatch Function
  const vehicleAdd = async () => {
    try {
      await dispatch(vehicleActions.vehicleAdd(token, regNo, type, yom));
      if (props.navigation.getParam("signup")) {
        await storeData();
        props.navigation.navigate("AppNav");
      }
    //   If navigation here after signup/login
    } catch (err) {
      console.log("VehicleAdd screen vehicleAdd function error");
      console.log(err);
    }
  };

  const storeData = async () => {
    try {
        await AsyncStorage.setItem('@token', token)
      } catch (e) {
        console.log("VehicleAdd storeData Function Error")
        console.log(err);
      }
  }

  return (
    <View>
      {/* Remove this text if they are adding a vehicle later */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome {username}</Text>
      </View>
      <KeyboardAwareScrollView style={styles.kbsView}>
        <Input
          placeholder="Registration Number"
          leftIcon={{ type: "font-awesome-5", name: "hashtag" }}
          onChangeText={(value) => {
            setRegNo(value);
          }}
        />
        <Input
          placeholder="Vehicle Type"
          leftIcon={{ type: "ionicon", name: "md-car" }}
          onChangeText={(value) => {
            setType(value);
          }}
        />
        <Input
          placeholder="Year of Manufacture"
          leftIcon={{ type: "ionicon", name: "md-calendar" }}
          onChangeText={(value) => {
            setYOM(value);
          }}
          keyboardType="number-pad"
        />

        <Button
          title="Submit"
          disabled={submitDisabled}
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitText}
          containerStyle={styles.submitContainer}
          onPress={vehicleAdd}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

VehicleAdd.navigationOptions = (navData) => {
  return { headerTitle: "Add a Vehicle" };
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 22,
    fontFamily: "WorkSans_400Regular",
  },
  welcomeContainer: {
    marginTop: 10,
  },
  kbsView: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colours.main,
    paddingVertical: 10,
    marginHorizontal: "10%",
    borderRadius: 30,
  },
  submitText: {
    fontSize: 20,
    fontFamily: "WorkSans_600SemiBold",
  },
});

export default VehicleAdd;
