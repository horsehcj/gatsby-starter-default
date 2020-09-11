import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: "AIzaSyCz8uvhrsRuHd-ptHfpkzl8rTWhGXbWWTw",
  authDomain: "court-finder-37f55.firebaseapp.com",
  databaseURL: "https://court-finder-37f55.firebaseio.com",
  projectId: "court-finder-37f55",
  storageBucket: "court-finder-37f55.appspot.com",
  messagingSenderId: "590505064574",
  appId: "1:590505064574:web:d89abfa45de77c9a13802f"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });