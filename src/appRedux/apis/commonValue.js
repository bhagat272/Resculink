 

const kInternetError = "You're offline \n Please check internet connection.";
const kSorryError = 'Sorry, something wrong.';
const kStatus = 'status';
const kMessage = 'message';
const kTrue = true;
const kFalse = false;
const kPost = 'POST';
const kGet = 'GET';
const kPut = 'PUT';
const kUserToken = 'user_token';
const kUserData = 'userData';
const kRememberData = 'remember_me_data';
const kRememberManagerData = 'remember_manager_data';
const kUserFilterData = 'userFilterData';
const kAndroidProminent = 'androidProminent';
const KAUthToken = 'auth_token';
const kUserType = 'user_type';
const klocation = 'location';
const kRememberDataUser = 'remember_me_data_user';
const JSON_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
const MULTI_PART_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
};
const API_FAILED = {
  status: false,
  message: kSorryError,
};
const INTERNET_FAILED = {
  status: false,
  message: kInternetError,
};
export {
  BASE_URL,
  IMAGE_URL,
  PRIVACY_POLICY_URL,
  JSON_HEADER,
  MULTI_PART_HEADER,
  INTERNET_FAILED,
  API_FAILED,
  kStatus,
  kTrue,
  SOCKET_URL,
  kFalse,
  kRememberDataUser,
  kMessage,
  kInternetError,
  kSorryError,
  kPost,
  klocation,
  kGet,
  kPut,
  kUserData,
  kUserToken,
  kRememberData,
  kRememberManagerData,
  kUserFilterData,
  // PRIVACY_POLICY,
  // TERMS_AND_CON,
  // ABOUT_US,
  kAndroidProminent,
  KAUthToken,
  kUserType,
};
