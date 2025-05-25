<template>
  <Transition name="fade">
    <div v-if="show" class="notification" :class="typeClass">
      <div class="notification-content">
        <span class="notification-message">{{ message }}</span>
      </div>
      <button @click="close" class="notification-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value: string) => ['success', 'error', 'info', 'warning'].includes(value)
  },
  show: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const emit = defineEmits(['close']);

const typeClass = computed(() => `notification-${props.type}`);

const close = () => {
  emit('close');
};

// Auto-close after duration
watch(() => props.show, (newVal) => {
  if (newVal && props.duration > 0) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 1000;
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
