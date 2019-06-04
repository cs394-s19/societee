import React from "react";
import Navbar from "./NavBar";
import firebase from "../config/Firebase";
import "firebase/firestore";

const db = firebase.firestore();

var users = db.collection("users");
var pins = db.collection("pins");

export default class Fetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      your_markers: [], // detailed pins + pid
      friend_markers: [], // detailed pins + pid
      favored_markers: [], // array of pids
      idToNames: {}, // uid => name
      idToColors: {},
      friendIDs: [], // pids
      allUsers: {},
      colors: require("./Color")
    };

    this.idToName2 = this.idToName2.bind(this);
  }

  componentWillMount() {
    // this.fetchFriendIDS();
    var colors = require("./Color");

    this.fetchUserInfo().then(user => {
      var idToColorsInit = this.state.idToColors;
      var idToNamesInit = this.state.idToNames;
      idToColorsInit[user.id] = colors.shift();
      idToNamesInit[user.id] = user.name;
      this.setState({ idToColors: idToColorsInit, idToNames: idToNamesInit });
    });

    var new_favorites;
    var new_following;
    users.doc(this.props.user).onSnapshot(docSnapshot => {
      let changes = docSnapshot.data();
      new_favorites = changes.favorites;
      new_following = changes.following;
      if (new_following !== this.state.friendIDs) {
        var idToNamesTemp = this.state.idToNames;
        var idToColorsTemp = this.state.idToColors;
        new_following.forEach(following => {
          if (!this.state.friendIDs.includes(following)) {
            this.fetchFriendPins(following);
            this.idToName2(following).then(idname => {
              idToNamesTemp[idname.uid] = idname.name;
              idToColorsTemp[idname.uid] = colors.shift();
            });
            this.setState({
              idToNames: idToNamesTemp,
              idToColors: idToColorsTemp
            });
          }
        });
      }

      this.setState({
        favored_markers: new_favorites,
        friendIDs: new_following
      });
    });

    var your_markers = this.state.your_markers;
    var friend_markers = this.state.friend_markers;
    pins.onSnapshot(
      docSnapshot => {
        let changes = docSnapshot.docChanges();
        changes.forEach(change => {
          const docOwner = change.doc.data().owner;
          var newMarker = change.doc.data();
          newMarker.id = change.doc.id;
          if (docOwner === this.props.user) {
            your_markers.push(newMarker);
          } else if (this.state.friendIDs.includes(docOwner)) {
            friend_markers.push(newMarker);
          }
        });
        this.setState({
          your_markers: your_markers,
          friend_markers: friend_markers
        });
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );

    var allUsers = {};
    users.onSnapshot(docSnapshot => {
      let changes = docSnapshot.docChanges();
      changes.forEach(change => {
        allUsers[change.doc.id] = change.doc.data().name;
      });
      this.setState({ allUsers: allUsers });
    });
  }

  fetchUserInfo = () => {
    return users
      .doc(this.props.user)
      .get()
      .then(snapshot => {
        var userID = { id: snapshot.id };
        return { ...userID, ...snapshot.data() };
      });
  };

  fetchFriendPins = friend => {
    var oldfriendmarkers = this.state.friend_markers;
    pins
      .where("owner", "==", friend)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var newMarker = doc.data();
          newMarker.id = doc.id;
          oldfriendmarkers.push(newMarker);
        });
      });
    this.setState({ friend_markers: oldfriendmarkers });
  };

  fetchFriendIDS = () => {
    var myFriends = [];
    colorCopy = this.state.colors;
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
        var idToNamesTemp = this.state.idToNames;
        var idToColorsTemp = this.state.idToColors;
        myFriends.forEach(friend => {
          this.idToName2(friend).then(idname => {
            idToNamesTemp[idname.uid] = idname.name;
            idToColorsTemp[idname.uid] = colorCopy.shift();
          });
        });
        this.setState({
          friendIDs: myFriends,
          idToNames: idToNamesTemp,
          idToColors: idToColorsTemp,
          colors: colorCopy
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

  render() {
    return <Navbar user={this.props.user} FetchState={this.state} />;
  }
}
