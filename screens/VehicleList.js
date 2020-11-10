import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

const VehicleList = (props) => {
  const vehicleList = useSelector((state) => state.vehicle.details);

  useEffect(() => {
    if (vehicleList.length === 0) {
      console.log("Test");
    }
  }, [vehicleList]);

  return (
    <View>
      <Text>Vehicle List</Text>
    </View>
  );
};

VehicleList.navigationOptions = {
    headerTitle: 'Vehicle List'
}

export default VehicleList;
