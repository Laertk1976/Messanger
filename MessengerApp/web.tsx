/// <reference lib="dom" />
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('MessengerApp', () => App);
AppRegistry.runApplication('MessengerApp', {
  rootTag: document.getElementById('root'),
});
