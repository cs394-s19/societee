import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import Loading from './Components/Loading';
import Login from './Components/LoginPage/Login';
import Main from './Components/MainPage/Main';

const App = createAppContainer(createSwitchNavigator({
  Loading: Loading,
  Login: Login,
  Main: Main
}, {
  initialRouteName: 'Loading',
}));

export default App;