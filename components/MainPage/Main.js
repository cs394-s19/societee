import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";
import Map from "./Map";
import firebase from "../../config/Firebase";
import "firebase/firestore";
import CustomMultiPicker from "react-native-multiple-select-list";

import MarkerView from "./MarkerView";
import MarkerEdit from "./MarkerEdit";

const db = firebase.firestore();

var users = db.collection("users");
var pins = db.collection("pins");

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      markerPressed: false,
      markerPressedDetail: {},
      markerEdit: false,
      currEditedPin: {},
      favored: false,
      idToNames: {}
    };
    this.handlePress = this.handlePress.bind(this);
    this.showMarkerView = this.showMarkerView.bind(this);
    this.setMarkerPressedDetail = this.setMarkerPressedDetail.bind(this);
    this.alreadFavored = this.alreadFavored.bind(this);
  }

  componentWillMount() {
    this.fetchFriendIDS(); // Used to get {uid: uid, name: name} of each friend

    var newMarkers = this.state.markers;
    pins.onSnapshot(
      // fetches only current USERS pins
      docSnapshot => {
        let changes = docSnapshot.docChanges();
        changes.forEach(change => {
          const docOwner = change.doc.data().owner;
          if (docOwner === this.props.user) {
            var newMarker = change.doc.data();
            newMarker.id = change.doc.id;
            newMarkers.push(newMarker);
          }
        });
        this.setState({ markers: newMarkers });
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );
  }

  setMarkerPressedDetail(marker) {
    this.setState({
      markerPressedDetail: marker
    });
  }

  idToName2 = uid => {
    var idName = {};
    return users
      .doc(uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("INVALID USER");
        } else {
          return (idName = { uid: uid, name: doc.data().name });
        }
      })
      .catch(err => {
        console.log("Error getting user's name", err);
      });
  };

  showMarkerView = () => {
    this.setState({ markerPressed: !this.state.markerPressed });
  };

  fetchFriendIDS = () => {
    // Creates ID to Name mappings
    var myFriends = [];
    var friendNames = [];
    users
      .doc(this.props.user)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No user found!");
        } else {
          myFriends = doc.data().following;
          myFriends.push(this.props.user);
        }
      })
      .then(() => {
        var idToNamesTemp = {};
        myFriends.forEach(friend => {
          this.idToName2(friend).then(idname => {
            friendNames.push(idname);
            idToNamesTemp[idname.uid] = idname.name;
          });
        });
        this.setState({ friendIDs: myFriends, idToNames: idToNamesTemp });
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  };

  addPin = newPin => {
    var addedPin = pins.add(newPin);
  };

  deletePin = () => {
    //Need PIN ID
    pins.doc("D").delete();
  };

  alreadFavored = pid => {
    // console.log(pid + ": the pid you're looking for");
    var favorites = [];
    users
      .doc(this.props.user)
      .get()
      .then(doc => {
        favorites = doc.data().favorites;
        // console.log(favorites);
      })
      .then(() => {
        if (favorites.includes(pid)) {
          // console.log("favored!");
          this.setState({ favored: true });
        } else {
          // console.log("not favored yet!");
          this.setState({ favored: false });
        }
      })
      .catch(err => {
        console.log("Error getting favored info", err);
      });
  };

  addToFavorites = pid => {
    return;
  };

  removeFromFavorites = pid => {
    return;
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
    const newPin = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      addr: details.formatted_address,
      note: "",
      description: details.name,
      owner: this.props.user,
      timestamp: Date.now()
    };

    this.setState({
      currEditedPin: newPin,
      markerEdit: true
      // markers: [...this.state.markers, { latitude: newLat, longitude: newLong }] // bug here?
    });
  }

  toggleMarkerEdit = () => {
    this.setState({ markerEdit: !this.state.markerEdit });
  };

  render() {
    var mapMarkers = this.state.markers;

    //needs a  label:value, label is name, value is id

    return (
      <View style={styles.container}>
        <MarkerEdit
          visible={this.state.markerEdit}
          closeMarkerEdit={() => this.toggleMarkerEdit()}
          currEditedPin={this.state.currEditedPin}
          addPin={pin => this.addPin(pin)}
        />
        <SearchBar handlePress={this.handlePress} style={styles.bar} />

        <Map
          markers={mapMarkers}
          setMarkerPressedDetail={this.setMarkerPressedDetail}
          showMarkerView={this.showMarkerView}
          alreadFavored={this.alreadFavored}
          idnames={this.state.idToNames}
        />

        <MarkerView
          markerPressed={this.state.markerPressed}
          markerPressedDetail={this.state.markerPressedDetail}
          showMarkerView={this.showMarkerView}
          addToFavorites={this.addToFavorites}
          removeFromFavorites={this.removeFromFavorites}
          favored={this.state.favored}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  adminButtons: {},
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
