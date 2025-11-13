/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

const messagingInstance = getMessaging();

// Create Notification Channel
PushNotification.createChannel(
  {
    channelId: 'default-channel-id', // Must match channelId in localNotification
    channelName: 'Default Channel',
    importance: 4, // High importance for notifications
    vibrate: true,
  },
  (created) => console.log(`✅ Notification Channel Created: ${created}`)
);

// Handle Background & Quit State Push Notifications
setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  console.log('📩 Background Notification Received:', remoteMessage);
});

// Custom Root Component to Include Context Provider
AppRegistry.registerComponent(appName, () => App);