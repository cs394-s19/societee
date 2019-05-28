import React, { Component } from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View, Alert, Image} from 'react-native';
import {Button, Icon, Row} from 'native-base';

export default class MarkerEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pin: this.props.currEditedPin,
      focused: false,
    }
  }

  componentWillReceiveProps(){
    this.updateNote("Add a note about this location")
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
              <Image style={styles.locationImage} source={require('../../assets/images/mudd_temporary.jpg')} />
              <Button large transparent primary style={styles.close} onPress={() => {this.props.closeMarkerEdit()}}>
                  <Icon name="close" style={{fontSize: 60}}/>
              </Button>
              <Text style={{marginTop: 150, marginLeft: 150}}>No Photo Selected</Text>
              <TouchableOpacity style={styles.addPhotoButton}>
                <Text style={styles.addPhotoPlus}>+</Text><Icon name="image" type="FontAwesome" style={styles.addPhotoIcon}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.locationName}>Mudd Library</Text>
            <Text style={styles.address}>{this.props.currEditedPin.addr}</Text>

            <TextInput
              style={ this.state.focused
                          ? styles.textInputBlack
                          : styles.textInputGrey}
              value={this.state.pin.note}
              onFocus={()=> {
                            this.setState({focused: true})
                            this.updateNote("")
                      }}
              clearTextOnFocus= {true}
              onChangeText={(text) => this.updateNote(text)}
              onSubmitEditing={()=>this.onSubmitNote(this.state.pin)}/>

          </View>
        </Modal>
    );
  }

}

const styles = {
  imageContainer: {
    width: "100%",
    height: 300,
    overflow: "hidden",
    backgroundColor: "white",
  },
  locationImage: {
    width: "100%",
    height: "100%"
  },
  addPhotoButton: {
    width: 80,
    height: 55,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    shadowOffset: {  width: 0,  height: 2,  },
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  addPhotoIcon: {
    fontSize: 30,
    color: "grey"
  },
  addPhotoPlus: {
    fontSize: 20,
    color: "grey",
    marginRight: 5,
    fontWeight: "bold"
  },
  textInputGrey: {
    color: "lightgrey"
  },
  textInputBlack: {
    color: "black"
  },
  infoContainer: {
    padding: 20,
  },
  close: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  locationName: {
    fontSize: 24,
    fontWeight: "bold"
  },
  address: {
    fontSize: 18,
    color: "grey",
    marginBottom: 20,
  },

}
