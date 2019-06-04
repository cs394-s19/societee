import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView
} from "react-native";
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
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <View style={styles.logo}>
                <Image
                  source={require("../societee_logo.png")}
                  style={{ width: 300, height: 300 }}
                />
              </View>
              <TextInput
                placeholder="Username"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                onChangeText={name => this.setState({ name })}
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={() => this.props.loginInUser(this.state.name)}
                title="Login"
                color="#FDEBE1"
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={() => this.props.signUpUser(this.state.name)}
                title="Signup"
                color="#FDEBE1"
              />
              {this.props.signUpMessage ? (
                <Text
                  style={{
                    color: "red",
                    height: 43,
                    fontSize: 14,
                    textAlign: "center"
                  }}
                >
                  {this.props.signUpMessage}
                </Text>
              ) : (
                <Text />
              )}
              <TouchableOpacity
                style={styles.fbLoginButton}
                onPress={this.loginWithFacebook}
              >
                <View>
                  <Text style={styles.fbLoginText}>Login with Facebook</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      // <View style={styles.container}>
      //   <TextInput
      //     style={{height: 40, width: 100, borderColor: 'gray', borderWidth: 1}}
      //     onChangeText={(name) => this.setState({name})}
      //     value={this.state.text}
      //   />
      //   <Button title="Sign up"
      //           onPress={() => this.props.signUpUser(this.state.name)}
      //   />
      //   <Button title="Log in"
      //           onPress={() => this.props.loginInUser(this.state.name)}
      //   />
      //    <SocialIcon
      //     style={{ width: "80%" }}
      //     button
      //     type="facebook"
      //     loading={this.state.loggingin}
      //     disabled={this.state.loggingin}
      //     onPress={this.loginWithFacebook}
      //     title="Login with Facebook"
      //   />
      // </View>
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
  containerView: {
    flex: 1
  },
  loginScreenContainer: {
    flex: 1
  },
  logo: {
    marginTop: 60,
    alignItems: "center"
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center"
  },
  loginFormView: {
    flex: 1
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5
  },
  loginButton: {
    backgroundColor: "#E64A4B",
    borderRadius: 5,
    height: 45,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  fbLoginButton: {
    height: 45,
    justifyContent: "center",
    alignItems: "center"
  },
  fbLoginText: {
    color: "#3897f1",
    marginTop: 17
  }
});
