<template>
  <div class="global-notifications">
    <Transition name="fade" v-for="notification in notifications" :key="notification.id">
      <div class="notification" :class="`notification-${notification.type}`">
        <div class="notification-content">
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button @click="removeNotification(notification.id)" class="notification-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';
import { storeToRefs } from 'pinia';

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
const { removeNotification } = notificationStore;
</script>

<style scoped>
.global-notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  min-width: 300px;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  pointer-events: auto;
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-size: 14px;
  font-weight: 500;
}

.notification-close {
  background: transparent;
  border: none;
  color: currentColor;
  cursor: pointer;
  margin-left: 12px;
  opacity: 0.7;
  padding: 0;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}

.notification-success {
  background-color: #10b981;
  color: white;
}

.notification-error {
  background-color: #ef4444;
  color: white;
}

.notification-info {
  background-color: #3b82f6;
  color: white;
}

.notification-warning {
  background-color: #f59e0b;
  color: white;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
