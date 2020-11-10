import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input, Overlay } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

import * as driverActions from "../helpers/driver-actions";
import Colours from "../constants/colours";
import { useDispatch } from "react-redux";

const DriverSignUp = (props) => {
  //Name State
  const [name, setName] = useState(null);
  //Email State
  const [email, setEmail] = useState(null);
  //Password State
  const [password, setPassword] = useState(null);
  // DOB State
  const [dob, setDOB] = useState(new Date());
  const [shownDOB, setShownDOB] = useState(null);
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  // Gender State
  const [gender, setGender] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  // License Date State
  const [licenseDate, setLicenseDate] = useState(new Date());
  const [shownLicenseDate, setShownLicenseDate] = useState(null);
  const [showLicenseDatePicker, setShowLicenseDatePicker] = useState(false);
  //Validation State
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const dispatch = useDispatch();

  //Validation
  // const emptyChecker = (value) => {
  //     if (!value) {

  //   }
  // }

  useEffect(() => {
    if (name && email && shownDOB && password && gender && shownLicenseDate) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [name, email, shownDOB, password, gender, shownLicenseDate]);

  //SignUp Dispatch Function
  const signUp = async () => {
    try {
      await dispatch(
        driverActions.signUp(name, email, password, dob, gender, licenseDate)
      );
      props.navigation.navigate("VehicleAdd", { signup: true });
    } catch (err) {
      console.log("Error DriverSignUp.js Submit");

      if (err.message === "Error:Username taken.") {
        Alert.alert("User already exists!", "You already have an account", [
          { text: "Okay" },
        ]);
      }

      if (err.message === "Error: Password invalid.") {
        Alert.alert(
          "Password too short!",
          "Your password should be longer than 4 characters!",
          [{ text: "Okay" }]
        );
      }
    }
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>
      <KeyboardAwareScrollView style={styles.kbsView}>
        {/* Name Input */}
        <Input
          placeholder="Name"
          leftIcon={{ type: "ionicon", name: "md-person" }}
          onChangeText={(value) => {
            setName(value);
          }}
        />
        {/* Email Input */}
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
        {/* Age Input */}
        <Input
          placeholder="Date of Birth"
          leftIcon={{ type: "ionicon", name: "md-calendar" }}
          onFocus={() => {
            setShowDOBPicker(true);
          }}
          value={shownDOB}
          showSoftInputOnFocus={false}
        />
        {showDOBPicker && (
          <DateTimePicker
            testID="dob"
            value={dob}
            mode="date"
            display="spinner"
            maximumDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            }
            onChange={(event, date) => {
              setShowDOBPicker(false);
              if (event.type === "set") {
                setDOB(date);
                setShownDOB(
                  date.getDate() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getFullYear()
                );
              }
            }}
          />
        )}
        {/* Gender Input */}
        <Input
          placeholder="Gender"
          leftIcon={{ type: "ionicon", name: "md-people" }}
          value={gender}
          onFocus={() => {
            setOverlayVisible(true);
          }}
          showSoftInputOnFocus={false}
        />
        <Overlay isVisible={overlayVisible} overlayStyle={styles.overlay}>
          <View>
            <Button
              title="Male"
              icon={{ type: "ionicon", name: "md-male", color: "white" }}
              buttonStyle={{ backgroundColor: Colours.main }}
              containerStyle={styles.modalButton}
              onPress={() => {
                setGender("Male");
                setOverlayVisible(false);
              }}
            />
            <Button
              title="Female"
              icon={{
                type: "ionicon",
                name: "md-female",
                color: "white",
              }}
              buttonStyle={{ backgroundColor: Colours.main }}
              containerStyle={styles.modalButton}
              onPress={() => {
                setGender("Female");
                setOverlayVisible(false);
              }}
            />
          </View>
        </Overlay>
        {/* License Issue Date Input */}
        <Input
          placeholder="License Issue Date"
          leftIcon={{ type: "ionicon", name: "md-calendar" }}
          onFocus={() => {
            setShowLicenseDatePicker(true);
          }}
          value={shownLicenseDate}
          showSoftInputOnFocus={false}
        />
        {showLicenseDatePicker && (
          <DateTimePicker
            testID="license"
            value={licenseDate}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={(event, date) => {
              setShowLicenseDatePicker(false);
              if (event.type === "set") {
                setLicenseDate(date);
                setShownLicenseDate(
                  date.getDate() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getFullYear()
                );
              }
            }}
          />
        )}
        {/* Submit Button */}
        <Button
          title="Submit"
          disabled={submitDisabled}
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitText}
          onPress={signUp}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

DriverSignUp.navigationOptions = (navData) => {
  return {
    headerTitle: "Sign Up",
  };
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
  modalButton: {
    margin: 10,
    padding: 10,
  },
  overlay: {
    width: "40%",
    borderRadius: 10,
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

export default DriverSignUp;
