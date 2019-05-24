import React from 'react';
import { View, StyleSheet } from 'react-native';
import Login from './components/LoginPage/Login';
import NavBar from './components/NavBar';

class App extends React.Component {
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
    return (
      <View style={styles.container}>
        { this.state.user === null ?
          <Login updateUser={this.updateUser}/>
          :
          <NavBar user={this.state.user}/> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
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