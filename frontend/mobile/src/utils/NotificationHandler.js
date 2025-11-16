import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  getInitialNotification,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';
import { navigate } from './navigationService';
import { useSelector } from 'react-redux';
import { saveUserFcmDetails } from '../api/notificationApi.js';

const NotificationManager = ({ phone }) => {
  const navigation = useNavigation();
  const currentUniversityUid = useSelector((state) => state.tenant?.currentUniversityUid) ;
  const personId = useSelector((state) => state.user?.personId);
  const personName =
    useSelector((state) => state.user?.displayName || state.user?.name || state.user?.username) ||
    'user';

  useEffect(() => {
    const messagingInstance = getMessaging();

    // ✅ 1️⃣ Request notification permission
    async function requestNotificationPermission() {
      const authStatus = await requestPermission(messagingInstance);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('✅ Notification permission granted');
        await registerDeviceToken();
      } else {
        console.warn('❌ Notification permission denied');
      }
    }

    // ✅ 2️⃣ Register device token with the server
    async function registerDeviceToken() {
      try {
        const token = await getToken(messagingInstance);
        console.log('🔹 FCM Token:', token);
        await saveUserFcmDetails({
          uid: currentUniversityUid,
          person_id: personId,
          person_name: personName,
          fcm_token: token,
        });
        console.log('✅ Device token registered successfully (saved to server)');
      } catch (error) {
        console.error('❌ Failed to register device token:', error);
      }
    }

    // ✅ 3️⃣ Handle token refresh
    const unsubscribeTokenRefresh = onTokenRefresh(messagingInstance, async (token) => {
      try {
        console.log('🔄 Token refreshed:', token);
        await saveUserFcmDetails({
          uid: currentUniversityUid,
          person_id: personId,
          person_name: personName,
          fcm_token: token,
        });
      } catch (error) {
        console.error('❌ Failed to refresh token:', error);
      }
    });

    // ✅ 4️⃣ Setup Push Notification Channel (For Android)
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Notification Channel',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`🔹 Notification Channel Created: ${created}`)
    );

    // ✅ 5️⃣ Handle Foreground Notifications
    const unsubscribeForeground = onMessage(messagingInstance, async remoteMessage => {
      console.log('📩 Foreground Notification:', remoteMessage);
      
      // Extract navigation data from the notification
      const { screen } = remoteMessage.data || {};
      
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: remoteMessage.notification?.title || 'New Notification',
        message: remoteMessage.notification?.body || 'You have a new message',
        playSound: true,
        soundName: 'default',
        importance: 'high',
        vibrate: true,
        // largeIcon: icon || "ic_launcher", // For the large icon in the notification
        smallIcon: "ic_notification", // For the status bar icon
        color: "#FFFFFF",
        // Store navigation data for tap action
        data: {
          screen,
          // params: params ? JSON.parse(params) : {}
        }
      });
    });
    
    // ✅ 6️⃣ Handle Background Notifications (when app is in background)
    const unsubscribeBackground = onNotificationOpenedApp(messagingInstance, remoteMessage => {
      console.log('🔔 Background Notification Opened:', remoteMessage);
      handleNavigation(remoteMessage);
    });

    // ✅ 7️⃣ Handle Notifications that opened the app (from quit state)
    const checkInitialNotification = async () => {
      const remoteMessage = await getInitialNotification(messagingInstance);
      if (remoteMessage) {
        console.log('🚀 App opened from quit state by notification:', remoteMessage);
        handleNavigation(remoteMessage);
      }
    };
    
    // ✅ 8️⃣ Navigation handler function
    const handleNavigation = (remoteMessage) => {
      // const { screen, params } = remoteMessage.data || {};
      const { screen } = remoteMessage.data || {};
      console.log("screen", screen)
      if (screen) {
        // console.log(`🧭 Navigating to ${screen} with params:`, params);
        // Navigate to the specified screen with parameters
        // navigation.navigate(screen, params ? JSON.parse(params) : {});
        console.log(`🧭 Navigating to ${screen}`);
        navigate(screen);
      }
    };

    // ✅ 9️⃣ Configure PushNotification for tap actions
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('🖱️ Notification tapped:', notification);
        console.log("notification", notification)
        // Handle tap action for local notifications
        if (notification.data) {
          const { screen } = notification.data;
          if (screen) {
            navigate(screen);
          }
        }
        
        // Required for iOS
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      
      // Other required setup for PushNotification
      requestPermissions: Platform.OS === 'ios',
      popInitialNotification: true,
    });

    // ✅ 🔟 Call permission request and check for initial notification
    requestNotificationPermission();
    checkInitialNotification();

    // ✅ 1️⃣1️⃣ Cleanup subscriptions on unmount
    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, [phone, navigation, currentUniversityUid, personId, personName]);

  return null;
};

export default NotificationManager;