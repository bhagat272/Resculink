import React, { useState, useEffect } from "react";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import CountDown from "react-native-countdown-component";
import Colors from "../theme/colors";
import fonts from "../theme/fonts";

const Countdown = ({ item, onFinish, fromVideoCall }) => {
  const [totalDuration, setTotalDuration] = useState(item ? item : 0);

  useEffect(() => {
    setTotalDuration(item);
  }, []);

  return (
    <SafeAreaView>
      {totalDuration > 0 ? (
        <CountDown
          until={parseInt(totalDuration)}
          timeToShow={["S"]}
          timeLabels={!fromVideoCall && { d: "Days", h: "HR", m: "MM" }}
          timeLabelStyle={styles.timeLables}
          // separatorStyle={{ backgroundColor: "white", color: "#000" }}
          onFinish={() => onFinish()}
          digitTxtStyle={styles.digitTxtStyle}
          digitStyle={styles.digitStyle1}
          size={14}
          showSeparator={false}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default Countdown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    // padding: 20,
  },
  digitStyle: {},
  digitStyle1: {
    backgroundColor: Colors.white,
  },
  timeLables: {
    fontSize: fonts.SIZE_10,
    fontFamily: fonts.Montserrat_Regular,
   color: "#FECB6E",
  },

  digitTxtStyle: {
    fontSize: fonts.SIZE_15,
    fontFamily: fonts.Montserrat_Medium,
    color: "white",
    marginLeft: -5,
    fontWeight:"300"
  },
  digitTxtStyle1: {
    fontSize: 10,
  },
});
