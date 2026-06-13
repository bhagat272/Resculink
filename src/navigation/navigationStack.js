import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import ImageController from '../permissions/imageController';
import Welcome from '../screen/auth/welcome';
import Login from '../screen/auth/login';
import ForgetPassword from '../screen/auth/forgetPassword';
import SignUp from '../screen/auth/signup';
import OtpVerification from '../screen/auth/otpVerification';
import CreateProfile from '../screen/auth/createProfile';
import ResetPassword from '../screen/auth/resetPassword';
import ChangePassword from '../screen/auth/changePassword';
import Splash from '../screen/appScreen/splash';
import EditProfile from '../screen/auth/editProfile';
import WelcomeTwo from '../screen/auth/welcomeTwo';
import DeleteAccount from '../screen/auth/deleteAccount';
import PrivacyPolicy from '../screen/appScreen/privacyPolicy';
import EditProfileProvider from '../screen/auth/editProfileProvider';
import HomeScreen from '../screen/appScreen/homeScreen';
import ProfileScreen from '../screen/appScreen/profileScreen';
import CreateProfileTwo from '../screen/auth/createProfileTwo';
import HomeScreenTwo from '../screen/appScreen/homeScreenTwo';
import ViewImage from '../screen/appScreen/ViewImage';
import ManageVenue from '../screen/appScreen/manageVenue';
import CompletedTask from '../screen/appScreen/completedTask';
import DistressSignalHistory from '../screen/appScreen/distressSignalHistory';
import Notifications from '../screen/appScreen/notifications';
import EmployeeGroup from '../screen/appScreen/employeeGroup';
import GroupMembers from '../screen/appScreen/groupMembers';
import FirstHome from '../screen/appScreen/firstHome';
import InviteToParty from '../screen/appScreen/inviteToParty';
import Medical from '../screen/appScreen/medical';
import Security from '../screen/appScreen/security';
import Filter from '../screen/appScreen/filter';
import DetailScreen from '../screen/appScreen/detailScreen';
import UserNotification from '../screen/appScreen/UserNotification';
import StatusDetail from '../screen/appScreen/statusDetail';
import ChatScreen from '../screen/appScreen/chatScreen';
import StoryView from '../screen/appScreen/storyView';
import GroupChatScreen from '../screen/appScreen/GroupChatScreen';
import SelectVenue from '../screen/appScreen/selectVenue';
import SelectedVenue from '../screen/appScreen/selectedVenue';
import PartyModeScreen from '../screen/appScreen/PartyModeScreen';
import PartyChat from '../screen/appScreen/PartyChat';
import PendingMapView from '../screen/appScreen/PendingMapView';
import MyPartyMap from '../screen/appScreen/MyPartyMap';
import AddinParty from '../screen/appScreen/AddinParty';
// import BottomTab from "./bottomTab";

const Stack = createStackNavigator();

const options = {
  // gestureEnabled: true, // If you want to swipe back like iOS on Android
  // ...TransitionPresets.SlideFromRightIOS,
  // ...TransitionPresets.DefaultTransition,
};
function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          animation: 'fade',
        }}
        initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false, ...options}}
        />

        <Stack.Screen
          name="WelcomeTwo"
          component={WelcomeTwo}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />
        <Stack.Screen
          name="StoryView"
          component={StoryView}
          options={{headerShown: true, headerTransparent: true}}
        />

        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false, ...options}}
        />

        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false, ...options}}
        />

        <Stack.Screen
          name="HomeScreenTwo"
          component={HomeScreenTwo}
          options={{headerShown: false, ...options}}
        />
        <Stack.Screen
          name="FirstHome"
          component={FirstHome}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="InviteToParty"
          component={InviteToParty}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false, ...options}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false, ...options}}
        />

        <Stack.Screen
          name="DetailScreen"
          component={DetailScreen}
          options={{headerShown: false, ...options}}
        />

        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="SelectedVenue"
          component={SelectedVenue}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="SelectVenue"
          component={SelectVenue}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="GroupChatScreen"
          component={GroupChatScreen}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="ViewImage"
          component={ViewImage}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />
        <Stack.Screen
          name="ManageVenue"
          component={ManageVenue}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="DistressSignalHistory"
          component={DistressSignalHistory}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="CompletedTask"
          component={CompletedTask}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="GroupMembers"
          component={GroupMembers}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="EmployeeGroup"
          component={EmployeeGroup}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="PartyModeScreen"
          component={PartyModeScreen}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="PartyChat"
          component={PartyChat}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="StatusDetail"
          component={StatusDetail}
          options={{headerShown: false, ...options}}
        />
        <Stack.Screen
          name="Medical"
          component={Medical}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="Security"
          component={Security}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="MyPartyMap"
          component={MyPartyMap}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="AddinParty"
          component={AddinParty}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="PendingMapView"
          component={PendingMapView}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="Filter"
          component={Filter}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="EditProfileProvider"
          component={EditProfileProvider}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />

        <Stack.Screen
          name="OtpVerification"
          component={OtpVerification}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="CreateProfileTwo"
          component={CreateProfileTwo}
          options={{headerShown: true, ...options}}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{headerShown: true, ...options}}
        />
        {/* <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{ headerShown: false ,...options}}
        /> */}
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerShown: true, ...options}}
        />

        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />

        <Stack.Screen
          name="UserNotification"
          component={UserNotification}
          options={{headerShown: true, headerTransparent: true, ...options}}
        />

        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="ImageController"
            component={ImageController}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'none',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
