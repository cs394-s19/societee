import React from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";
import Map from "./Map";
import { Button, Footer,Text, withTheme } from 'react-native-elements';
import firebase from "../../config/Firebase";
import "firebase/firestore";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";

import MarkerView from "./MarkerView";
import MarkerEdit from "./MarkerEdit";

const db = firebase.firestore();
// const functions = require("firebase-functions");

var users = db.collection("users");
var pins = db.collection("pins");

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      UID: "R9OjMaCD6weGIewgZyfYmzwdabR2",
      markerPressed: false,
      markerEdit: true,
    };
    this.handlePress = this.handlePress.bind(this);
    this.showMarkerView = this.showMarkerView.bind(this);
  }
  componentDidMount() {}

  showMarkerView = () => {
    // console.log("YEET")
    this.setState({markerPressed: !this.state.markerPressed});
    // console.log(!this.state.markerPressed)
  }

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

  toggleMarkerEdit = () => {
    this.setState({markerEdit: !this.state.markerEdit})
  }

  render() {
    return (
      <View style={styles.container}>
        <MarkerEdit 
          visible={this.state.markerEdit}
          closeMarkerEdit={() => this.toggleMarkerEdit()}/>
        <SearchBar handlePress={this.handlePress} style={styles.bar} />
        <Button title='friends pins' onPress={() => this.fetchFriendsPins()}/>
        <Button title='my pins' onPress={() => this.queryPins(this.state.UID)}/>
        <Button title='show modal' onPress={() => this.showMarkerView()}/>
        <Map markers={this.state.markers} />
        <MarkerView markerPressed={this.state.markerPressed} showMarkerView={this.showMarkerView}></MarkerView>
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
  },
  button : {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: 50,
    marginRight: 20,
    borderRadius: 30
  }
});
