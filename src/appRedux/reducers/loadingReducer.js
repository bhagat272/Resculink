import { BUTTON_LOADING, SET_LOADING } from '../constants/loadingType'

const initialState = {
    show: false,
    loadButton:false
}

const loadingReducer = (state = initialState, action) => {
    const { type, payload } = action
    // console.log(type,payload)
    switch (type) {
        case SET_LOADING:
            return {
                ...state,
                show: payload
            }
        case BUTTON_LOADING:
            return {
                ...state,
                loadButton: payload
            }
        default:
            return state
    }
}
export default loadingReducer;
