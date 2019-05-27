import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Image
} from "react-native";
import { withTheme, Avatar, ListItem } from "react-native-elements";
import { Button, Icon } from "native-base";
import EntypoIcon from "react-native-vector-icons/Entypo";
import firebase from "../../config/Firebase";

const db = firebase.firestore();
// const functions = require("firebase-functions");

var users = db.collection("users");

export default class MarkerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerVisible: props.markerPressed, //call from props later
      picture: "url",
      name: "?"
    };
    this.setMarkerVisible = this.setMarkerVisible.bind(this);
    this.getName = this.getName.bind(this);
  }

  // This should probably get called in the parent Component when something gets clicked
  setMarkerVisible(visible) {
    this.setState({ markerVisible: visible });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.markerPressed !== this.state.markerVisible) {
      this.setState({ markerVisible: !this.state.markerVisible });
    }
  }

  getName = uid => {
    users
      .doc(uid)
      .get()
      .then(doc => {
        this.setState({ name: doc.data().name });
      });
  };

  render() {
    return (
      <View style={{ marginTop: 15, marginRight: 15 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.markerVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 22 }}>
            <View style={{ marginTop: 35, textAlign: "center" }}>
              <Text style={styles.title}>
                {this.props.markerPressedDetail.description}
              </Text>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={require("../../assets/images/millenium-park.jpg")}
                />
              </View>
              <View style={styles.avatar}>
                <ListItem
                  leftAvatar={{
                    title: "JD",
                    source: {},
                    showEditButton: true
                  }}
                  title={
                    this.props.markerPressedDetail.owner ? (
                      <Text>{this.props.markerPressedDetail.ownerName}</Text>
                    ) : (
                      "Unknown User"
                    )
                  }
                  subtitle={"April 30, 2019"}
                  chevron
                />
              </View>
              <Text style={styles.quote}>
                "{this.props.markerPressedDetail.note}"
              </Text>
              {this.props.favored ? (
                <Button
                  large
                  danger
                  onPress={() =>
                    this.props.removeFromFavorites(
                      this.props.markerPressedDetail.pid
                    )
                  }
                >
                  <Icon name="ios-heart" />
                </Button>
              ) : (
                <Button
                  large
                  primary
                  onPress={() =>
                    this.props.addToFavorites(
                      this.props.markerPressedDetail.pid
                    )
                  }
                >
                  <Icon name="ios-heart-empty" />
                </Button>
              )}
              <Button
                large
                transparent
                primary
                style={styles.close}
                onPress={() => {
                  this.props.showMarkerView();
                }}
              >
                <Icon name="close" style={{ fontSize: 60 }} />
              </Button>
            </View>
          </View>
        </Modal>

        {/* <TouchableHighlight
          onPress={() => {
            this.setMarkerVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight> */}
      </View>
    );
  }
}

const styles = {
  title: {
    textAlign: "center",
    fontSize: 30
  },
  imageContainer: {
    marginTop: 25,
    width: "100%",
    alignItems: "center",
    height: 250
  },
  image: {
    width: 250,
    height: 250,
    backgroundColor: "gray"
  },
  avatar: {
    marginTop: 20,
    marginLeft: 30
  },
  quote: {
    fontSize: 20,
    marginTop: 15,
    textAlign: "center"
  },
  close: {
    position: "absolute",
    top: -20,
    right: 10
  }
};
