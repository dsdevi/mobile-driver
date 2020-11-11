import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import * as Permissions from "expo-permissions";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import * as driverActions from "../helpers/driver-actions";
import { useDispatch, useSelector } from "react-redux";

const DriverTrack = (props) => {
  const selectedVehicle = useSelector((state) => state.vehicle.selectedVehicle);

  const [nearDanger, setNearDanger] = useState(false);
  const [startedTracking, setStartedTracking] = useState(false);
  const [entrance, setEntrance] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (startedTracking) {
      const locationWatcher = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 100,
          distanceInterval: 1,
        },
        async (location) => {
          try {
            const status = await dispatch(
              driverActions.warnDriver(
                location.coords.latitude,
                location.coords.longitude
              )
            );

            console.log(status);

            if (status === "WARNING") {
              setNearDanger(true);
              Speech.speak("Approaching Danger Zone");
            } else {
              setNearDanger(false);
            }
          } catch (err) {
            console.log(err);
          }
        }
      );

      return () => {
        locationWatcher.remove();
      };
    }
  }, [startedTracking]);

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
        setStartedTracking(true);
        setEntrance(data);
      }
    } catch (err) {
      console.log("DriverTrack Err: " + err);
    }
  };

  return (
    <View style={styles.centered}>
      <View style={styles.container}>
        {nearDanger ? (
          <Text style={styles.danger}>NEAR DANGER ZONE!</Text>
        ) : (
          <Text style={styles.text}>
            {!startedTracking ? "Begin Tracking?" : "Started Tracking"}
          </Text>
        )}
      </View>
      <View style={styles.container}>
        <Button title="Begin" onPress={beginTracking} color="green" />
      </View>
      {entrance ? (
        <View style={styles.container}>
          <Text style={styles.text}>Entered at {entrance}</Text>
        </View>
      ) : null}
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
