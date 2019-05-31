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
  }

  render() {
    var realFriends = this.props.friendIDs.filter(friend => {
      return friend !== this.props.user;
    });
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          All Users:
        </Text>
        {Object.keys(this.props.allUsers).map((user, index) => {
          return (
            <Text key={index} style={{ textAlign: "center" }}>
              {this.props.allUsers[user]}
            </Text>
          );
        })}
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          You have {realFriends.length} friends:
        </Text>
        {realFriends.map((friend, index) => {
          return (
            <Text key={index} style={{ textAlign: "center" }}>
              {this.props.allUsers[friend]}
            </Text>
          );
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
