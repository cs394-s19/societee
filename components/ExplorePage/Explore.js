import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import Map from "../MainPage/Map";
import firebase from "../../config/Firebase";
import "firebase/firestore";
import CustomMultiPicker from "./CustomMultiPicker";
import Modal from "react-native-modal";

import MarkerView from "../MainPage/MarkerView";

const db = firebase.firestore();

var users = db.collection("users");
var pins = db.collection("pins");

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerPressed: false,
      markerPressedDetail: {},
      selectedIDs: [],
      favored: false,
      isModalVisible: false
    };
    this.showMarkerView = this.showMarkerView.bind(this);
    this.setMarkerPressedDetail = this.setMarkerPressedDetail.bind(this);
    this.alreadFavored = this.alreadFavored.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
  }

  setMarkerPressedDetail(marker) {
    this.setState({
      markerPressedDetail: marker
    });
  }

  showMarkerView = () => {
    this.setState({ markerPressed: !this.state.markerPressed });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
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

  render() {
    var fetchStates = this.props.FetchState;
    var allMarkers = fetchStates.your_markers.concat(
      fetchStates.friend_markers
    );

    var mapMarkers = allMarkers.filter(marker => {
      return this.state.selectedIDs.includes(marker.owner);
    });

    //needs a  label:value, label is name, value is id
    dic = fetchStates.idToNames;

    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute", //use absolute position to show button on top of the map
            bottom: "5%", //for center align
            left: "5%",
            alignSelf: "flex-end" //for align to right
          }}
        >
              <TouchableOpacity 
          style={styles.showButton}
          activeOpacity = { .7 }
          onPress = {this.toggleModal}>
          <Text style = {styles.cancelText}>Show Friends</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.modal}>
        <Modal 
        animationType = "slide"
        transparent = {true}
        style={{ zIndex: 1 }} 
        isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1, marginTop: 110 }}>
            <CustomMultiPicker
              options={dic}
              search={true} // should show search bar?
              multiple={true} //
              placeholder={"Search"}
              placeholderTextColor={"white"}
              returnValue={"value"} // label or value
              callback={res => {
                var filtered = res.filter(function(el) {
                  return el != null;
                });
                this.setState({ selectedIDs: filtered });
              }} // callback, array of selected items
              rowBackgroundColor={"white"}
              rowHeight={42}
              rowRadius={3}
              iconColor={"#E64A4B"}
              iconSize={30}
              selectedIconName={"ios-checkmark-circle"}
              unselectedIconName={"ios-radio-button-off"}
              selected={this.state.selectedIDs}
              // list of options which are selected by default
            />  
            <TouchableOpacity 
          style={styles.cancelButton}
          activeOpacity = { .7 }
          onPress = {this.toggleModal}>
          <Text style = {styles.cancelText}>Hide Friends</Text>
        </TouchableOpacity>
          </View>
        </Modal>
        </View>

        <Map
          idnames={fetchStates.idToNames}
          idcolors={fetchStates.idToColors}
          markers={mapMarkers}
          setMarkerPressedDetail={this.setMarkerPressedDetail}
          showMarkerView={this.showMarkerView}
          alreadFavored={this.alreadFavored}
        />
        <MarkerView
          user={this.props.user}
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
  modal:{
    position: 'absolute',
    bottom: 0,
    // left: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  },
  showButton:{
    paddingTop:10,
    paddingBottom:10,
    width: 120,
    backgroundColor:'#E64A4B',
    borderRadius:3,
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOpacity: .1,
  },
  cancelButton: {
    marginBottom: 60,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:6,
    marginRight:6,
    backgroundColor:'#E64A4B',
    borderRadius:3,
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOpacity: .1,
  },
  cancelText: {
    color: '#FDEBE1',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
