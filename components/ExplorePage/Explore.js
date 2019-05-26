import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Map from "../MainPage/Map";
import firebase from "../../config/Firebase";
import "firebase/firestore";
import CustomMultiPicker from "react-native-multiple-select-list";

import MarkerView from "../MainPage/MarkerView";

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
      friendIDs: [],
      selectedIDs: [],
      mapping: [],
      favored: false
    };
    this.showMarkerView = this.showMarkerView.bind(this);
    this.setMarkerPressedDetail = this.setMarkerPressedDetail.bind(this);
    this.idToName2 = this.idToName2.bind(this);
    this.alreadFavored = this.alreadFavored.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
  }

  componentWillMount() {
    this.fetchFriendIDS();
    var newMarkers = this.state.markers;
    pins.onSnapshot(
      docSnapshot => {
        let changes = docSnapshot.docChanges();
        changes.forEach(change => {
          const docOwner = change.doc.data().owner;
          if (
            // docOwner === this.state.UID ||
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
        this.setState({ 
          friendIDs: myFriends,
          selectedIDs: myFriends,
        });
        myFriends.forEach(friend => {
          this.idToName2(friend).then(idname => {
            // console.log("**", idname);
            friendNames.push(idname);

            this.setState({ mapping: friendNames });
            // console.log(this.state.mapping);
          });
        });
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  };

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

  setMarkerPressedDetail(marker) {
    this.setState({
      markerPressedDetail: {
        pid: marker.pid,
        addr: marker.addr,
        description: marker.description,
        note: marker.note,
        owner: marker.owner
      }
    });
  }

  showMarkerView = () => {
    this.setState({ markerPressed: !this.state.markerPressed });
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
  }

  addToFavorites = pid => {
    users.doc(this.state.UID).update({
      favorites: firebase.firestore.FieldValue.arrayUnion(pid)
    });
    this.setState({ favored: true });
  };

  removeFromFavorites = pid => {
    users.doc(this.state.UID).update({
      favorites: firebase.firestore.FieldValue.arrayRemove(pid)
    });
    this.setState({ favored: false });
  }

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
        {/* <CustomMultiPicker
          options={dic}
          search={false} // should show search bar?
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
        /> */}

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
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
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
