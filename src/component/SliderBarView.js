import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions, Image, ImageBackground } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Colors from "../theme/colors";
import fonts from "../theme/fonts";
import imagePath from "../theme/imagePath";


const ScreenWidth = Dimensions.get("screen").width;
const CustomSliderMarkerLeft = (props) => {
  return (
    <View style={styles.leftMarker}>
   
    </View>
  );
};


let leftValue = 10;
let RightValue = "";

const SliderBarView = (props) => {
  const [rangeValue, setRangeValue] = useState([]);
  const valuesChange = (value) => {
    setRangeValue(value);
    props.onValuesChange(value);
  };

  const textTransformerTimes = (value) => {
    let str = leftValue.toString();
    str.slice(0, -1);

    return value === 0
      ? props.type == "price"
        ? "$1"
        : "0 "
      : props.type != "price"
      ? value + `${props.type == "distanceRange" ? " mis" : " "}`
      : "$" + value;
  };

  return (
    <View style={{}}>
      <MultiSlider
        customLabel={SliderCustomLabel(textTransformerTimes)}
        pressedMarkerStyle={{ backgroundColor: "red" }}
        enableLabel={true}
        selectedStyle={{backgroundColor:'#848DFF26',height:8}}
        unselectedStyle={{backgroundColor:'#D9D188',height:8}}
        trackStyle={{ borderRadius: 14, height: 14 }}
        values={[props.value[0], props.value[1]]}
        sliderLength={props.length}
        touchDimensions={{ height: 100, width: 100, borderRadius: 15 }}
        min={props.min}
        max={props.max}
        onValuesChange={(value) => {
          valuesChange(value);
        }}
        onValuesChangeFinish={(values) => {
          props?.onChangeFinish(values);
        }}
        isMarkersSeparated={true}
        customMarkerLeft={(e) => {
          return <CustomSliderMarkerLeft currentValue={e.currentValue} />;
        }}
        customMarkerRight={(e) => {
          return props?.enabledTwo ? (
            <CustomSliderMarkerRight currentValue={e.currentValue} />
          ) : null;
        }}
        step={props.step}
        enabledTwo={props?.enabledTwo}
      />
    </View>
  );
};

export default SliderBarView;
const styles = StyleSheet.create({
  leftMarker: {
    width: 26,
    height: 60,
    marginLeft: -5,
    top: 1,
  },
});

function SliderCustomLabel(textTransformer: (value: number) => string) {
  return function (props) {
    const {
      oneMarkerValue,
      twoMarkerValue,
      oneMarkerLeftPosition,
      twoMarkerLeftPosition,
      type,
    } = props;
    return (
      <View style={{}}>
        <LabelBase
          position={oneMarkerLeftPosition}
          value={textTransformer(oneMarkerValue)}
          valuePosition={"left"}
        />

        <View>
        </View>
      </View>
    );
  };
}

function LabelBase(props) {
  const { position, value, valuePosition } = props;

  if (valuePosition == "left") {
    leftValue = value;
  } else if (valuePosition == "right") {
    RightValue = value;
  }

  return (
   
     <ImageBackground
     resizeMode={'contain'}
     source={imagePath.map_pin}
     style={[
              {
                position: "absolute",
                justifyContent: "center",
                top: -11,
                width: 25,
                height: 36,
                
              },
              {
                left: position - width / 4,
              },
            ]}
     >
   <Text
        style={{
           textAlign: "center",
          color:Colors.primary.WHITE,
          fontFamily: fonts.Montserrat_Bold,
          fontSize:8,
          marginTop: -5,
        }}
      >
         {value}
     </Text> 

     </ImageBackground>
  
  );
}
const width = 50;
