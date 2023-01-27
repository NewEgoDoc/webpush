import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


var permission = Notification.requestPermission();
  console.log(permission) 

const sendTokenInfo = (token) => {
  fetch("http://localhost:8080/api/fcm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "targetToken":token,
      "title":"생성",
      "body":"토큰"
    }),
  })
  .then(response =>  {
      console.log(response);
  })
  .catch((error) => console.log(error));
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "test-837ca.firebaseapp.com",
  projectId: "test-837ca",
  storageBucket: "test-837ca.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function requestPermission() {
  console.log("권한 요청 중...");

  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return;
  }

  console.log("알림 권한이 허용됨");

  const token = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_VAPID_KEY,
  });

  if (token) {
    console.log("token: ", token);

    sendTokenInfo(token);

  } else {
    console.log("Can not get Token");
  }

  onMessage(messaging, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
    // ...
  });
}

requestPermission();
