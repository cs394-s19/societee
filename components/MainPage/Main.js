import React from "react";
import { Button, View, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";
import Map from "./Map";
import firebase from "../../config/Firebase";
import "firebase/firestore";
import CustomMultiPicker from "react-native-multiple-select-list";
import Drawer from "react-native-drawer";
import MarkerView from "./MarkerView";
import MarkerEdit from "./MarkerEdit";

import Modal from "react-native-modal";
const db = firebase.firestore();

var users = db.collection("users");
var pins = db.collection("pins");

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerPressed: false,
      markerPressedDetail: {},
      markerEdit: false,
      currEditedPin: {},
      favored: false,
      isModalVisible: false,
      photo: "",
      owner: this.props.user
    };
    this.handlePress = this.handlePress.bind(this);
    this.showMarkerView = this.showMarkerView.bind(this);
    this.setMarkerPressedDetail = this.setMarkerPressedDetail.bind(this);
    this.alreadFavored = this.alreadFavored.bind(this);
    this.setphoto = this.setphoto.bind(this);
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    console.log("close", this.state.selectedIDs);
  };

  setphoto(photo) {
    this.setState({ photo: photo });
  }
  setMarkerPressedDetail(marker) {
    this.setState({
      markerPressedDetail: marker
    });
  }

  showMarkerView = () => {
    this.setState({ markerPressed: !this.state.markerPressed });
  };

  addPin = newPin => {
    var addedPin = pins.add(newPin);
  };

  deletePin = () => {
    //Need PIN ID
    pins.doc("D").delete();
  };

  alreadFavored = pid => {
    this.setState({
      favored: this.props.FetchState.favored_markers.includes(pid)
    });
  };

  addToFavorites = pid => {
    users.doc(this.props.user).update({
      favorites: firebase.firestore.FieldValue.arrayUnion(pid)
    });
    this.setState({ favored: true });
  };

  removeFromFavorites = pid => {
    users.doc(this.props.user).update({
      favorites: firebase.firestore.FieldValue.arrayRemove(pid)
    });
    this.setState({ favored: false });
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
    var fetchStates = this.props.FetchState;
    var favPinSet = new Set(fetchStates.favored_markers);

    var friendsMarkers = fetchStates.friend_markers.filter(marker => {
      return favPinSet.has(marker.id);
    });

    var mapMarkers = friendsMarkers.concat(fetchStates.your_markers);

    //needs a  label:value, label is name, value is id

    return (
      <View style={styles.container}>
        <MarkerEdit
          visible={this.state.markerEdit}
          closeMarkerEdit={() => this.toggleMarkerEdit()}
          markerPressedDetail={this.state.markerPressedDetail}
          currEditedPin={this.state.currEditedPin}
          addPin={pin => this.addPin(pin)}
          photo={this.state.photo}
          markerPressedDetail={this.state.markerPressedDetail}
        />
        <SearchBar
          handlePress={this.handlePress}
          style={styles.bar}
          setphoto={this.setphoto}
        />

        <Map
          markers={mapMarkers}
          setMarkerPressedDetail={this.setMarkerPressedDetail}
          showMarkerView={this.showMarkerView}
          alreadFavored={this.alreadFavored}
          idnames={fetchStates.idToNames}
          idcolors={fetchStates.idToColors}
        />

        <MarkerView
          markerPressed={this.state.markerPressed}
          markerPressedDetail={this.state.markerPressedDetail}
          showMarkerView={this.showMarkerView}
          addToFavorites={this.addToFavorites}
          removeFromFavorites={this.removeFromFavorites}
          favored={this.state.favored}
          photo={this.state.photo}
          owner={this.state.owner}
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
  button: { marginTop: 400 }
});
