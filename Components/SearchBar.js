import React, { Component } from "react";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  AlertIOS
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";

function SearchBar(props) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Enter Location"
      minLength={2}
      autoFocus={false}
      returnKeyType={"default"}
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data);
        console.log(details);
      }}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: "AIzaSyCjrNwqOpAgdCY91yRDHQROWdTVe4MeQ2s",
        language: "en" // language of the results
        // types: "(cities)" // default: 'geocode'
      }}
      styles={{
        textInputContainer: {
          backgroundColor: "rgba(0,0,0,0)",
          borderTopWidth: 0,
          borderBottomWidth: 0
        },
        textInput: {
          marginLeft: 0,
          marginRight: 0,
          height: 80,
          color: "#5d5d5d",
          fontSize: 16
        },
        predefinedPlacesDescription: {
          color: "#1faadb"
        },
        listView: {
          marginTop: 50
        }
      }}
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: "distance"
      }}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: "formatted_address"
      }}
    />
  );
}

export default SearchBar;
