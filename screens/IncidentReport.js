import React, { useState } from "react";
import { Input, Button, Divider, Overlay } from "react-native-elements";
import { View, Text, StyleSheet, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colours from "../constants/colours";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import haversine from "haversine";
import * as driverActions from "../helpers/driver-actions";
import { useSelector, useDispatch } from "react-redux";

const IncidentReport = (props) => {
  const token = useSelector((state) => state.driver.token);
  const dispatch = useDispatch();
  const [accidentSelect, setAccidentSelect] = useState(false);
  const [otherSelect, setOtherSelect] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [suburb, setSuburb] = useState(null);
  const [kmPost, setkmPost] = useState(null);
  const [details, setDetails] = useState(null);
  const exits = {
    Kottawa: { latitude: 6.84049, longitude: 79.980573 },
    Kahathuduwa: { latitude: 6.784015, longitude: 79.980355 },
    Gelanigama: { latitude: 6.715369, longitude: 80.000144 },
    Dodangoda: { latitude: 6.542138, longitude: 80.043321 },
    Welipanna: { latitude: 6.453122, longitude: 80.088722 },
    Kurundugahahetekma: { latitude: 6.271763, longitude: 80.13916 },
    Baddegama: { latitude: 6.180164, longitude: 80.19423 },
    Pinnaduwa: { latitude: 6.069075, longitude: 80.264147 },
    Imaduwa: { latitude: 6.035074, longitude: 80.36598 },
    Kokmaduwa: { latitude: 6.022619, longitude: 80.432987 },
    Godagama: { latitude: 5.976512, longitude: 80.518374 },
  };
  const kmPosts = {
    Kottawa: "0",
    Kahathuduwa: "5.9",
    Gelanigama: "13.7",
    Dodangoda: "34.8",
    Welipanna: "46",
    Kurundugahahetekma: "67.6",
    Baddegama: "79.8",
    Pinnaduwa: "95.3",
    Imaduwa: "108",
    Kokmaduwa: "116.5",
    Godagama: "127",
  }

  const verifyPermissions = async () => {
    const getStatus = await Permissions.getAsync(Permissions.LOCATION);
    if (getStatus.status === "granted") {
      return;
    }

    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions",
        "You need to grant location permissions to track",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const findNearestExit = async () => {
    verifyPermissions();

    try {
      Location.requestPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      console.log(
        JSON.stringify({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        })
      );
      let prev_distance, prev_exit, distance;
      for (var exit in exits) {
        distance = haversine(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          exits[exit],
          { unit: "km" }
        );
        if (prev_distance < distance) {
          console.log("SHORTEST");
          console.log(prev_exit);
          setSuburb(prev_exit);
          setkmPost(kmPosts[prev_exit]);
          return;
        }
        prev_distance = distance;
        prev_exit = exit;
      }
    } catch (err) {
      console.log("IncidentReport getLocation error");
      console.log(err);
    }
  };

  const incidentSubmit = async (details) => {
    try {
      //await dispatch(eTeamActions.toggle(username));
      await dispatch(driverActions.incidentSubmit(details));
      Alert.alert(
        "Incident submitted successfully!",
        "Thank you for notifying us",
        [{ text: "Okay" }]
      );
      setAccidentSelect(false);
      setOtherSelect(false);
      setSuburb(null);
      setkmPost(null);
      setDetails(null);
    } catch (err) {
      console.log("Report page eventSubmit function error");
      console.log(err);
    }
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Reporting</Text>
      </View>
      <KeyboardAwareScrollView style={styles.kbsView}>
        {/*figure out necessary fields*/}
        <Text style={styles.fieldText}>Emergency Type</Text>
        <Divider style={styles.divider} />
        <View style={styles.eTypeButtonContainer}>
          <Button
            onPress={() => {
              setAccidentSelect(true);
              setOtherSelect(false);
            }}
            title="Accident"
            buttonStyle={
              accidentSelect
                ? { ...styles.eTypeButton, backgroundColor: Colours.main }
                : styles.eTypeButton
            }
            titleStyle={styles.eTypeText}
          />
          <Button
            onPress={() => {
              setAccidentSelect(false);
              setOtherSelect(true);
            }}
            title="Other"
            buttonStyle={
              otherSelect
                ? { ...styles.eTypeButton, backgroundColor: Colours.main }
                : styles.eTypeButton
            }
            titleStyle={styles.eTypeText}
          />
        </View>
        <Text style={styles.fieldText}>Nearest Exit</Text>
        <Divider style={styles.divider} />
        <Input
          placeholder="Nearest exit..."
          showSoftInputOnFocus={false}
          value={suburb}
          onFocus={() => {
            setOverlayVisible(true);
          }}
        />
        <Overlay isVisible={overlayVisible} overlayStyle={styles.overlay}>
          <View>
            <KeyboardAwareScrollView>
              <Text
                style={{
                  color: "grey",
                  fontFamily: "WorkSans_500Medium",
                  fontSize: 20,
                }}
              >
                Nearest exit...
              </Text>
              {/* <Divider /> */}
              <Text
                style={{ fontFamily: "WorkSans_600SemiBold", fontSize: 15 }}
              >
                Use your phone's location service to determine the nearest exit
              </Text>
              <Button
                title="Find Nearest Exit"
                onPress={() => {
                  findNearestExit();
                  setOverlayVisible(false);
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Divider />
              <Text
                style={{ fontFamily: "WorkSans_600SemiBold", fontSize: 15 }}
              >
                Or select it manually (scroll down for more)
              </Text>
              <Button
                title="Kottawa"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Kottawa");
                  setkmPost("0");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Kahathuduwa"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Kahathuduwa");
                  setkmPost("5.9");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Gelanigama"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Gelanigama");
                  setkmPost("13.7");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Dodangoda"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Dodangoda");
                  setkmPost("34.8");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Welipanna"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Welipanna");
                  setkmPost("46");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Kurundugahahetekma"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Kurundugahahetekma");
                  setkmPost("67.6");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Baddegama"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Baddegama");
                  setkmPost("79.8");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Pinnaduwa"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Pinnaduwa");
                  setkmPost("95.3");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Imaduwa"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Imaduwa");
                  setkmPost("108");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Kokmaduwa"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Kokmaduwa");
                  setkmPost("116.5");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
              <Button
                title="Godagama"
                onPress={() => {
                  setOverlayVisible(false);
                  setSuburb("Godagama");
                  setkmPost("127");
                }}
                buttonStyle={{ backgroundColor: Colours.main }}
                titleStyle={{
                  fontFamily: "WorkSans_600SemiBold",
                  fontSize: 17,
                }}
                containerStyle={styles.overlayButton}
              />
            </KeyboardAwareScrollView>
          </View>
        </Overlay>
        <Text style={styles.fieldText}>Other Details</Text>
        <Input
          value={details}
          multiline={true}
          numberOfLines={4}
          containerStyle={{ marginTop: 5 }}
          inputContainerStyle={{ backgroundColor: "#eaeaea" }}
          inputStyle={{
            textAlignVertical: "top",
            fontFamily: "WorkSans_400Regular",
          }}
          placeholder="Include extra details here"
          style
        />
        <Divider style={styles.divider} />
        <Button
          title="Submit"
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitText}
          onPress={() => {
            let details = {
              isAccident:accidentSelect,
              kmPost:kmPost,
              suburb:suburb,
              sessionToken:token
            };
            console.log(JSON.stringify(details))
            incidentSubmit(details);
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

IncidentReport.navigationOptions = {
  headerTitle: "Reporting",
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
  headerText: {
    textAlign: "left",
    marginLeft: 10,
    fontSize: 30,
    fontFamily: "WorkSans_600SemiBold",
  },
  kbsView: {
    marginTop: 20,
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
  fieldText: {
    textAlign: "left",
    marginLeft: 10,
    fontSize: 20,
    fontFamily: "WorkSans_700Bold",
  },
  divider: {
    marginTop: 5,
    marginBottom: 10,
  },
  eTypeButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  eTypeButton: {
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 50,
    backgroundColor: Colours.mainLight,
  },
  eTypeText: {
    fontFamily: "WorkSans_600SemiBold",
    fontSize: 20,
  },
  dropDown: {
    flex: 1,
  },
  overlay: {
    flex: 0.8,
    width: "85%",
    borderRadius: 10,
  },
  overlayButton: {
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
  },
});

export default IncidentReport;
