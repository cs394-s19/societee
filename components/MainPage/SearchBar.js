import React, { Component } from "react";
import { GoogleAPI } from "../../config/GoogleAPI";
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
import { Image } from "react-native-elements";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { photo: "" };
  }

  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder="Enter Location"
        minLength={2}
        autoFocus={false}
        returnKeyType={"default"}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          this.props.handlePress(details);
          // console.log(data);
          // console.log(details);
          let photorefer = "";
          let placeid = data.place_id;

          let placeDetails = fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${GoogleAPI}`
          )
            .then(response => {
              return response.json();
            })
            .then(myJson => {
              // console.log(myJson.result.photos);
              photorefer = myJson.result.photos[0].photo_reference;
              // console.log(photorefer);
              return photorefer;
            })
            .then(photorefer => {
              fetch(
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photorefer}&key=${GoogleAPI}`
              ).then(response => {
                // console.log(response.url);
                this.setState({ photorefer: response.url });
                this.props.setphoto(response.url);
              });
            });
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: GoogleAPI,
          language: "en" // language of the results
          // types: "(cities)" // default: 'geocode'
        }}
        styles={{
          textInputContainer: {
            backgroundColor: "rgba(0,0,0,0)",
            borderTopWidth: 0,
            borderBottomWidth: 0,
            margin: 15,
            marginTop: 40
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 50,
            color: "#5d5d5d",
            fontSize: 16,
            shadowOffset: { height: 2 },
            shadowColor: "black",
            shadowOpacity: 0.4
          },
          predefinedPlacesDescription: {
            color: "#1faadb"
          },
          listView: {
            position: "absolute",
            top: 0,
            bottom: 20,
            zIndex: -1,
            backgroundColor: "white",
            paddingTop: 100,
            height: "110%"
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
        listViewDisplayed={false}
      />
    );
  }
}
