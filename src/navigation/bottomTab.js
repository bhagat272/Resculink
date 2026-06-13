import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  DeviceEventEmitter,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import imagePath from "../theme/imagePath";
import Colors from "../theme/colors";
import fonts from "../theme/fonts";
import { useDispatch, useSelector } from "react-redux";
import HomeScreen from "../screen/appScreen/homeScreen";
import ProfileScreen from "../screen/appScreen/profileScreen";

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

const DeviceW = Dimensions.get("screen").width;
const RenderTabIcons = (props) => {
  const { icon, activeIcon, isFocused, name } = props;

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          width: DeviceW / 3,
          paddingHorizontal: 10,
          flexDirection: "row",
          paddingTop: 8,
        },
        isFocused ? {} : "",
      ]}
    >
      <View style={styles.activeIcon}>
        <Image
          source={isFocused ? activeIcon : icon}
          style={{
            height: 25,
            width: 25,
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            fontSize: fonts.SIZE_10,
            marginLeft: 3,
            fontFamily: fonts.Nunito_Bold,
            marginTop: 10,
            color: isFocused ? Colors.secondary.DARK_SKY_BLUE : Colors.secondary.GREY_CHATEAU,
          }}
        >
          {name}
        </Text>
      </View>
    </View>
  );
};
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ headerShown: false, headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}


function CusHomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={CusHomeScreen}
        options={{ headerShown: false, headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}



function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
const BottomTab = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.session.userData);
  const profileApiCall = () => {};
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        headerBackVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        tabBarStyle: {
          height: Platform.OS == 'ios' ? 105 : 85,
          backgroundColor: Colors.primary.WHITE,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3,
          elevation: 20,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "",
          keyboardHidesTabBar: true,
          tabBarIcon: ({ focused }) => {
            return (
              <RenderTabIcons
                icon={imagePath.homeEnable}
                activeIcon={imagePath.homeActive}
                name={"Home"}
                isFocused={focused}
              />
            );
          },
        }}
        screenOptions={{ headerShown: false }}
      />
      
      
      <Tabs.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <RenderTabIcons
                icon={imagePath.profileDisable}
                activeIcon={imagePath.profileActive}
                name={"Profile"}
                isFocused={focused}
              />
            );
          },
        }}
        screenOptions={{ headerShown: false }}
      />
    </Tabs.Navigator>

    
  );
};
export default BottomTab;
const styles = StyleSheet.create({
  activeIcon: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: 44,
    paddingHorizontal: 10,
  },
  nonActive: {},
});
