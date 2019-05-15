import React, { Component } from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, Image} from 'react-native';
import { Button, withTheme, Avatar, ListItem } from 'react-native-elements';

export default class MarkerView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markerVisible: false, //call from props later
      picture: "url"
    }
    this.setMarkerVisible = this.setMarkerVisible.bind(this)
  }

  // This should probably get called in the parent Component when something gets clicked
  setMarkerVisible(visible) {
    this.setState({markerVisible: visible});
  }


  render() {
    return (
      <View style={{marginTop: 15, marginRight: 15}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.markerVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View style={{marginTop: 35, textAlign: "center"}}>
              <Text style={styles.title}>Millenium Park</Text>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={require('../../assets/images/millenium-park.jpg')}
                />
              </View>
              <View style={styles.avatar}>
              <ListItem
                leftAvatar={{
                  title: 'JD',
                  source: {},
                  showEditButton: true,
                }}
                title={'John Doe'}
                subtitle={'April 30, 2019'}
                chevron
              />
              </View>

              <TouchableHighlight
                onPress={() => {
                  this.setMarkerVisible(!this.state.markerVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          onPress={() => {
            this.setMarkerVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }

}

const styles = {
  title: {
    textAlign: 'center',
    fontSize: 30
  },
  imageContainer: {
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
    height: 250,
  },
  image: {
    width: 250,
    height: 250,
    backgroundColor: "gray"
  },
  avatar: {
    marginTop: 20,
  }

}
