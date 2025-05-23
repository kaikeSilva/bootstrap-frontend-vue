<template>
  <div class="websocket-debug">
    <h3>WebSocket Debug</h3>

    <div class="channel-management">
      <h4>Channel Management</h4>
      <input type="text" v-model="channelName" placeholder="Channel Name (e.g., chat)" />
      <input type="text" v-model="eventName" placeholder="Event Name (e.g., NewMessage)" />
      <button @click="subscribeToChannel" :disabled="!channelName || !eventName || !isConnected">Subscribe</button>
      <button @click="unsubscribeFromChannel" :disabled="!channelName || !subscribedChannels[channelName]">Unsubscribe</button>
    </div>

    <div class="message-sending" v-if="isConnected">
      <h4>Send Message</h4>
      <input type="text" v-model="targetChannel" placeholder="Target Channel (e.g., private-chat.1)" />
      <input type="text" v-model="messageEvent" placeholder="Message Event (e.g., client-message)" />
      <textarea v-model="messageData" placeholder="Message Data (JSON)"></textarea>
      <button @click="sendMessage" :disabled="!targetChannel || !messageEvent || !messageData">Send</button>
    </div>

    <div class="received-messages">
      <h4>Received Messages (Max {{ MAX_MESSAGES }})</h4>
      <ul>
        <li v-for="(msg, index) in receivedMessages" :key="index">
          <strong>{{ msg.channel || 'N/A' }} - {{ msg.event || 'N/A' }}:</strong>
          <pre>{{ msg.data }}</pre>
        </li>
      </ul>
      <button @click="clearMessages" v-if="receivedMessages.length > 0">Clear Messages</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, reactive } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';
import { useWebSocketStore } from '@/stores/websocket';
import { logger } from '@/utils/logger';
import type { WebSocketMessage } from '@/services/websocket/types';

const MAX_MESSAGES = 20;

const { isConnected, lastMessage } = useWebSocket();
const webSocketStore = useWebSocketStore();

const channelName = ref('');
const eventName = ref('');
const targetChannel = ref('');
const messageEvent = ref('');
const messageData = ref('');

const receivedMessages = ref<WebSocketMessage[]>([]);
const subscribedChannels = reactive<Record<string, boolean>>({});

watch(lastMessage, (newMessage) => {
  if (newMessage) {
    receivedMessages.value.unshift(newMessage);
    if (receivedMessages.value.length > MAX_MESSAGES) {
      receivedMessages.value.pop();
    }
  }
});

const subscribeToChannel = () => {
  if (channelName.value && eventName.value && isConnected.value) {
    logger.info(`[DebugComponent] Subscribing to ${channelName.value} for event ${eventName.value}`);
    webSocketStore.subscribe(channelName.value, eventName.value, (data: any) => {
      logger.info(`[DebugComponent] Message on ${channelName.value} - ${eventName.value}:`, data);
      // The global lastMessage watcher will also pick this up if the store updates it correctly
    });
    subscribedChannels[channelName.value] = true;
  } else {
    logger.warn('[DebugComponent] Cannot subscribe. Check connection, channel, or event name.');
  }
};

const unsubscribeFromChannel = () => {
  if (channelName.value && subscribedChannels[channelName.value]) {
    logger.info(`[DebugComponent] Unsubscribing from ${channelName.value} for event ${eventName.value}`);
    webSocketStore.unsubscribe(channelName.value, eventName.value);
    delete subscribedChannels[channelName.value];
  } else {
    logger.warn('[DebugComponent] Channel not subscribed or name is missing.');
  }
};

const sendMessage = () => {
  if (targetChannel.value && messageEvent.value && messageData.value && isConnected.value) {
    try {
      const data = JSON.parse(messageData.value);
      logger.info(`[DebugComponent] Sending message to ${targetChannel.value}, event ${messageEvent.value}:`, data);
      webSocketStore.sendMessage(targetChannel.value, messageEvent.value, data);
    } catch (e) {
      logger.error('[DebugComponent] Invalid JSON data for message:', e);
      alert('Invalid JSON data. Please check the console for details.');
    }
  } else {
    logger.warn('[DebugComponent] Cannot send message. Check connection, target channel, event, or data.');
  }
};

const clearMessages = () => {
  receivedMessages.value = [];
};

// Clean up subscriptions when component is unmounted
onUnmounted(() => {
  Object.keys(subscribedChannels).forEach(ch => {
    if (subscribedChannels[ch]) {
      // Assuming a generic event name if not specified, or rely on store's unsubscribeAll for channel
      webSocketStore.unsubscribe(ch, eventName.value || undefined); 
    }
  });
});

</script>

<style scoped>
.websocket-debug {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.websocket-debug h3, .websocket-debug h4 {
  margin-top: 0;
}

.channel-management, .message-sending, .received-messages {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

input[type="text"], textarea {
  width: calc(100% - 22px); /* Account for padding and border */
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  min-height: 60px;
  resize: vertical;
}

button {
  margin-right: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #28a745;
  color: white;
}

button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #218838;
}

.received-messages ul {
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  background-color: #fff;
}

.received-messages li {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.received-messages li:last-child {
  border-bottom: none;
}

.received-messages pre {
  margin: 5px 0 0 0;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 3px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
