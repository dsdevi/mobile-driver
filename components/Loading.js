import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const Loading = (props) => {
  return (
    <View style={styles.centered}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Loading</Text>
      </View>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
  },
  textContainer: {
    marginBottom: 10,
  },
});

export default Loading;
