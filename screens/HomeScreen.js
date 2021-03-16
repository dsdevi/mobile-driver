import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, Card } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import CustomHeaderButton from "../components/CustomHeaderButton";

import * as driverActions from "../helpers/driver-actions";
import * as vehicleActions from "../helpers/vehicle-actions";

const HomeScreen = (props) => {
  const selectedVehicle = useSelector((state) => state.vehicle.selectedVehicle);

  return (
    <View>
      <Card>
        <Text style={styles.tutorialText}>Welcome!</Text>
        <Card.Divider />
        <Text style={styles.tutorialText}>
          To start tracking, first select a vehicle on the{" "}
          <Ionicons name="md-car" size={18} />{" "}
          <Text style={styles.boldText}>Vehicles</Text> screen by tapping the
          registration number
        </Text>
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.tutorialText}>
            When you are near an entrance press the{" "}
            <Text style={styles.boldText}>Begin Tracking</Text> button on the
            {"\n"}
            <Ionicons name="md-locate" size={18} />{" "}
            <Text style={styles.boldText}>Tracking</Text> Screen
          </Text>
        </View>
        <Text style={{ ...styles.tutorialText, ...styles.boldText }}>
          You must be near a highway entrance to start tracking!
        </Text>
      </Card>
      <Card>
        <Text style={styles.tutorialText}>Reporting Emergencies</Text>
        <Card.Divider />
        <View>
        <Text style={styles.tutorialText}>
          If you witness an accident or some other emergency please report it by
          heading to the <Ionicons name="md-alert" size={18} />{" "}
          <Text style={styles.boldText}>Reporting</Text> page. {"\n"}  
        </Text>
        </View>
      </Card>
    </View>
  );
};

HomeScreen.navigationOptions = (navData) => {
  return {
    headerRight: () => {
      const token = useSelector((state) => state.driver.token);
      const dispatch = useDispatch();
      const logout = async () => {
        try {
          dispatch(vehicleActions.vehicleReset());
          await dispatch(driverActions.logOut(token));
          navData.navigation.navigate("LoginNav");
        } catch (err) {
          console.log("Error in Home Screen Driver Log Out");
          console.log(err);
        }
      };
      return (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="log-out"
            iconName="md-log-out"
            onPress={() => {
              Alert.alert("Log Out", "Sure you want to log out?", [
                { text: "Yes", onPress: logout },
                { text: "No" },
              ]);
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

const styles = StyleSheet.create({
  tutorialText: {
    fontFamily: "WorkSans_400Regular",
    fontSize: 18,
  },
  boldText: {
    fontFamily: "WorkSans_600SemiBold",
  },
});

export default HomeScreen;
