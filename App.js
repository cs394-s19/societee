import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Loading from './components/Loading';
import Login from './components/LoginPage/Login';
import Main from './components/MainPage/Main';

const App = createAppContainer(createSwitchNavigator({
  Loading: Loading,
  Login: Login,
  Main: Main
}, {
  initialRouteName: 'Loading',
}));

export default App;