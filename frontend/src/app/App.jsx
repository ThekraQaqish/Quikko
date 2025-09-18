// App.jsx
import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "./firebase-messaging";

function App() {
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js").then(registration => {
        // طلب إذن الإشعارات
        Notification.requestPermission().then(permission => {
          if (permission !== "granted") return;
        });

        // الحصول على FCM Token
        getToken(messaging, { 
          vapidKey: "BLY_cpu5gN9scFU7TMhCd-RMC_meMwCVVry4a97ZPRoDDMYiNztIMRz9i8CEX95_0XNeBk7FMtY0VPyQ-dm2zCU",
          serviceWorkerRegistration: registration
        })
          .then(token => {
            console.log("FCM Token:", token);
            setFcmToken(token);
          })
          .catch(err => console.error(err));

        // استقبال الرسائل عند الصفحة المفتوحة
        onMessage(messaging, payload => {
          console.log("Message received:", payload);
          if (Notification.permission === "granted" && payload.notification) {
            new Notification(payload.notification.title, {
              body: payload.notification.body,
              icon: "/favicon.ico"
            });
          }
        });
      });
    }
  }, []);

  const sendTestNotification = async () => {
    if (!fcmToken) return alert("FCM Token not ready yet.");
    try {
      const res = await fetch("http://localhost:3000/api/notifications/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcmToken })
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>React + FCM Test</h1>
      <button onClick={sendTestNotification}>Send Test Notification</button>
    </div>
  );
}

export default App;
