import { createStackNavigator } from '@react-navigation/stack';
import Diary from 'screens/Diary';
import Educational from 'screens/Educational';
import SignIn from 'screens/SignIn';
import SignUp from 'screens/SignUp';

export type RootStackParamList = {
 Diary: undefined;
 Educational: undefined;
 SignIn: undefined;
 SignUp: undefined;
};

const App = createStackNavigator<RootStackParamList>();

const Routes: React.FC = () => (
 <App.Navigator
  // initialRouteName="SignIn"
  initialRouteName="Diary"
  screenOptions={{ cardStyle: { backgroundColor: '#c4d3f2' }, headerShown: false }}
 >
  <App.Screen name="Diary" component={Diary} />
  <App.Screen name="Educational" component={Educational} />
  <App.Screen name="SignIn" component={SignIn} />
  <App.Screen name="SignUp" component={SignUp} />
 </App.Navigator>
);

export default Routes;
