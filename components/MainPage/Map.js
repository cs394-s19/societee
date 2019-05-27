import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker, AnimatedRegion } from "react-native-maps";
import { Button } from "react-native-elements";
import firebase from "../../config/Firebase";

function Map(props) {
  // console.log(props.colorID);
  return (
    <MapView showsUserLocation style={styles.map}>
      {props.markers.map((marker, index) => {
        var ownerName = props.idnames[marker.owner];
        marker.ownerName = ownerName;
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            onPress={() => {
              props.alreadFavored(marker.id);
              props.setMarkerPressedDetail(marker);
              props.showMarkerView();
            }}
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
