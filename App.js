import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Login from './components/LoginPage/Login';
import Main from './components/MainPage/Main';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Francis'
      // user: null
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.user === null ?
          <Login />
          :
          <Main /> }
      </View>
    );
  }
}

// const App = () => {
//   const [user, setUser] = useState(null);

//   return (
//     <View style={styles.container}>
//       { user === null ?
//         <Login registerUser={() => { setUser }} />
//         :
//         <Main /> }
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'col',
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