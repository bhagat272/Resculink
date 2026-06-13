import { BUTTON_LOADING, SET_LOADING } from '../constants/loadingType'

export function loadingShow(loaderShow) {
     return {
        type: SET_LOADING,
        payload: loaderShow
    }
}
export function loadingButton(loaderShow) {
     return {
        type: BUTTON_LOADING,
        payload: loaderShow
    }
}
