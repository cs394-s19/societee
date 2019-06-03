import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Button, SocialIcon } from "react-native-elements";
import firebase from "../../config/Firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingin: false,
      name: null
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <SocialIcon
          style={{ width: "80%" }}
          button
          type="facebook"
          loading={this.state.loggingin}
          disabled={this.state.loggingin}
          onPress={this.loginWithFacebook}
          title="Log in with Facebook"
        />
        
        <TextInput
          style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(name) => this.setState({name})}
          value={this.state.text}
        />
        <Button title="Sign up"
                onPress={() => this.props.signUpUser(this.state.name)}
        />
        <Button title="Log in"
                onPress={() => this.props.loginInUser(this.state.name)}
        />
      </View>
    );
  }

  loginWithFacebook = async () => {
    // console.log(this.firestore.collection('users').doc(userCredential.user.uid))
    const firestore = firebase.firestore();
    this.setState({ loggingin: true });
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      "327920027893945",
      {
        permissions: ["public_profile"],
        behavior: "native"
      }
    );

    if (type === "success") {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      // console.log(credential)
      // Sign in with credential from the Facebook user.
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(userCredential => {
          // console.log(userCredential);
          if (userCredential.additionalUserInfo.isNewUser) {
            firestore
              .collection("users")
              .doc(userCredential.user.uid)
              .set({
                photoURL: firebase.auth().currentUser.photoURL + "?height=300",
                name: firebase.auth().currentUser.displayName,
                following: [],
                favorites: []
              });
          }
          this.props.updateUser(userCredential.user.uid);
        });
    } else {
      this.setState({ loggingin: false });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
