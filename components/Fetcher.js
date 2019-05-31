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
      allUsers: {}
    };

    this.idToName2 = this.idToName2.bind(this);
  }

  componentWillMount() {
    this.fetchFriendIDS();
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

    var new_favorites;
    users.doc(this.props.user).onSnapshot(docSnapshot => {
      let changes = docSnapshot.data();
      new_favorites = changes.favorites;
      console.log(new_favorites);
      this.setState({ favored_markers: new_favorites });
    });
  }

  fetchFriendIDS = () => {
    var myFriends = [];
    var colors = require("./Color");

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
        var idToColorsTemp = {};
        myFriends.forEach(friend => {
          this.idToName2(friend).then(idname => {
            idToNamesTemp[idname.uid] = idname.name;
            idToColorsTemp[idname.uid] = colors.shift();
          });
        });
        this.setState({
          friendIDs: myFriends,
          idToNames: idToNamesTemp,
          idToColors: idToColorsTemp
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
