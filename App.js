import React from "react";
import { View, StyleSheet } from "react-native";
import Login from "./components/LoginPage/Login";
import Fetcher from "./components/Fetcher";
import firebase from "./config/Firebase";

console.disableYellowBox = true;

const db = firebase.firestore();
var users = db.collection("users");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      signUpMessage: ""
    };

    this.signUpUser = this.signUpUser.bind(this);
    this.loginInUser = this.loginInUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  signUpUser = name => {
    if (!name || name.length < 2 || !/^[a-zA-Z\s]*$/.test(name)) {
      this.setState({ signUpMessage: "Invalid name" });
      return;
    }
    var success = false;
    users
      .where("name", "==", name)
      .get()
      .then(function(querySnapshot) {
        if (querySnapshot.empty) {
          success = true;
        }
      })
      .then(() => {
        if (success) {
          users.add({
            name: name,
            favorites: [],
            following: []
          });
          this.setState({ signUpMessage: "Account created for " + name });
        } else {
          this.setState({ signUpMessage: name + " already exists" });
        }
      });
  };

  loginInUser = name => {
    var success;
    users
      .where("name", "==", name)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          this.setState({
            signUpMessage:
              "Invalid user: " + name + ". Sign up first to continue."
          });
        } else {
          this.setState({ user: querySnapshot.docs[0].id });
        }
      });
  };

  updateUser(uid) {
    this.setState({ user: uid });
  }

  // updateUserType(name) {
  //   users.add({
  //     name: name,
  //     favorites: [],
  //     following: []
  //   })
  //   .then(docRef => {
  //     this.setState({
  //       user: docRef.id,
  //     })
  //   })
  //   .catch(error => console.error("Error adding document: ", error))
  // }

  render() {
    return (
      <View style={styles.container}>
        {this.state.user === null ? (
          <Login
            signUpUser={this.signUpUser}
            loginInUser={this.loginInUser}
            updateUser={this.updateUser}
            signUpMessage={this.state.signUpMessage}
          />
        ) : (
          <Fetcher user={this.state.user} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch"
  }
});

export default App;

// import { createSwitchNavigator, createAppContainer } from 'react-navigation';

// import Loading from './components/Loading';
// import Login from './components/LoginPage/Login';
// import Main from './components/MainPage/Main';

// const App = createAppContainer(createSwitchNavigator({
//   AuthLoading: Loading,
//   Login: Login,
//   Main: Main
// }, {
//   initialRouteName: 'AuthLoading',
// }));

// export default App;
