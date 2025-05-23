<template>
  <div class="connection-indicator-wrapper">
    <div :class="['indicator', statusClass]" :title="`WebSocket: ${status}`">
      <span class="indicator-dot"></span>
      <span class="indicator-text">{{ displayStatus }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const { status } = useWebSocket();

const statusClass = computed(() => {
  switch (status.value) {
    case 'connected':
      return 'status-connected';
    case 'connecting':
    case 'reconnecting':
      return 'status-connecting';
    case 'disconnected':
      return 'status-disconnected';
    case 'failed':
      return 'status-failed';
    default:
      return 'status-unknown';
  }
});

const displayStatus = computed(() => {
  switch (status.value) {
    case 'connected':
      return 'Connected';
    case 'connecting':
      return 'Connecting...';
    case 'reconnecting':
      return 'Reconnecting...';
    case 'disconnected':
      return 'Disconnected';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
});
</script>

<style scoped>
.connection-indicator-wrapper {
  display: inline-block;
  font-family: Arial, sans-serif;
}

.indicator {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  transition: background-color 0.3s ease;
}

.indicator-text {
  font-weight: bold;
}

.status-connected {
  background-color: #e6ffed;
  color: #28a745;
}
.status-connected .indicator-dot {
  background-color: #28a745;
}

.status-connecting {
  background-color: #fff3e0;
  color: #ff9800;
}
.status-connecting .indicator-dot {
  background-color: #ff9800;
  animation: pulse-orange 1.5s infinite ease-in-out;
}

.status-disconnected {
  background-color: #f5f5f5;
  color: #757575;
}
.status-disconnected .indicator-dot {
  background-color: #757575;
}

.status-failed {
  background-color: #ffebee;
  color: #f44336;
}
.status-failed .indicator-dot {
  background-color: #f44336;
}

.status-unknown {
  background-color: #eceff1;
  color: #546e7a;
}
.status-unknown .indicator-dot {
  background-color: #546e7a;
}

@keyframes pulse-orange {
  0% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
}
</style>
