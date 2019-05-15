import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import Map from './Map';
import { Button } from 'react-native-elements'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null
    }
    this._getCoords = this._getCoords.bind(this);
  }

  _getCoords = () => {
    navigator.geolocation.getCurrentPosition(
    (position) => {
        var initialPosition = JSON.stringify(position.coords);
        this.setState({position: initialPosition});
        let tempCoords = {
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        }
        this._map.animateToRegion(tempCoords, 1000);
      }, function (error) { alert(error) },
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar style={styles.bar} />
        <Map />
        <Button style={styles.button}
            borderRadius={25}
            onPress={this._getCoords}
            icon={{
              name: "near-me",
              size: 30,
              color: "white",
              zIndex:2,
              bottom: 0,
              left: 0,
            }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  bar: {
    marginTop: 250
  },
  button : {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: 50,
    marginRight: 20,
    borderRadius: 30
  }
});

export default Main;