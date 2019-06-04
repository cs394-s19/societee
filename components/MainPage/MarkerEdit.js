import React, { Component } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  View,
  Alert,
  Image,
  ScrollView
} from "react-native";
import { Button, Icon } from "native-base";

export default class MarkerEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: this.props.currEditedPin,
      focused: false
    };
  }

  componentWillReceiveProps() {
    this.updateNote("Add a note about this location");
    this.setState({ focused: false });
  }

  updateNote = text => {
    var currPin = this.props.currEditedPin;
    currPin.note = text;
    this.setState({ pin: currPin });
  };

  onSubmitNote = pin => {
    // MESSY way to check if we are editing pin or creating new pin
    if (this.props.markerPressedDetail.description == pin.description) {
      this.props.editPin(this.props.markerPressedDetail.id, { note: pin.note });
    } else {
      // Create new pin
      if (pin.note) pin.photoURL = this.props.photo;
      this.props.addPin(pin);
    }
    this.props.closeMarkerEdit();
  };

  render() {
    // let Image;

    // if (this.props.photo=="") {
    //   Image = <View></View>
    // }
    // else {
    //   Image = <Image
    //             style={styles.locationImage}
    //             source={{
    //               uri: this.props.photo
    //             }}/>
    // }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.locationImage}
              source={{
                uri: this.props.photo
              }}
            />
            <Button
              large
              transparent
              primary
              style={styles.close}
              onPress={() => {
                this.props.closeMarkerEdit();
              }}
            >
              <Icon name="close" style={{ fontSize: 60, color: "#E64A4B" }} />
            </Button>
            <Text style={{ marginTop: 150, marginLeft: 150 }}>
              No photo available - add one!
            </Text>
            <TouchableOpacity style={styles.addPhotoButton}>
              <Text style={styles.addPhotoPlus}>+</Text>
              <Icon
                name="image"
                type="FontAwesome"
                style={styles.addPhotoIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.locationName}>
            {this.props.currEditedPin.description}
          </Text>
          {/* <Text style={styles.address}>{this.props.markerPressedDetail.addr}</Text> */}
          <TextInput
            style={
              this.state.focused ? styles.textInputBlack : styles.textInputGrey
            }
            onFocus={() => {
              this.setState({ focused: true });
              this.updateNote("");
            }}
            multiline={true}
            placeholder={this.props.currEditedPin.note}
            placeholderTextColor={"lightGrey"}
            onChangeText={text => this.updateNote(text)}
            onSubmitEditing={() => this.onSubmitNote(this.state.pin)}
          />
          <Button
            large
            transparent
            primary
            style={styles.submitButton}
            onPress={() => {
              this.onSubmitNote(this.state.pin);
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

const styles = {
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
    padding: 20,
    height: Dimensions.get("window").height - 300
  },
  close: {
    position: "absolute",
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
  submitButton: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "#E64A4B",
    width: 80,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row"
  },
  submitButtonText: {
    color: "#FDEBE1",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    width: "100%"
  }
};
