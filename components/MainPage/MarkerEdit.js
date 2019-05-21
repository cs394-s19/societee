import React, { Component } from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, Image} from 'react-native';
import { Button, withTheme, Avatar, ListItem } from 'react-native-elements';

export default class MarkerEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerEdit: true, //call from props later
    }
  }

  render() {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.markerEdit}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View>MARKEREDIT PANEL</View>
        </Modal>
    );
  }

}

const styles = {
  
}
