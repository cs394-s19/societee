import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
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

  render() {
    var d = new Date();
    d.setTime(this.props.markerPressedDetail.timestamp);
    // console.log(this.props.markerPressedDetail.photoURL);
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.markerVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View>
            <View style={styles.imageContainer}>
              {/* <Image
                style={styles.locationImage}
                source={{ uri: this.props.markerPressedDetail.photoURL }}
              /> */}
              <Button
                large
                transparent
                primary
                style={styles.close}
                onPress={() => {
                  this.props.showMarkerView();
                }} >
                <Icon name="close" style={{ fontSize: 60 }} />
              </Button>
              <View style={styles.likeButtonContainer}>
                {this.props.favored ? (
                <Button
                  large
                  danger
                  onPress={() =>
                    this.props.removeFromFavorites(
                      this.props.markerPressedDetail.id
                    )
                  }
                  style={{height: 50}}
                >
                  <Icon name="ios-heart" />
                </Button>
              ) : (
                <Button
                  large
                  primary
                  onPress={() =>
                    this.props.addToFavorites(this.props.markerPressedDetail.id)
                  }
                  style={{height: 50}}
                >
                  <Icon name="ios-heart-empty" />
                </Button>
                )}
              </View>
              
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.locationName}>
                {this.props.markerPressedDetail.description}
              </Text>
                            
            </View>

            <View style={styles.avatar}>
              <ListItem
                leftAvatar={{
                  title: "JD",
                  source: {},
                  showEditButton: false
                }}
                title={
                  this.props.markerPressedDetail.owner ? (
                    <Text>{this.props.markerPressedDetail.ownerName}</Text>
                  ) : (
                    "Unknown User"
                  )
                }
                subtitle={Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(this.props.markerPressedDetail.timestamp)}
              />
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
  avatar: {
    marginTop: 20,
    marginLeft: 30,
  },
  close: {
    position: "absolute",
    top: -10,
    right: 10
  },
  imageContainer: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    backgroundColor: "white"
  },
  locationImage: {
    width: "100%",
    height: "100%"
  },
  addPhotoButton: {
    width: 80,
    height: 55,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  addPhotoIcon: {
    fontSize: 30,
    color: "grey"
  },
  addPhotoPlus: {
    fontSize: 20,
    color: "grey",
    marginRight: 5,
    fontWeight: "bold"
  },
  textInputGrey: {
    color: "lightgrey"
  },
  textInputBlack: {
    color: "black"
  },
  profile: {
    marginRight: 20
  },
  infoContainer: {
    padding: 20
  },
  close: {
    position: "absolute",
    fontSize: 30,
    color: "blue",
    top: 20,
    left: 10
  },
  locationName: {
    fontSize: 24,
    fontWeight: "bold"
  },
  address: {
    fontSize: 18,
    color: "grey",
    marginBottom: 20
    },
  likeButtonContainer: {
    position: "absolute",
    top: 230,
    right: 20,
  },
  editButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  }
};
