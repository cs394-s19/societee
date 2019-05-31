import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Marker, AnimatedRegion } from "react-native-maps";
import { Button } from "react-native-elements";
import firebase from "../../config/Firebase";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MapView showsUserLocation style={styles.map}>
        {this.props.markers.map((marker, index) => {
          var ownerName = this.props.idnames[marker.owner];
          marker.ownerName = ownerName;
          return (
            <Marker
              pinColor={this.props.idcolors[marker.owner]}
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              onPress={() => {
                this.props.alreadFavored(marker.id);
                this.props.setMarkerPressedDetail(marker);
                this.props.showMarkerView();
              }}
            />
          );
        })}
      </MapView>
    );
  }
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
