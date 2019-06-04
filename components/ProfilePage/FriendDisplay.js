import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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

  follow(friend) {
    users.doc(this.props.user).update({
      following: firebase.firestore.FieldValue.arrayUnion(friend)
    });
  }

  render() {
    var realFriends = this.props.friendIDs.filter(friend => {
      return friend !== this.props.user;
    });

    var unfollowedUsers = Object.keys(this.props.allUsers).filter(user => {
      return !this.props.friendIDs.includes(user) && user !== this.props.user;
    });
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          key={"FriendLength"}
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 5,
            fontSize: 20
          }}
        >
          You are following {realFriends.length} friends:
        </Text>
        {realFriends.map((friend, index) => {
          return (
            <View key={index + "d"}>
              <Text
                key={index + "e"}
                style={{ textAlign: "center", fontSize: 16, marginBottom: 2 }}
              >
                {this.props.allUsers[friend]}
              </Text>
            </View>
          );
        })}
        <View style={styles.suggestedFriends}>
          <Text
            key={"All USERS"}
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 5,
              fontSize: 15,
              marginTop: 12
            }}
          >
            Suggested Friends:
          </Text>
          {unfollowedUsers.map((user, index) => {
            return (
              <Button
                style={{ height: 50 }}
                key={index + "c"}
                title={"Follow " + this.props.allUsers[user]}
                onPress={() => this.follow(user)}
              />
            );
          })}
        </View>
      </ScrollView>
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
  },
  suggestedFriends: {
    marginTop: 15
  }
});
