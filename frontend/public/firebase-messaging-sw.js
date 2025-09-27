// firebase-messaging-sw.js
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDoxvryUVjLKG2iF9rWl-hslQWvVByUEnQ",
  authDomain: "qwikko-b7ace.firebaseapp.com",
  projectId: "qwikko-b7ace",
  storageBucket: "qwikko-b7ace.firebasestorage.app",
  messagingSenderId: "735557421843",
  appId: "1:735557421843:web:b8d95d7fdab2ea3bf068e6",
  measurementId: "G-P3DEB6XKW9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  if (payload.notification) {
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/favicon.ico'
    });
  }
});
