import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Colors from "../theme/colors";
import font from "../theme/fonts";
import imagePath from "../theme/imagePath";
import fonts from "../theme/fonts";
const countryData = require("../utils/countries.json");
const screenhight = Dimensions.get("window").height;

const CountryPicker = (props) => {
  const [searchKey, setSearchKey] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState(countryData);

  useEffect(() => {
    setIsLoading(true);
    setData(listData || []);
    setIsLoading(false);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.onSelect(item);
          setSearchKey("");
          // this.setState({searchKey: ''});
        }}
        style={styles.countryView}
      >


        <View style={styles.country}>
          <Text style={styles.countryText}>
            {item.name} ({item.dial_code})
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filterCountries = (value) => {
    setSearchKey(value);
  };

  let filteredData = [];
  const lowercasedFilter = searchKey.toLowerCase();
  if (data.length > 0) {
    filteredData = data.filter((item) => {
      return Object.keys(item).some((key) =>
        // item[key] &&
        // item[key].toString().toLowerCase().startsWith(lowercasedFilter),
        item[key]
          ? item[key].toString().toLowerCase().startsWith(lowercasedFilter)
          : item.name.toString().toLowerCase().startsWith(lowercasedFilter)
      );
    });
  }

  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={props.show}
      onRequestClose={() => {
        setSearchKey("");
        // this.setState({searchKey: ''});
        props.closeModal();
      }}
    >
      <SafeAreaView style={styles.modalparent}>
        <View style={styles.modalCenter}>
          <View style={styles.modalViewStyle}>
            <View style={{ ...styles.searchView, borderWidth: 1 }}>
              <TextInput
                placeholder={"Search"}
                onChangeText={(value) => filterCountries(value)}
                style={styles.searchInput}
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchKey("");
                  props.closeModal();
                }}
              >
                <Image
                  source={imagePath.close}
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: "contain",
                    padding: 8,
                    // tintColor: Colors.WATER_DARK,
                  }}
                />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={{ marginTop: screenhight / 3 }}>
                <ActivityIndicator size={"large"} color={"#000"} />
              </View>
            ) : null}


            <FlatList
              data={filteredData}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              // keyboardShouldPersistTaps={"handled"}
              keyboardShouldPersistTaps={"always"}
              style={{ marginBottom: 45 }}
              ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                  fontSize: fonts.SIZE_13,
                  fontFamily: fonts.Montserrat_Bold,
                  color: Colors.primary.BLACK,
                  flex: 1,
                  marginTop:'80%'
                }}>No data found</Text>

              </View>}
              // contentContainerStyle={{ flex: 1 }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  modalparent: {
    height: Dimensions.get("window").height,
  },
  modalCenter: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
  },
  modalViewStyle: {
    maxHeight: Dimensions.get("window").height,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  countryView: {
    borderColor: "#ddd",
    // borderBottomWidth: 1,
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingVertical: 15,
  },
  countryText: {
    fontFamily: font.Montserrat_Regular,
    fontSize: font.SIZE_16,
    color: "#000",
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    // borderBottomWidth: 1,
    marginBottom: 12,
    padding: 5,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
  },
  searchInput: {
    fontFamily: font.Montserrat_Regular,
    fontSize: 16,
    paddingVertical: 9,
    // backgroundColor: '#eee',
    marginLeft: 5,
    flex: 1,
  },
});
