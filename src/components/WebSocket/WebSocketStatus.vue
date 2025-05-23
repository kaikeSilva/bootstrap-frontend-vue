<template>
  <div class="websocket-status">
    <h3>WebSocket Status</h3>
    <p>
      Status: 
      <span :class="statusClass">{{ status }}</span>
    </p>
    <p v-if="isConnected">Socket ID: {{ socketId }}</p>
    <p v-if="lastError" class="error-message">Error: {{ lastError }}</p>
    <button @click="connect" :disabled="isConnected || status === 'connecting' || status === 'reconnecting'">
      Connect
    </button>
    <button @click="disconnect" :disabled="!isConnected && status !== 'failed' && status !== 'reconnecting'">
      Disconnect
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const { status, isConnected, socketId, lastError, connect, disconnect } = useWebSocket();

const statusClass = computed(() => ({
  'status-connected': status.value === 'connected',
  'status-connecting': status.value === 'connecting' || status.value === 'reconnecting',
  'status-disconnected': status.value === 'disconnected',
  'status-failed': status.value === 'failed',
}));
</script>

<style scoped>
.websocket-status {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.websocket-status h3 {
  margin-top: 0;
}

.websocket-status p {
  margin: 5px 0;
}

.status-connected {
  color: green;
  font-weight: bold;
}

.status-connecting {
  color: orange;
  font-weight: bold;
}

.status-disconnected {
  color: grey;
  font-weight: bold;
}

.status-failed {
  color: red;
  font-weight: bold;
}

.error-message {
  color: red;
}

button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

button:not(:disabled) {
  background-color: #007bff;
  color: white;
}

button:not(:disabled):hover {
  background-color: #0056b3;
}
</style>
