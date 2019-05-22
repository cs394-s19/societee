import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Footer, Text, withTheme } from "react-native-elements";
import firebase from "../../config/Firebase";
import "firebase/firestore";

const db = firebase.firestore();
// const functions = require("firebase-functions");

var users = db.collection("users");
var pins = db.collection("pins");

export default class FriendDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
  }

  componentWillMount() {
    this.fetchFriendIDS2();
  }

  fetchFriendIDS2 = () => {
    const UID = "R9OjMaCD6weGIewgZyfYmzwdabR2";
    var myFriends = [];
    var friendNames = [];
    users
      .doc(UID)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No user found!");
        } else {
          //   console.log("User's friends", doc.data().following);
          myFriends = doc.data().following;
        }
      })
      .then(() => {
        myFriends.forEach(friend => {
          this.idToName2(friend).then(idname => {
            console.log(idname);
            friendNames.push(idname);
            this.setState({ friends: friendNames });
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

  render() {
    console.log(this.state.friends);
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          You have {this.state.friends.length} friends:
        </Text>
        {/* <Button
          title="fetch my friends"
          onPress={() => this.fetchFriendIDS2()}
        /> */}
        {this.state.friends.map(friend => {
          return <Text style={{ textAlign: "center" }}>{friend.name}</Text>;
        })}
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
  }
});
