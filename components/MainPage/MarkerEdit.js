import React, { Component } from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, Image} from 'react-native';
import { Button, withTheme, Avatar, ListItem } from 'react-native-elements';

export default class MarkerEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}> 
          <TouchableHighlight
            style={{marginTop: 50}}
            onPress={this.props.closeMarkerEdit}>
            <Text>CLOSE ME</Text>
          </TouchableHighlight>
        </Modal>
    );
  }

}

const styles = {
  
}
