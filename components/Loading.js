import React from './node_modules/react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import firebase from '../config/Firebase';

export default class Loading extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Main' : 'Login', user ? {uid: user.uid} : null)
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});