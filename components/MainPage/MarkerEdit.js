import React, { Component } from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View, Alert, Image} from 'react-native';
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
            <View style={styles.imageContainer}>
              <Text style={{marginTop: 150, marginLeft: 150}}>No Photo Selected</Text>
              <TouchableOpacity style={styles.addPhotoButton}>
                <Text>Add a Photo</Text>
              </TouchableOpacity>
            </View>
            
          </View>
          <View style={styles.infoContainer}>
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
            <TouchableOpacity
              style={{marginTop: 50}}
              onPress={this.props.closeMarkerEdit}>
              <Text>CLOSE ME</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    );
  }

}

const styles = {
  imageContainer: {
    width: "100%",
    height: 300,
    overflow: "none",
    backgroundColor: "white",
    shadowOffset: {  width: 0,  height: 2,  },
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowRadius: 5
  },
  addPhotoButton: {
    width: 200,
    height: 40,
    position: "absolute",
    bottom: 15,
    right: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    paddingLeft: 60,
  },
  textInput: {
    marginTop: 50,
  },
  infoContainer: {

  }
}
