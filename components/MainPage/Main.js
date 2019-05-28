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
      markers: [],
      UID: props.user,
      markerPressed: false,
      markerPressedDetail: {},
      markerEdit: false,
      currEditedPin: {},
      friendIDs: [],
      selectedIDs: [props.user],
      mapping: [],
      favored: false,
      isModalVisible: false,
      photo: ""
    };
    this.handlePress = this.handlePress.bind(this);
    this.showMarkerView = this.showMarkerView.bind(this);
    this.setMarkerPressedDetail = this.setMarkerPressedDetail.bind(this);
    this.idToName = this.idToName.bind(this);
    this.alreadFavored = this.alreadFavored.bind(this);
    this.setphoto = this.setphoto.bind(this);
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  componentWillMount() {
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
  setphoto(photo) {
    this.setState({ photo: photo });
  }
  setMarkerPressedDetail(marker) {
    this.setState({
      markerPressedDetail: {
        addr: marker.addr,
        description: marker.description,
        note: marker.note,
        owner: marker.owner
      }
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
    var friendNames = [];
    users
      .doc(this.state.UID)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No user found!");
        } else {
          myFriends = doc.data().following;
        }
      })
      .then(() => {
        this.setState({ friendIDs: myFriends });
        myFriends.forEach(friend => {
          this.idToName2(friend).then(idname => {
            console.log("**", idname);
            friendNames.push(idname);

            this.setState({ mapping: friendNames });
            console.log(this.state.mapping);
          });
        });
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
    pins.doc("D").delete();
  };

  alreadFavored = pid => {
    // console.log(pid + ": the pid you're looking for");
    var favorites = [];
    users
      .doc(this.state.UID)
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

  setfriendmapping = friendmapping => {
    this.setState({ mapping: friendmapping });
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
      owner: this.state.UID,
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
    var mapMarkers = this.state.markers.filter(marker => {
      return this.state.selectedIDs.includes(marker.owner);
    });
    //needs a  label:value, label is name, value is id
    var dic = {};
    for (var i = 0; i < this.state.mapping.length; i++) {
      dic[this.state.mapping[i].uid] = this.state.mapping[i].name;
    }
    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute", //use absolute position to show button on top of the map
            top: "50%", //for center align
            alignSelf: "flex-end" //for align to right
          }}
        >
          <Button
            title="Show friends"
            onPress={this.toggleModal}
            color="#841584"
          />
        </View>
        <Modal style={{ zIndex: 1 }} isVisible={this.state.isModalVisible}>
          <View style={{ flex: 0.5 }}>
            <CustomMultiPicker
              options={dic}
              search={true} // should show search bar?
              multiple={true} //
              placeholder={"Search"}
              placeholderTextColor={"#757575"}
              returnValue={"value"} // label or value
              callback={res => {
                console.log(res);

                var filtered = res.filter(function(el) {
                  return el != null;
                });

                filtered.push(this.props.user);
                this.setState({ selectedIDs: filtered });
              }} // callback, array of selected items
              rowBackgroundColor={"#eee"}
              rowHeight={40}
              rowRadius={5}
              iconColor={"#00a2dd"}
              iconSize={30}
              selectedIconName={"ios-checkmark-circle"}
              unselectedIconName={"ios-radio-button-off"}
              scrollViewHeight={130}
              // list of options which are selected by default
            />
            <Button title="Hide friends" onPress={this.toggleModal} />
          </View>
        </Modal>

        <MarkerEdit
          visible={this.state.markerEdit}
          closeMarkerEdit={() => this.toggleMarkerEdit()}
          currEditedPin={this.state.currEditedPin}
          addPin={pin => this.addPin(pin)}
          photo={this.state.photo}
        />
        <SearchBar
          handlePress={this.handlePress}
          style={styles.bar}
          setphoto={this.setphoto}
        />

        {/* <TouchableOpacity style={styles.adminButtons} title="friends pins" onPress={() => this.fetchFriendsPins()} />
        <TouchableOpacity
          title="my pins"
          onPress={() => this.queryPins(this.state.UID)}
        />
        <TouchableOpacity title="Edit pin" onPress={() => this.editPin({ hey: "lol" })} />
        <TouchableOpacity
          title="Add to favorites"
          onPress={() => this.addToFavorites()}
        />
        <TouchableOpacity title="show modal" onPress={() => this.showMarkerView()} /> */}

        <Map
          markers={mapMarkers}
          setMarkerPressedDetail={this.setMarkerPressedDetail}
          showMarkerView={this.showMarkerView}
          alreadFavored={this.alreadFavored}
        />

        <MarkerView
          markerPressed={this.state.markerPressed}
          markerPressedDetail={this.state.markerPressedDetail}
          showMarkerView={this.showMarkerView}
          addToFavorites={this.addToFavorites}
          removeFromFavorites={this.removeFromFavorites}
          favored={this.state.favored}
          photo={this.state.photo}
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
