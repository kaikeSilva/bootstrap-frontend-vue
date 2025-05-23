import { defineStore } from 'pinia';
import { reactive } from 'vue';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number; // in milliseconds
  persistent?: boolean;
}

export interface NotificationsState {
  notifications: Notification[];
}

let nextId = 0;

export const useNotificationStore = defineStore('notifications', () => {
  const state = reactive<NotificationsState>({
    notifications: [],
  });

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${nextId++}`;
    const newNotification: Notification = {
      ...notification,
      id,
    };
    state.notifications.push(newNotification);

    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    state.notifications = state.notifications.filter(n => n.id !== id);
  };

  const clearNotifications = () => {
    state.notifications = [];
  };

  return {
    state,
    addNotification,
    removeNotification,
    clearNotifications,
  };
});
