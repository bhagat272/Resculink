import {logout, saveAuthToken} from '../../utils/helper';
import {
  API_FAILED,
  INTERNET_FAILED,
  JSON_HEADER,
  BASE_URL,
  kPost,
  kUserToken,
  USER_TYPE,
  kGet,
  KAUthToken,
} from './commonValue';
import {GET_AUTH_TOKEN} from './endpoints';
import {getData, setData} from './keyChain';
import {isNetworkAvailable} from './network';

const methodFetchAccessToken = async () => {
  return new Promise(async (resolve, reject) => {
    let header = JSON_HEADER;
    let data = {
      access_token: 'resculink_acceess_token',
    };
    let params = {
      method: kPost,
      headers: {
        ...header,
      },
      body: JSON.stringify(data),
    };
    console.log('Vishal3');
    let accessToken = await getData(KAUthToken);
    if (!accessToken) {
      console.log('Vishal4');
      let url = BASE_URL + GET_AUTH_TOKEN;
      fetch(url, params)
        .then(async response => {
          console.log('accestoken response', response);
          let json = await response.json();
          if (json && json.status == true) {
            saveAuthToken(json?.data?.auth_token);
            setData(KAUthToken, json?.data?.auth_token);
            resolve(json?.data?.auth_token);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('access token error', error);
          resolve(false);
        });
    } else {
      resolve(accessToken);
    }
  });
};

export const post = async ({url, data, header = JSON_HEADER}) => {
  const isConnected = await isNetworkAvailable();
  if (isConnected == false) {
    return INTERNET_FAILED;
  }
  let authtoken = {authtoken: null};
  // authtoken.authtoken = await methodFetchAccessToken();
  let params = {
    method: kPost,
    headers: {
      ...header,
      ...(global.userToken && {Authorization: 'Bearer ' + global.userToken}),
      ...authtoken,
    },
    body: data,
  };

  console.log('post request', BASE_URL + url, params);
  try {
    const response = await fetch(BASE_URL + url, params);
    console.log('post respone----------->', response);
    const json = (await response?.json()) ?? {};

    if (json?.message === 'Your account has been deleted') {
      logout(true);
    }
    if (json?.status == '401' || json?.status == '404') {
      logout(true);
      return json;
    }
    return json;
  } catch (error) {
    console.log('post error =====>', error);
    return API_FAILED;
  } finally {
  }
};

export const get = async ({url}) => {
  const isConnected = await isNetworkAvailable();
  if (isConnected == false) {
    return INTERNET_FAILED;
  }
  let auth_token = {auth_token: null};
  auth_token.auth_token = await methodFetchAccessToken();
  let params = {
    method: kGet,
    headers: {
      JSON_HEADER,
      ...{Authorization: 'Bearer ' + global.userToken},
      ...auth_token,
    },
  };
  console.log('get request', BASE_URL + url, params);
  try {
    const response = await fetch(BASE_URL + url, params);
    console.log('get respone----->', response);
    const json = await response.json();
    if (response.status == '401' || response.status == '404') {
      logout(true);
      return json;
    }
    return json;
  } catch (error) {
    console.log('get error-------------> ', error);
    return API_FAILED;
  } finally {
  }
};

export async function retryUploadChatAttachment(
  uploadFn,
  maxRetries = 1,
  delay = 1000,
) {
  let attempt = 0;

  const attemptRequest = async () => {
    try {
      return await uploadFn();
    } catch (error) {
      // Stop retrying for backend validation errors
      if (error?.status === false || error?.status === 'false') {
        throw new Error(error?.message || 'Invalid image or video');
      }

      if (attempt >= maxRetries) {
        throw error;
      }

      attempt++;
      await new Promise(resolve => setTimeout(resolve, delay));
      return attemptRequest();
    }
  };

  return attemptRequest();
}
