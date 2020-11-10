import React from "react";
import { View, StyleSheet } from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { Button } from "react-native-elements";

import Colours from "../constants/colours";

const DriverAuth = (props) => {
  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (token !== null) {
        console.log(token);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.start}>
      <View style={styles.buttonContainer}>
        <Button
          containerStyle={styles.button}
          titleStyle={styles.text}
          buttonStyle={{ backgroundColor: Colours.main }}
          title="Sign Up"
          onPress={() => {
            props.navigation.navigate("SignUp");
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          containerStyle={styles.button}
          titleStyle={styles.text}
          buttonStyle={{ backgroundColor: Colours.main }}
          title="Log In"
          onPress={() => {
            props.navigation.navigate("LogIn");
          }}
        />
      </View>
    </View>
  );
};

DriverAuth.navigationOptions = (navData) => {
  return {
    headerTitle: "Welcome",
  };
};

const styles = StyleSheet.create({
  start: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 30,
    textAlign: "center",
  },
  button: {
    width: "100%",
    margin: 10,
    borderRadius: 7,
  },
  buttonContainer: {
    width: "40%",
  },
});

export default DriverAuth;
