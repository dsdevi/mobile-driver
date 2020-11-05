import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as Speech from "expo-speech";
import haversine from "haversine";

const DynamicMap = (props) => {
  const [dangerZone, setDangerZone] = useState({
    latitude: 6.796459,
    longitude: 79.895084,
  });
  const [currentLocation, setCurrentLocation] = useState();
  const [distance, setDistance] = useState();
  const [userWarned, setUserWarned] = useState(0);

  const warnDriver = () => {
    Speech.speak("Danger zone approaching");
  };

  let distanceToDangerZone,
    userWarnedTimes = 0;
  const watchPosition = async () => {
    const locationWatcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 100,
        distanceInterval: 1,
      },
      (location) => {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        distanceToDangerZone = haversine(
          dangerZone,
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          { unit: "meter" }
        );

        if (distanceToDangerZone < 500) {
          userWarnedTimes++;
          if (userWarnedTimes < 3) {
            warnDriver();
          }
          //setUserWarned((state) => state + 1);
        }

        console.log(userWarnedTimes);
        setDistance(distanceToDangerZone);
      }
    );
    return locationWatcher;
  };
  //

  const verifyPermissions = async () => {
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

  const watchLocation = async () => {
    try {
      const hasPermission = await verifyPermissions();
      if (!hasPermission) {
        return;
      }
      watchPosition();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <View style={styles.centered}>
      <Text>Tracking Test</Text>
      <Button title="Start Tracking" onPress={watchLocation} />
      {!!distance && (
        <Text>Distance to danger zone: {distance.toFixed(2)} meters</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DynamicMap;
