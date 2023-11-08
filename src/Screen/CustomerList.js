import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { BASE_URL, PASSWORD, USERNAME } from "../../varible";
import base64 from "base-64";
import { useLogin } from "../Context/LoginProvider";
import { useNavigation } from "@react-navigation/native";
// import { Button } from "react-native-paper";

import { Button } from "@rneui/themed";
import { useCustomerInfo } from "../Context/CustomerProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

import axios from "axios";

export default function CustomerList() {
  const navigation = useNavigation();
  const { customerInformation, setCustomerInformation } = useCustomerInfo();

  const rainbowColors = ["#9bf6ff", "#f3ffbd"];
  const { isLoggedIn, setIsLoggedIn } = useLogin();
  const { userDetails } = isLoggedIn;

  const [data, setData] = useState([]);
  //Loading
  const [isLoading, setIsLoading] = useState(true);

  //filter part
  const [filteredData, setFilteredData] = useState([data]);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize with null

  useEffect(() => {
    // Filter data based on the search term
    const filtered = data.filter((item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  //fetch api
  const fetchCustomerData = async () => {
    try {
      const authHeader = "Basic " + base64.encode(USERNAME + ":" + PASSWORD);
      const response = await fetch(
        `${BASE_URL}/api/CustomerApi/GetAllCustomer?territoryId=${
          userDetails?.TerritoryId
        }&scId=${userDetails.ScId !== null ? userDetails.ScId : 1}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      const jsonData = await response.json();
      console.log(JSON.stringify(jsonData, null, 2));
      await AsyncStorage.setItem("customerData", JSON.stringify(jsonData));
      //await AsyncStorage.setItem('ApprovalSummary', JSON.stringify(jsonData));
      setData(jsonData);
      setFilteredData(jsonData);
      setIsLoading(false);
      return jsonData;
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      // setIsLoading(false);
      throw error;
    }
  };

  //============useing axious ================//
  // const fetchCustomerData = async () => {
  //   try {
  //     const authHeader = "Basic " + base64.encode(USERNAME + ":" + PASSWORD);

  //     const response = await axios.get(
  //       `${BASE_URL}/api/CustomerApi/GetAllCustomer?territoryId=${
  //         userDetails?.TerritoryId
  //       }&scId=${userDetails.ScId !== null ? userDetails.ScId : 1}`,
  //       {
  //         headers: {
  //           Authorization: authHeader,
  //         },
  //       }
  //     );

  //     const jsonData = response.data; // Axios response data is directly available as `data` property
  //     console.log(JSON.stringify(jsonData, null, 2));
  //     await AsyncStorage.setItem("customerData", JSON.stringify(jsonData));
  //     // await AsyncStorage.setItem('ApprovalSummary', JSON.stringify(jsonData));
  //     setData(jsonData);
  //     setFilteredData(jsonData);
  //     setIsLoading(false);
  //     return jsonData;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setIsLoading(false);
  //     // setIsLoading(false);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    // Fetch data from AsyncStorage
    AsyncStorage.getItem("customerData")
      .then((storedData) => {
        if (storedData) {
          const jsonData = JSON.parse(storedData);
          setData(jsonData);
          setFilteredData(jsonData);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error retrieving data from AsyncStorage:", error);
      });

    // Fetch data from the API
    fetchCustomerData();
  }, []);

  // useEffect(() => {
  //   fetchCustomerData();
  // }, []);

  const CreateOrder = (customerInfoList) => {
    navigation.navigate("Create Order", { customerInfoList: customerInfoList });
    setCustomerInformation(customerInfoList);
  };

  return (
    <>
      {/* implement search  part*/}
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Icon
            name="search" // Font Awesome icon name
            size={24}
            style={styles.icon}
          />
        </View>

        <View style={styles.headerAndButton}>
          <Text style={styles.header}>Customer List </Text>
          <TouchableOpacity>
            {/* <Button onPress={CreateOrder}>Create  Order</Button> */}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          // <ActivityIndicator
          //   size="large"
          //   color="#0000ff"
          //   // colors={COLORS.primary}
          //   style={styles.activityIndicator}
          // />

          <View style={styles.loadingContainer}>
            {/* <ActivityIndicator size="large" color="#0077b6" /> */}
            <LottieView
              source={require("../../Lottie/Animation6.json")} // Replace with your animation file path
              autoPlay
              loop
              style={styles.lottiContainer}
            />
          </View>
        ) : (
          // <ScrollView keyboardShouldPersistTaps={"handled"}>
          //   {filteredData.map((Customer, index) => (
          //     // <TouchableOpacity key={index}>
          //     <View
          //       key={index} // Set the key here
          //       style={[
          //         styles.productCard,
          //         {
          //           backgroundColor:
          //             rainbowColors[index % rainbowColors.length],
          //         },
          //       ]}
          //     >
          //       <View style={styles.textContainer}>
          //         <Text style={styles.productName}> {Customer.Name}</Text>
          //         <Text style={styles.productInfo}>
          //           ({Customer.CustomerId})
          //         </Text>
          //       </View>

          //       <Text style={styles.Address}>
          //         <Text>Address: </Text>
          //         {Customer.Address}
          //       </Text>

          //       <Text style={styles.DepotName}>
          //         <Text>Depot Name: </Text>
          //         {Customer.DepotName}
          //       </Text>

          //       <View style={{ alignSelf: "center" }}>
          //         <Button
          //           title="Create Order"
          //           buttonStyle={{ backgroundColor: "rgba(127, 220, 103, 1)" }}
          //           containerStyle={{
          //             height: 40,
          //             // width: 180,
          //             marginTop: 20,
          //             borderRadius: 10,
          //             // marginLeft:170
          //           }}
          //           titleStyle={{
          //             color: "white",
          //             // marginHorizontal: 20,
          //           }}
          //           onPress={() => CreateOrder(Customer)}
          //         />
          //       </View>
          //     </View>
          //     // </TouchableOpacity>
          //   ))}
          // </ScrollView>

          <FlatList
            data={filteredData}
            keyExtractor={(Customer, index) => index.toString()} // You can use a more unique key if available
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: Customer, index }) => (
              <View
                style={[
                  styles.productCard,
                  {
                    backgroundColor:
                      rainbowColors[index % rainbowColors.length],
                  },
                ]}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.productName}>{Customer.Name}</Text>
                  <Text style={styles.productInfo}>
                    ({Customer.CustomerId})
                  </Text>
                </View>

                <Text style={styles.Address}>
                  <Text>Address:</Text>
                  {Customer.Address}
                </Text>

                <Text style={styles.DepotName}>
                  <Text>Depot Name:</Text>
                  {Customer.DepotName}
                </Text>

                <View style={{ alignSelf: "flex-start" }}>
                  <Button
                    title="Create Order"
                    buttonStyle={{ backgroundColor: "rgba(127, 220, 103, 1)" }}
                    containerStyle={{
                      height: 40,
                      marginTop: 20,
                      borderRadius: 10,
                    }}
                    titleStyle={{
                      color: "#ebf2fa",

                    }}
                    onPress={() => CreateOrder(Customer)}
                  />
                </View>

              </View>
            )}
          />
        )}
      </View>

      {/* total */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          Total: {filteredData ? filteredData.length : data.length}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#caf0f8",
    padding: 16,
  },
  headerAndButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    color: "black",

    // fontWeight: "bold",
  },
  productInfo: {
    color: "black",

    //  marginTop: 8,
  },
  tradeLicense: {
    marginTop: 5,
    color: "black", // You can customize the color as needed
  },

  bottomTextContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#caf0f8",
    padding: 2,
    alignSelf: "center",
  },
  bottomText: {
    color: "black",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },

  textContainer: {
    flexDirection: "row",
    gap: 10,
  },
  DepotName: {
    marginTop: 10,
    color: "black",
  },
  Address: {
    marginTop: 10,
    color: "black",
  },
  loadingContainer: {
    alignSelf: "center",
    flex: 1,
    // justifyContent:"center",
    // alignItems:"center"
  },
  lottiContainer: {
    height: 50,
    width: 50,
  },
});
