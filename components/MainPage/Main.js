import React from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";
import Map from "./Map";
import { Button, Footer, Text, withTheme } from "react-native-elements";
import firebase from "../../config/Firebase";
import "firebase/firestore";
import { Container, Header, Content, Tab, Tabs, TabHeading } from "native-base";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Octicon from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FriendDisplay from "../ProfilePage/FriendDisplay";

import AddPin from "../Buttons/AddPin";

import MapView, { Marker, AnimatedRegion } from "react-native-maps";
// import rnfirebase from "react-native-firebase";

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
      markerEdit: false,
      currEditedPin: {
        latitude: 0,
        longitude: 0,
        addr: 0,
        note: "No note field yet",
        description: "none",
        owner: "R9OjMaCD6weGIewgZyfYmzwdabR2",
        timestamp: Date.now()
      },
      friendIDs: []
    };
    this.handlePress = this.handlePress.bind(this);
    this.showMarkerView = this.showMarkerView.bind(this);
  }
  componentDidMount() {
    this.fetchFriendIDS();
    var newMarkers = this.state.markers;
    pins.onSnapshot(
      docSnapshot => {
        let changes = docSnapshot.docChanges();
        changes.forEach(change => {
          const docOwner = change.doc.data().owner;
          if (
            docOwner === this.state.UID ||
            this.state.friendIDs.includes(docOwner)
          ) {
            var newMarker = change.doc.data();
            newMarker.id = change.doc.id;
            newMarkers.push(newMarker);
            this.setState({ markers: newMarkers });
          }

          // console.log(`New state is now ${this.state.markers}`)
        });
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );
  }

  showMarkerView = () => {
    this.setState({ markerPressed: !this.state.markerPressed });
  };

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

  fetchFriendIDS = () => {
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
        this.setState({ friendIDs: myFriends });
      })
      .catch(err => {
        console.log("Error getting document", err);
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

  addToFavorites = () => {
    const pinID = "UILWqr6qcHxp4Z9vron7";
    users.doc(this.state.UID).update({
      favorites: firebase.firestore.FieldValue.arrayUnion(pinID)
    });
  };

  editPin = editedPin => {
    var editedPin = {
      description: "Desc",
      note: "WOW",
      timestamp: Date.now()
    };

    const pinID = "JBRCwAavBvVYUYnKAbnh";

    pins.doc(pinID).update(editedPin);
  };

  handlePress(details) {
    const newLat = details.geometry.location.lat;
    const newLong = details.geometry.location.lng;

    const newPin = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      addr: details.formatted_address,
      note: "",
      description: details.name,
      owner: this.state.UID,
      timestamp: Date.now()
    };

    // this.addPin(newPin);

    // this.setState({
    //   markers: [...this.state.markers, { latitude: newLat, longitude: newLong }]
    // });
    this.setState({
      currEditedPin: newPin,
      markerEdit: true,
      markers: [...this.state.markers, { latitude: newLat, longitude: newLong }]
    });
  }

  toggleMarkerEdit = () => {
    this.setState({ markerEdit: !this.state.markerEdit });
  };

  render() {
    return (
      <View style={styles.container}>
        <Tabs tabBarPosition="bottom">
          <Tab
            heading={
              <TabHeading>
                <EntypoIcon name="location" size={30} />
              </TabHeading>
            }
          >
            <MarkerEdit
              visible={this.state.markerEdit}
              closeMarkerEdit={() => this.toggleMarkerEdit()}
              currEditedPin={this.state.currEditedPin}
              addPin={pin => this.addPin(pin)}
            />
            <SearchBar handlePress={this.handlePress} style={styles.bar} />
            <Button
              title="friends pins"
              onPress={() => this.fetchFriendsPins()}
            />
            <Button
              title="my pins"
              onPress={() => this.queryPins(this.state.UID)}
            />
            <Button
              title="Edit pin"
              onPress={() => this.editPin({ hey: "lol" })}
            />
            <Button
              title="Add to favorites"
              onPress={() => this.addToFavorites()}
            />
            <Button title="show modal" onPress={() => this.showMarkerView()} />
            <Map markers={this.state.markers} />
            <MarkerView
              markerPressed={this.state.markerPressed}
              showMarkerView={this.showMarkerView}
            />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Octicon name="diff-added" size={30} />
              </TabHeading>
            }
          >
            <View style={styles.container}>
              <Text style={{ textAlign: "center" }}>Add pins tab</Text>
            </View>
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <FontAwesome name="users" size={30} />
              </TabHeading>
            }
          >
            <View style={styles.container}>
              <FriendDisplay />
            </View>
          </Tab>
        </Tabs>
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
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 50,
    marginRight: 20,
    borderRadius: 30
  }
});
