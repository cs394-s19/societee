import React from "react";
import { Text, Button, View, StyleSheet, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";
import Map from "./Map";
import firebase from "../../config/Firebase";
import "firebase/firestore";
import CustomMultiPicker from "react-native-multiple-select-list";
import Drawer from "react-native-drawer";
import MarkerView from "./MarkerView";
import MarkerEdit from "./MarkerEdit";
import EntypoIcon from "react-native-vector-icons/Entypo";

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
      owner: this.props.user,
      initialRegion: {
        latitude: this.props.FetchState.initialRegion.latitude,
        longitude: this.props.FetchState.initialRegion.longitude,
        latitudeDelta: this.props.FetchState.initialRegion.latitudeDelta,
        longitudeDelta: this.props.FetchState.initialRegion.longitudeDelta
      }
    };
    this.handlePress = this.handlePress.bind(this);
    this.showMarkerView = this.showMarkerView.bind(this);
    this.setMarkerPressedDetail = this.setMarkerPressedDetail.bind(this);
    this.alreadFavored = this.alreadFavored.bind(this);
    this.setphoto = this.setphoto.bind(this);
    this.setInitialRegion = this.setInitialRegion.bind(this);
    this.currentLocation = this.currentLocation.bind(this);
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    // console.log("close", this.state.selectedIDs);
  };
  setInitialRegion = (lat, long) => {
    this.setState({
      initialRegion: {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.0722,
        longitudeDelta: 0.0321
      }
    });
  };
  setphoto(photo) {
    this.setState({ photo: photo });
  }
  setMarkerPressedDetail(marker) {
    this.setState({
      markerPressedDetail: marker,
      initialRegion: {
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }
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

  editPin = (id, newNote) => {
    pins.doc(id).update(newNote);
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

  currentLocation = () => {
    console.log("inside current location");
    navigator.geolocation.getCurrentPosition(position => {
      // console.log(Number(position.coords.latitude) + "  " + Number(position.coords.longitude));
      this.setState({
        initialRegion: {
          latitude: Number(position.coords.latitude),
          longitude: Number(position.coords.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }
      })
    }, function (error) { alert(error) });
  }

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
          editPin={this.editPin}
          photo={this.state.photo}
          markerPressedDetail={this.state.markerPressedDetail}
        />
        <SearchBar
          handlePress={this.handlePress}
          style={styles.bar}
          setphoto={this.setphoto}
          setInitialRegion={this.setInitialRegion}
        />

        <Map
          markers={mapMarkers}
          setMarkerPressedDetail={this.setMarkerPressedDetail}
          showMarkerView={this.showMarkerView}
          alreadFavored={this.alreadFavored}
          idnames={fetchStates.idToNames}
          idcolors={fetchStates.idToColors}
          initialRegion={this.state.initialRegion}
        />

        <View
          style={{
            position: "absolute", //use absolute position to show button on top of the map
            bottom: "8%", 
            left: "6%",
            alignSelf: "flex-end" //for align to right
          }}
        >
          <TouchableOpacity
            style={styles.showButton}
            activeOpacity={0.7}
            onPress={() => {
              this.currentLocation();
            }}
          >
          <EntypoIcon
            name="direction"
            style={{ textAlign: "center" }}
            size={30}
            color='#FDEBE1'
          />
          </TouchableOpacity>
        </View>

        <MarkerView
          markerPressed={this.state.markerPressed}
          markerPressedDetail={this.state.markerPressedDetail}
          showMarkerView={this.showMarkerView}
          addToFavorites={this.addToFavorites}
          removeFromFavorites={this.removeFromFavorites}
          favored={this.state.favored}
          photo={this.state.photo}
          owner={this.state.owner}
          setEdit={pin => this.setState({ currEditedPin: pin })}
          markerEdit={() => this.toggleMarkerEdit()}
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
    marginTop: 300
  },
  button: { marginTop: 400 },
  showButton: {
    paddingTop: 14,
    paddingBottom: 10,
    height: 60,
    width: 60,
    backgroundColor: "#E64A4B",
    borderRadius: 30,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.1
  },
  cancelText: {
    color: "#FDEBE1",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },
});
