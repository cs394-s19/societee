import React, { Component } from 'react';
import {Modal, Text, TextInput, TouchableHighlight, View, Alert, Image} from 'react-native';
import { Button, withTheme, Avatar, ListItem } from 'react-native-elements';

export default class MarkerEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  updateNote = (text) => {
    var currPin = this.props.currEditedPin;
    currPin.note = text
    this.setState({pin: currPin})
  }

  onSubmitNote = (pin) => {
    this.props.addPin(pin);
    this.props.closeMarkerEdit();
  }

  render() {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
          > 
          <View>
            <TextInput
              style={styles.textInput}
              defaultValue="Write a note"
              clearTextOnFocus= {true}
              onChangeText={(text) => this.updateNote(text)}
              onSubmitEditing={()=>this.onSubmitNote(this.props.currEditedPin)}/>
            <View>
              <Text>
                Address: {this.props.currEditedPin.addr}
              </Text>
            </View>
            <TouchableHighlight
              style={{marginTop: 50}}
              onPress={this.props.closeMarkerEdit}>
              <Text>CLOSE ME</Text>
            </TouchableHighlight>
          </View>
          
        </Modal>
    );
  }

}

const styles = {
  textInput: {
    marginTop: 50,
  }
}
