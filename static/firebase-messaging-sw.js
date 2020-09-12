importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-messaging.js');

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

messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/message-thumbnail.png'
  };
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});
