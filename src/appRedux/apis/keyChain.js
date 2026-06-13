import AsyncStorage from '@react-native-async-storage/async-storage'

const setData = async (key, val) => {
    try {
        let tempValue = JSON.stringify(val);
        await AsyncStorage.setItem(key, tempValue);
    } catch (error) {
        console.error(error, "AsyncStorage")
    }
}

const getData = async (key) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value) {
            let newValue = JSON.parse(value);
            return newValue;
        } else {
            return value;
        }
    } catch (error) {
        console.error(error, "AsyncStorage")
        // Error retrieving data
    }
}

const removeItemValue = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
}

export {
    setData,
    getData,
    removeItemValue
}