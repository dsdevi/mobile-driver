import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import CustomHeaderButton from "../components/CustomHeaderButton";

import * as driverActions from "../helpers/driver-actions";

const HomeScreen = (props) => {
  return (
    <View>
      <Text>The Home Screen!</Text>
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
              await dispatch(driverActions.logOut(token))
              navData.navigation.navigate('LoginNav')
          } catch (err) {
              console.log("Error in Home Screen Driver Log Out")
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

const styles = StyleSheet.create({});

export default HomeScreen;
