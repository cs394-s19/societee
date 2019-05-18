import React from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";
import Map from "./Map";
import { Button, Footer,Text, withTheme } from 'react-native-elements';
import firebase from "../../config/Firebase";
import "firebase/firestore";

import MapView, { Marker, AnimatedRegion } from "react-native-maps";

const db = firebase.firestore();
// const functions = require("firebase-functions");

var users = db.collection("users");
var pins = db.collection("pins");

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      UID: "R9OjMaCD6weGIewgZyfYmzwdabR2"
    };
    this.handlePress = this.handlePress.bind(this);
  }
  componentDidMount() {}

  idToName = uid => {
    users
      .doc(uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("INVALID USER");
        } else {
          console.log(uid + "'s name is: " + doc.data().name);
        }
      })
      .catch(err => {
        console.log("Error getting user's name", err);
      });
  };

  queryPins = uid => {
    var myPins = [];
    let myPinQuery = pins.where("owner", "==", uid);
    // console.log(myPinQuery);
    myPinQuery
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          myPins.push(doc.data());
        });
      })
      .then(() => {
        console.log(myPins);
      });
  };

  fetchFriendsPins = () => {
    var myFriends = [];
    users
      .doc(this.state.UID)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No user found!");
        } else {
          console.log("User's friends:", doc.data().following);
          myFriends = doc.data().following;
        }
      })
      .then(() => {
        for (var i = 0; i < myFriends.length; i++) {
          this.idToName(myFriends[i]);
          this.queryPins(myFriends[i]);
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  };

  addPin = newPin => {
    var addedPin = pins.add(newPin);
    // var newPin = pins.doc("YEET").set(newData);
    // console.log(newPin);
  };

  deletePin = () => {
    //Need PIN ID
    pins.doc("YEET").delete();
  };

  handlePress(details) {
    const newLat = details.geometry.location.lat;
    const newLong = details.geometry.location.lng;

    const newPin = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      addr: details.formatted_address,
      note: "No note field yet",
      description: details.name,
      owner: this.state.UID,
      timestamp: Date.now()
    };

    this.addPin(newPin);

    this.setState({
      markers: [...this.state.markers, { latitude: newLat, longitude: newLong }]
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <SearchBar handlePress={this.handlePress} style={styles.bar} />
        <Button onPress={this.fetchFriendsPins}/>
        <Button onPress={this.queryPins(this.state.UID)}/>
        <Map markers={this.state.markers} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  },
  bar: {
    marginTop: 250
  }
});
