import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config/config.js';

const COMMON_ROOM_NAME = 'notifications-room';
const NOTIFICATION_EVENT = 'notification';

const NotificationSocketContext = createContext(null);

export const NotificationSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    console.log('[NotificationSocket] Initializing socket...', API_BASE_URL);

    const socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[NotificationSocket] Connected:', socket.id);
      // Join common notifications room, if supported by backend
      try {
        console.log('[NotificationSocket] Joining room:', COMMON_ROOM_NAME);
        socket.emit('join-room', COMMON_ROOM_NAME);
      } catch (err) {
        console.log('[NotificationSocket] join-room error:', err);
      }
    });

    socket.on('connect_error', (err) => {
      console.log('[NotificationSocket] Connect error:', err?.message || err);
    });

    socket.on('reconnect_attempt', (attempt) => {
      console.log('[NotificationSocket] Reconnect attempt:', attempt);
    });

    socket.on('reconnect', (attempt) => {
      console.log('[NotificationSocket] Reconnected after attempts:', attempt);
    });

    socket.on(NOTIFICATION_EVENT, (data) => {
      console.log('[NotificationSocket] Notification received:', data);
      // Increment unread counter on each incoming notification
      setUnreadCount((prev) => prev + 1);
    });

    socket.on('disconnect', (reason) => {
      console.log('[NotificationSocket] Disconnected:', reason);
    });

    return () => {
      console.log('[NotificationSocket] Cleaning up socket...');
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
  };

  const value = {
    socket: socketRef.current,
    unreadCount,
    markAllRead,
  };

  return (
    <NotificationSocketContext.Provider value={value}>
      {children}
    </NotificationSocketContext.Provider>
  );
};

export const useNotificationSocket = () => {
  const ctx = useContext(NotificationSocketContext);
  if (!ctx) {
    throw new Error('useNotificationSocket must be used within NotificationSocketProvider');
  }
  return ctx;
};


