import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

import { Input, Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import Colours from "../constants/colours";
import * as driverActions from "../helpers/driver-actions";

const DriverLogIn = (props) => {
  // Email State
  const [email, setEmail] = useState();
  // Password State
  const [password, setPassword] = useState();
  // Validation State
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (email && password) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [email, password]);

  const login = async () => {
    try {
      await dispatch(driverActions.login(email, password, false));
      props.navigation.navigate("AppNav");
    } catch (err) {
      console.log("DriverLogIn login function error");
      console.log(err.message);

      if (
        err.message === "Error:Invalid username (password validation)" ||
        err.message === "Error:Invalid password"
      ) {
        Alert.alert(
          "Invalid email or password",
          "Check your email/password or register if you do not have an account",
          [{ text: "Okay" }]
        );
      }
    }
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Log In</Text>
      </View>
      <KeyboardAwareScrollView style={styles.kbsView}>
        <Input
          placeholder="Email"
          leftIcon={{ type: "ionicon", name: "md-mail" }}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => {
            setEmail(value);
          }}
        />
        {/* Password Input */}
        <Input
          placeholder="Password"
          leftIcon={{ type: "ionicon", name: "md-key" }}
          secureTextEntry
          onChangeText={(value) => {
            setPassword(value);
          }}
        />
        <Button
          title="Submit"
          disabled={submitDisabled}
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitText}
          onPress={login}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

DriverLogIn.navigationOptions = {
  headerTitle: "Log In",
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 6,
    borderColor: Colours.main,
    marginRight: "40%",
  },
  kbsView: {
    marginTop: 20,
  },
  text: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 30,
    textAlign: "center",
  },
  headerText: {
    textAlign: "left",
    marginLeft: 10,
    fontSize: 30,
    fontFamily: "WorkSans_600SemiBold",
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

export default DriverLogIn;
