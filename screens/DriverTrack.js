import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import * as Permissions from "expo-permissions";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import * as driverActions from "../helpers/driver-actions";
import { useDispatch, useSelector } from "react-redux";
import haversine from "haversine";

const DriverTrack = (props) => {
  const { token, username, selectedVehicle } = useSelector((state) => {
    return {
      token: state.driver.token,
      username: state.driver.username,
      selectedVehicle: state.vehicle.selectedVehicle,
    };
  });

  // const [userLocation, setUserLocation] = useState(null);
  // const [userWarned, setUserWarned] = useState(false);
  const [locationWatcher, setLocationWatcher] = useState(null);
  const [weatherRecheckLocation, setWeatherRecheckLocation] = useState(null);
  const [nearDanger, setNearDanger] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [entrance, setEntrance] = useState();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!userWarned && nearDanger) {
  //     warnUser();
  //   }
  // }, [nearDanger]);

  const predictAccident = async (lat, lng) => {
    try {
      const res = await dispatch(driverActions.warnDriver(username, lat, lng));
      if (res.status === 1) {
        //setNearDanger(true);
        setNearDanger((state) => {
          if (!state) {
            warnUser(res.type);
            return !state;
          } else {
            return state;
          }
        });
      } else if (res.status === -1) {
        stopLocationWatcher();
      } else if (res.status === 0) {
        setNearDanger(false);
        //setUserWarned(false);
      }
    } catch (err) {
      console.log("DriverTrack predictAccident function error " + err);
    }
  };

  const warnUser = (type) => {
    if (type === "1") {
      Speech.speak("Danger Message One");
    } else if (type === "2") {
      Speech.speak("Danger Message Two");
    }

    //setUserWarned(true);
  };

  const weatherRecheck = async (lat, lng) => {
    try {
      await dispatch(driverActions.recheckWeather(username, lat, lng));
    } catch (err) {
      console.log("DriverTrack recheckWeather function error " + err);
    }
  };

  const startLocationWatcher = async () => {
    const locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 100,
        distanceInterval: 1,
      },
      (location) => {
        // setUserLocation({
        //   lat: location.coords.latitude,
        //   lng: location.coords.longitude,
        // });
        setWeatherRecheckLocation((state) => {
          const currentCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          if (!state) {
            return currentCoords;
          } else {
            const distance = haversine(state, currentCoords, { unit: "km" });
            if (distance > 1) {
              weatherRecheck(currentCoords.latitude, currentCoords.longitude);
              return currentCoords;
            } else {
              return state;
            }
          }
        });
        predictAccident(location.coords.latitude, location.coords.longitude);
      }
    );

    setLocationWatcher(locationWatcher);
  };

  const stopLocationWatcher = async () => {
    setLocationWatcher((state) => {
      state.remove();
      return null;
    });
    setEntrance(null);
    //setUserLocation(null);
    setNearDanger(false);
    setIsTracking(false);
    //setUserWarned(false);
    try {
      await dispatch(driverActions.endSession(username));
    } catch (err) {
      console.log("stopLocationWatcher error " + err);
    }
  };

  const verifyPermissions = async () => {
    const getStatus = await Permissions.getAsync(Permissions.LOCATION);
    if (getStatus.status === "granted") {
      return;
    }

    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions",
        "You need to grant location permissions to take a picture",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const beginTracking = async () => {
    verifyPermissions();

    if (!selectedVehicle) {
      Alert.alert(
        "Missing Vehicle!",
        "You must select a vehicle to start tracking!",
        [
          {
            text: "Okay",
            onPress: () => {
              props.navigation.navigate("VehicleNav");
            },
          },
        ]
      );
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const data = await dispatch(
        driverActions.getEntrance(
          token,
          username,
          selectedVehicle,
          location.coords.latitude,
          location.coords.longitude
        )
      );

      if (data === "INVALID") {
        Alert.alert("Sorry", "You are not near an entrance!", [
          { text: "Okay" },
        ]);
        return;
      } else {
        setIsTracking(true);
        setEntrance(data);
        startLocationWatcher();
      }
    } catch (err) {
      console.log("DriverTrack Err: " + err);
    }
  };

  return (
    <View style={styles.centered}>
      <View style={styles.container}>
        {nearDanger && <Text style={styles.danger}>NEAR DANGER ZONE!</Text>}
        {isTracking && !nearDanger && (
          <Text style={styles.text}>Started Tracking</Text>
        )}
        {!isTracking && <Text style={styles.text}>Begin Tracking</Text>}
      </View>
      <View style={styles.container}>
        <Button title="Begin" onPress={beginTracking} color="green" />
      </View>
      {entrance && (
        <View style={styles.container}>
          <Text style={styles.text}>Entered at {entrance}</Text>
          <Button title="STOP" color="red" onPress={stopLocationWatcher} />
        </View>
      )}
    </View>
  );
};

DriverTrack.navigationOptions = {
  headerTitle: "Tracking",
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    margin: 10,
  },
  text: {
    fontSize: 20,
  },
  danger: {
    fontSize: 30,
    color: "red",
  },
});

export default DriverTrack;
