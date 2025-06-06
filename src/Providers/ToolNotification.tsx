'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert, Button } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';

type Notification = {
  id: number;
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string) => {
    const id = Date.now();
    setNotifications((n) => [...n, { id, message }]);
    setTimeout(() => removeNotification(id), 50000);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((n) => n.filter((notif) => notif.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div style={{ top: '4rem', right: '4rem' }} className="fixed w-60 max-w-50 bg-red-100 p-4 shadow-lg z-[9999]">
        <AnimatePresence>
          {notifications.map(({ id, message }) => (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}>
              <Alert
                title="Cypher Builder Tool Live Response"
                hideIconWrapper
                color="warning"
                description={message}
                endContent={
                  <Button color="warning" size="sm" variant="flat" onPress={() => removeNotification(id)}>
                    ×
                  </Button>
                }></Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
