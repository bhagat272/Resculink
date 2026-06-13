import React from "react";
import { Platform } from "react-native";
import Contacts from "react-native-contacts";
import {
  contactPermissions,
  methodAndroidContactPermission,
} from "./appPermissions";
import { getLocales } from "react-native-localize";
import { getCountryCallingCode } from "libphonenumber-js";

export const getAllContact = (cb) => {
  if (Platform.OS == "ios") {
    accessContact(cb);
  } else {
    methodAndroidContactPermission((status) => {
      if (status) {
        accessContact(cb);
      } else {
        cb(false);
      }
    });
  }
};

const accessContact = (cb) => {
  contactPermissions((status) => {
    if (status) {
      Contacts.getAll().then((contacts) => {
        let allContacts = [];

        let arr = [...contacts];
        arr?.map((item) => {
          if (item?.phoneNumbers?.length > 0) {
            let contactNum = phoneNumberCorrectFormate(
              item?.phoneNumbers[0]?.number
            );
            let obj = {
              phoneNum: contactNum,
              username:
                item?.givenName +
                `${" "}${item?.middleName}` +
                `${" "}${item?.familyName}`,
            };
            allContacts.push(obj);
          }
        });
        cb(allContacts);
      });
    }
  });
};

const methodGetCode = () => {
  const locales = getLocales();
  let dialingCode = global?.userData?.country_code;
  if (locales.length > 0) {
    dialingCode = "+" + getCountryCallingCode(locales[0].countryCode);
  }
  return dialingCode;
};

const phoneNumberCorrectFormate = (strOldNumber) => {
  let strCheckContact = strOldNumber.toString();

  let correctContactNumber = strCheckContact.replace(/[^+0-9]/g, "");
  if (correctContactNumber.indexOf("+") == -1) {
    if (correctContactNumber.charAt(0).toString() == "0") {
      correctContactNumber = correctContactNumber.slice(1);
      if (correctContactNumber.charAt(0).toString() == "0") {
        correctContactNumber = correctContactNumber.slice(1);
      }
    }

    correctContactNumber = methodGetCode() + correctContactNumber;
  } else {
    if (correctContactNumber.startsWith("+")) {
      let checkUkCode = correctContactNumber.charAt(1).toString();
      if (Number(checkUkCode) == 1) {
        let removeCodeNumber = correctContactNumber.replace("+1", "");
        if (removeCodeNumber.charAt(0).toString() == "0") {
          removeCodeNumber = removeCodeNumber.slice(1);
          if (removeCodeNumber.charAt(0).toString() == "0") {
            removeCodeNumber = removeCodeNumber.slice(1);
          }
        }
        correctContactNumber = "1" + removeCodeNumber;
      }
    }
  }


  if (correctContactNumber.indexOf("+") == -1) {
    correctContactNumber = "+" + correctContactNumber
  }
  return correctContactNumber.replace(/[^+0-9]/g, "");
};