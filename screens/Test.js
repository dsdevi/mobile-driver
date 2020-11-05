import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as Speech from "expo-speech";


const Test = (props) => {

    const warnDriver = () => {
        Speech.speak('Danger zone approaching');
    }

  return (
    <View style={styles.centered}>
      <Text>Testing Speech</Text>
      <Text>Max Length: {Speech.maxSpeechInputLength}</Text>
      <Button title="Speak" onPress={warnDriver} />
    </View>
  );
};

const styles = StyleSheet.create({
    centered: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Test