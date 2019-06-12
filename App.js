import { createStackNavigator, createAppContainer } from 'react-navigation';
import * as firebase from "firebase";
import { CONFIG } from './constants/index';

import HomeScreen from './routes/Home';
import ChichaScreen from './routes/Chicha';
import createScreen from './routes/create';

console.disableYellowBox = true;

firebase.initializeApp({
  apiKey: CONFIG.FIREBASE_KEY,
  authDomain: "chichapp-3df89.firebaseapp.com",
  databaseURL: "https://chichapp-3df89.firebaseio.com",
  projectId: "chichapp-3df89",
  storageBucket: "chichapp-3df89.appspot.com",
});

const RootStack = createStackNavigator(
  {
        Home: { 
          screen: HomeScreen,
          navigationOptions: {
            headerBackTitle: null
          }
         },
        Chicha: { screen: ChichaScreen },
        create: { screen: createScreen },
  },
  {
    header: null
  }
);

const App = createAppContainer(RootStack);

export default App;