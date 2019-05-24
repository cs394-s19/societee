import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker, AnimatedRegion } from "react-native-maps";
import { Button } from "react-native-elements";
import firebase from "../../config/Firebase";

const db = firebase.firestore();
// const functions = require("firebase-functions");

var users = db.collection("users");
var pins = db.collection("pins");

function Map(props) {
  return (
    <MapView showsUserLocation style={styles.map}>
      {props.markers.map((marker, index) => {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            onPress={() => {
                let pinDetail;
                pins.doc(marker.id).get()
                .then(response => pinDetail = response.data())
                .then(() => {
                  props.setMarkerPressedDetail({
                  addr: pinDetail.addr,
                  description: pinDetail.description,
                  note: pinDetail.note,
                  owner: pinDetail.owner,
                  })
                  console.log(pinDetail)
                })
                .then(props.showMarkerView())
              }
            }
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    zIndex: -1,
    ...StyleSheet.absoluteFillObject
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0
  }
});

export default Map;
