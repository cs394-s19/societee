import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker, AnimatedRegion } from "react-native-maps";
import { Button} from 'react-native-elements';

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
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    zIndex: -1,
    ...StyleSheet.absoluteFillObject,
  },
  button : {
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});

export default Map;
