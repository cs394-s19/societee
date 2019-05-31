import React from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import Loading from './components/LoginPage/Loading';
import Login from './components/LoginPage/Login';
import NavBar from './components/NavBar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }

    this.updateUser = this.updateUser.bind(this)
  }

  updateUser(uid){
    this.setState({user:uid});
  }

  render() {
    return <AppContainer />
    
  }
}

const AppNavigator = createAppContainer(createSwitchNavigator({
  AuthLoading: Loading,
  NavBar: NavBar,
  Login: Login
}, {
  initialRouteName: 'AuthLoading',
}));

const AppContainer = createAppContainer(AppNavigator);


// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: null
//     }

//     this.updateUser = this.updateUser.bind(this)
//   }

//   updateUser(uid){
//     this.setState({user:uid});
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         { this.state.user === null ?
//           <Login updateUser={this.updateUser}/>
//           :
//           <NavBar user={this.state.user}/> }
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'stretch'
//   }
// });

// 

