import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";

// Function to request permission for notifications
const requestNotificationPermission = () => {
  Notification.requestPermission().then(permission => {
    console.log('Notification permission:', permission);
  });
};

// Function to register the service worker
const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    });
  }
};

// Call the functions to request notification permission and register the service worker
requestNotificationPermission();
registerServiceWorker();

// Render the React app after requesting notification permission and registering the service worker
ReactDOM.render(
  <React.StrictMode>
    <ToastContainer />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
