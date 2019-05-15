import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const Login = ({ registerUser }) => {
  return (
    <View style={styles.container}>
      <Text>
        { 'Login Page' }
      </Text>
      <Button title="Sign In" />
    </View>
  );
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Login;


// import React, { Component } from 'react';
// import { StyleSheet, View } from 'react-native';
// import { SocialIcon} from 'react-native-elements';
// import firebase from '../../config/Firebase';

// export default class Login extends Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       loggingin: false
//     }
//   }

//   loginWithFacebook = async () => {
//     const firestore = firebase.firestore();
//     this.setState({loggingin: true});
//     const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
//       '327920027893945',
//       { permissions: ['public_profile'], behavior: 'native' }
//     );

//     if (type === 'success') {
//       // Build Firebase credential with the Facebook access token.
//       const credential = firebase.auth.FacebookAuthProvider.credential(token);
//       //console.log(credential);
//       // Sign in with credential from the Facebook user.
//       firebase.auth().signInAndRetrieveDataWithCredential(credential).then( (userCredential) => {
//         //console.log(userCredential);
//         if(userCredential.additionalUserInfo.isNewUser){
//           firestore.collection("users").doc(userCredential.user.uid).set({
//             photoURL: firebase.auth().currentUser.photoURL + "?height=300",
//             name: firebase.auth().currentUser.displayName
//           })
//         }
//       });
//     } else {
//       this.setState({loggingin: false});
//     }
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <SocialIcon style={{width: '80%'}}
//                     button
//                     type='facebook'
//                     loading={this.state.loggingin} disabled={this.state.loggingin} onPress={this.loginWithFacebook} title="Log in with Facebook"
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });