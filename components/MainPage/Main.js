import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import Map from './Map';

const Main = () => {
  return (
    <View style={styles.container}>
      <SearchBar style={styles.bar} />
      <Map />
    </View>
  );
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
  }
});

export default Main;