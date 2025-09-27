import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  //   const [fcmToken, setFcmToken] = useState("");

  //   useEffect(() => {
  //     if ("serviceWorker" in navigator) {
  //       navigator.serviceWorker
  //         .register("/firebase-messaging-sw.js")
  //         .then(registration => {
  //           // طلب إذن الإشعارات
  //           Notification.requestPermission().then(permission => {
  //             if (permission !== "granted") return;

  //             // جلب FCM token
  //             getToken(messaging, {
  //               vapidKey: "BLY_cpu5gN9scFU7TMhCd-RMC_meMwCVVry4a97ZPRoDDMYiNztIMRz9i8CEX95_0XNeBk7FMtY0VPyQ-dm2zCU",
  //               serviceWorkerRegistration: registration
  //             })
  //               .then(token => {
  //                 console.log("FCM Token:", token);
  //                 setFcmToken(token);
  //               })
  //               .catch(console.error);

  //             // استقبال الرسائل عند الصفحة المفتوحة
  //             onMessage(messaging, payload => {
  //               console.log("Message received:", payload);
  //               if (payload.notification) {
  //                 new Notification(payload.notification.title, {
  //                   body: payload.notification.body,
  //                   icon: "/favicon.ico"
  //                 });
  //               }
  //             });
  //           });
  //         })
  //         .catch(console.error);
  //     }
  //   }, []);

  //   const sendTestNotification = async () => {
  //   try {
  //     const res = await fetch("http://localhost:3000/api/notifications", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: 1, // user id
  //         title: "Test Notification",
  //         message: "Hello from backend",
  //         type: "test"
  //       })
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
<>
</>
  );
}

export default App;
