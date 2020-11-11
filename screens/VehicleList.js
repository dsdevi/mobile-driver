import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Card, Button } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import CustomHeaderButton from "../components/CustomHeaderButton";
import Colours from "../constants/colours";

import * as vehicleActions from "../helpers/vehicle-actions";

const VehicleList = (props) => {
  // Disable delete if only one vehicle??
  const { selectedVehicle, vehicleList, token } = useSelector((state) => {
    return {
      selectedVehicle: state.vehicle.selectedVehicle,
      vehicleList: state.vehicle.details,
      token: state.driver.token,
    };
  });
  const dispatch = useDispatch();

  const getUserVehicles = async () => {
    try {
      await dispatch(vehicleActions.vehicleGet(token));
    } catch (err) {
      console.log("vehicle list get uservehicles function error");
      console.log(err.message);
    }
  };

  const selectVehicle = (regNo) => {
    dispatch(vehicleActions.vehicleSelect(regNo));
  };

  const deleteVehicle = async (regNo) => {
    try {
      await dispatch(vehicleActions.vehicleDelete(token, regNo));
    } catch (err) {
      console.log("Vehicle List deletevehicle error");
      console.log(err);
    }
  };

  const renderItem = (data) => {
    return (
      <Card>
        <View style={styles.vehicleDetails}>
          <Button
            title={data.item.regNo}
            titleStyle={styles.vehicleReg}
            buttonStyle={styles.vehicleRegButton}
            disabledStyle={{ backgroundColor: null }}
            disabledTitleStyle={{ color: 'black' }}
            containerStyle={styles.vehicleRegButtonContainer}
            disabled={selectedVehicle === data.item.regNo}
            onPress={() => {
              selectVehicle(data.item.regNo);
            }}
          />
          <Button
            title=""
            icon={{
              type: "ionicon",
              name: "md-trash",
              color: "red",
              onPress: () => {
                Alert.alert(
                  "Warning!",
                  `Sure you want to delete ${data.item.regNo}?`,
                  [
                    { text: "No" },
                    {
                      text: "Yes",
                      onPress: () => deleteVehicle(data.item.regNo),
                    },
                  ]
                );
              },
              // color: deleteDisabled ? "#ccc" : "red",
            }}
            buttonStyle={{ backgroundColor: null, paddingTop: 3 }}
            disabledStyle={{ backgroundColor: null }}
            onPress={() => {
              console.log("test");
              console.log(selectedVehicle);
            }}
            // disabled={deleteDisabled}
          />
        </View>
        <Card.Divider />
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleType}>{data.item.type}</Text>
          <Text style={styles.vehicleYOM}>{data.item.yom}</Text>
        </View>
      </Card>
    );
  };

  useEffect(() => {
    if (vehicleList) {
      if (vehicleList.length === 0) {
        getUserVehicles();
      } else {
        console.log(vehicleList);
        // if (vehicleList.length > 1) {
        //   setDeleteDisabled(false);
        // }
      }
    }
  }, [vehicleList, dispatch]);

  return (
    <View>
      {vehicleList && (
        <FlatList
          data={vehicleList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

VehicleList.navigationOptions = (navData) => {
  return {
    headerTitle: "Vehicle List",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="add-vehicle"
          iconName="md-add"
          onPress={() => {
            navData.navigation.navigate("VehicleAdd", { signup: false });
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  vehicleReg: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 20,
    color: "black",
  },
  vehicleRegButton: {
    backgroundColor: Colours.main,
    borderRadius: 15,
  },
  vehicleRegButtonContainer: {
    overflow: "hidden",
    marginBottom: 10,
  },
  vehicleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehicleType: {
    fontFamily: "WorkSans_500Medium",
    fontSize: 15,
  },
  vehicleYOM: {
    fontFamily: "WorkSans_400Regular_Italic",
  },
});

export default VehicleList;
