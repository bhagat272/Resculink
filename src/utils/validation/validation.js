import { firebaseRemoteConfigData } from './firebaseRemoteConfig';
import {
  kAddress,
  kConfirmPassword,
  kCurrentPassword,
  kEmail,
  kFirstName,
  kLastName,
  kMobileNumber,
  kName,
  kNewPassword,
  kOldPassword,
  kPassword,
  kPhoneNumber,
  kUserName,
  kZipCode,
} from './validationValues';

const nameValidation = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
// const emailValidation = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //email

// const strongPassword = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
const strongPassword =
  /(?=^.{8,}$)((?=.*\d)(?=.*[\W_]+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const numberRegex = /^\d+$/;
const zipCodeRegex = /^[a-zA-z0-9]/;
const minLengthName = 1;
const maxLengthName = 45;
const maxLengthEmail = 50;
const minLengthPassword = 8;
const maxLengthPassword = 10;
const minLengthMobile = 7;
const maxLengthMobile = 15;
const minLengthZipCode = 4;
const maxLengthZipCode = 10;

export function ValidateForm(form) {
  let isValidForm = true;
  let password = '';

  for (let val in form.validators) {
    form.validators[val].error = '';

    for (let i in form.validators[val]) {
      let message = '';
      if (form.validators[val].error != '') break;
      let valData = form.validators[val][i];
      if (
        (valData == kPassword || valData == kNewPassword) &&
        (val == 'password' || val == 'new_password')
      ) {
        password = form[val];
      }
      if (
        valData == kName ||
        valData == kFirstName ||
        valData == kLastName ||
        valData == kUserName
      ) {
        if (!form[val] || !form[val].toString().trim()) {
          let msgType =
            valData == kName
              ? firebaseRemoteConfigData?.msg?.r_n
              : valData == kFirstName
                ? firebaseRemoteConfigData?.msg?.r_f_n
                : valData == kLastName
                  ? firebaseRemoteConfigData?.msg?.r_l_n
                  : firebaseRemoteConfigData?.msg?.r_u_n;

          message = msgType; //"Name is required";
        } else if (
          form[val].toString()?.length <
          firebaseRemoteConfigData?.lengths?.min_n
        ) {
          message = 'Name length is too short';
        } else if (
          form[val].toString()?.length >
          firebaseRemoteConfigData?.lengths?.max_n
        ) {
          message = 'Name length is too big';
        } else if (!nameValidation.test(form[val])) {
          let msgType =
            valData == kName
              ? firebaseRemoteConfigData?.msg?.v_n
              : valData == kFirstName
                ? firebaseRemoteConfigData?.msg?.v_f_n
                : valData == kLastName
                  ? firebaseRemoteConfigData?.msg?.v_l_n
                  : firebaseRemoteConfigData?.msg?.v_u_n;
          // message = "Invalid name";
          message = msgType;
        }
      } else if (valData == kEmail) {
        if (!form[val] || !form[val].toString().trim()) {
          // message = "Email is required";
          message = firebaseRemoteConfigData?.msg?.r_e;
        } else if (form[val].toString().length > maxLengthEmail) {
          message = 'Email length is too big';
        } else if (!emailValidation.test(form[val])) {
          message = firebaseRemoteConfigData?.msg?.v_e; //"Invalid email";
        }
      } else if (valData == kPassword || valData == kNewPassword) {
        if (!form[val] || !form[val].toString().trim()) {
          let msgType =
            valData == kPassword
              ? firebaseRemoteConfigData?.msg?.r_p
              : firebaseRemoteConfigData?.msg?.r_n_p;
          message = msgType; //`Password is required`;
        } else if (form[val].toString()?.length < minLengthPassword) {
          message =
            form.validators[val].from == "login" ? "" :
              `Password should be between 8 to 10 characters and should contain at least one uppercase, one lower case, one number and one special character.`;
        } else if (form[val].toString()?.length > maxLengthPassword) {
          message = `Password length is too big`;
        } else if (!strongPassword.test(form[val])) {
          let msgType =
            valData == kPassword
              ? firebaseRemoteConfigData?.msg?.v_p
              : firebaseRemoteConfigData?.msg?.v_n_p;
          message = msgType; //`Invalid password`;
        }
      } else if (valData == kOldPassword || valData == kCurrentPassword) {
        if (!form[val] || !form[val].toString().trim()) {
          message = firebaseRemoteConfigData?.msg?.r_c_p; //`Password is required`;
        } else if (form[val].toString()?.length < minLengthPassword) {
          message = `Password length is too short`;
        } else if (form[val].toString()?.length > maxLengthPassword) {
          message = `Password length is too big`;
        } else if (!strongPassword.test(form[val])) {
          message = `Invalid password`;
        }
      } else if (valData == kConfirmPassword) {
        if (!form[val] || !form[val].toString().trim()) {
          message = firebaseRemoteConfigData?.msg?.r_co_p; //`Confirm password is required`;
        }
        //  else if (form[val].toString()?.length < minLengthPassword) {
        //   message = `Confirm password length is too short`;
        // } else if (form[val].toString()?.length > maxLengthPassword) {
        //   message = `Confirm password length is too big`;
        // }
        else if (form[val] != password) {
          message = firebaseRemoteConfigData?.msg?.v_c_p; //`Confirm password does not match with password`;
        }
      } else if (valData == kPhoneNumber || valData == kMobileNumber) {
        let msgType =
          valData == kPhoneNumber
            ? firebaseRemoteConfigData?.msg?.r_ph
            : firebaseRemoteConfigData?.msg?.r_mb;
        if (!form[val] || !form[val].toString().trim()) {
          message = msgType; //"Mobile number is required";
        } else if (form[val].toString()?.length < minLengthMobile) {
          // message = 'Mobile number length is too short';
          message = 'Mobile number must be between 7 to 15 digits';
        } else if (form[val].toString()?.length > maxLengthMobile) {
          message = 'Mobile number length is too big';
        } else if (!numberRegex.test(form[val])) {
          message = 'Invalid mobile';
        }
      } else if (valData == kZipCode) {
        if (!form[val] || !form[val].toString().trim()) {
          message = firebaseRemoteConfigData?.msg?.r_z_c; //"Zip code is required";
        } else if (form[val].toString()?.length < minLengthZipCode) {
          message = 'Zip code length is too short';
        } else if (form[val].toString()?.length > maxLengthZipCode) {
          message = 'Zip code length is too big';
        } else if (!zipCodeRegex.test(form[val])) {
          message = 'Invalid zip code';
        }
      } else if (valData == kAddress) {
        if (!form[val] || !form[val].toString().trim()) {
          message = firebaseRemoteConfigData?.msg?.r_a; //"Address is required";
        }
      }
      if (message) {
        isValidForm = false;
        form.validators[val].error = message;
      } else {
        form.validators[val].error = '';
      }
    }
  }
  return {
    value: form,
    status: isValidForm,
  };
}
