import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";

import DriverAuth from "../screens/DriverAuth";
import DriverTrack from "../screens/DriverTrack";
import DriverSignUp from "../screens/DriverSignUp";
import DriverLogIn from "../screens/DriverLogIn";
import VehicleAdd from "../screens/VehicleAdd";
import HomeScreen from "../screens/HomeScreen";

import Colours from "../constants/colours";
import VerifySession from "../components/VerifySession";
import { createBottomTabNavigator } from "react-navigation-tabs";
import VehicleList from "../screens/VehicleList";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colours.main,
  },
};

const VerifyNav = createStackNavigator({
  VerifySession: {
    screen: VerifySession,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const LoginNav = createStackNavigator(
  {
    Auth: DriverAuth,
    SignUp: DriverSignUp,
    LogIn: DriverLogIn,
    VehicleAdd: VehicleAdd,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const HomeNav = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
      tabBarLabel: "Home",
      tabBarIcon: () => <Ionicons name="md-home" size={30} />,
    },
  }
);

const VehicleNav = createStackNavigator(
  {
    VehicleList: VehicleList,
    VehicleAdd: VehicleAdd,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
      tabBarLabel: "Vehicles",
      tabBarIcon: () => <Ionicons name="md-car" size={30} />,
    },
  }
);

const TrackNav = createStackNavigator(
  {
    TrackNav: DriverTrack,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    navigationOptions: {
      tabBarLabel: "Tracking",
      tabBarIcon: () => <Ionicons name="md-locate" size={30} />,
    },
  }
);

const AppNav = createBottomTabNavigator(
  {
    HomeNav: HomeNav,
    VehicleNav: VehicleNav,
    TrackNav: TrackNav,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNav = createSwitchNavigator({
  VerifyNav: VerifyNav,
  LoginNav: LoginNav,
  AppNav: AppNav,
});

export default createAppContainer(MainNav);
