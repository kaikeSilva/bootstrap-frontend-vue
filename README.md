### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## WebSocket Usage

This application features a modular WebSocket integration built with Laravel Echo and Pusher-JS, managed via Pinia stores and accessible through Vue composables.

### Overview

- **Service (`src/services/websocket/WebSocketService.ts`):** Handles the core WebSocket connection, subscription logic, and event handling.
- **Store (`src/stores/websocket.ts`):** A Pinia store that manages the WebSocket state (connection status, messages, etc.) and provides actions to interact with the service.
- **Composables:**
    - `useWebSocket` (`src/composables/useWebSocket.ts`): Provides easy access to connection status, messages, and connection/disconnection methods.
    - `useChannel` (`src/composables/useChannel.ts`): Simplifies subscribing to specific channels, listening for events, and sending client events (whispering).
- **Components:**
    - `WebSocketStatus.vue`: Displays the current WebSocket connection status and allows manual connect/disconnect.
    - `WebSocketDebug.vue`: A utility component for subscribing to channels, sending messages, and viewing received messages for debugging purposes.
    - `ConnectionIndicator.vue`: A simple visual indicator of the connection status.

### Environment Configuration

Ensure your `.env` file (or `.env.local`) is configured with the following variables for the WebSocket server (e.g., Laravel Reverb):

```env
VITE_REVERB_APP_KEY="your_app_key"
VITE_REVERB_HOST="localhost" # Or your Reverb host
VITE_REVERB_PORT="6001"      # Or your Reverb port
VITE_REVERB_SCHEME="http"    # Or https
VITE_WEBSOCKET_AUTO_CONNECT="true" # Set to "true" to connect automatically on app startup
```

### Using Composables

#### `useWebSocket()`

This composable is the primary way to interact with the WebSocket connection status and general WebSocket state.

```vue
<script setup lang="ts">
import { useWebSocket } from '@/composables/useWebSocket';

const { status, isConnected, messages, lastMessage, connect, disconnect } = useWebSocket();

// Example: Connect manually if not auto-connected
// if (!isConnected.value) {
//   connect();
// }
</script>

<template>
  <div>
    <p>Status: {{ status }}</p>
    <p>Connected: {{ isConnected }}</p>
    <button @click="connect" :disabled="isConnected">Connect</button>
    <button @click="disconnect" :disabled="!isConnected">Disconnect</button>
    <div>Last message: {{ lastMessage?.data }}</div>
  </div>
</template>
```

#### `useChannel(channelName)`

This composable allows components to subscribe to specific channels and handle events.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useChannel } from '@/composables/useChannel';

const channelName = 'public.playground'; // Example channel
const { subscribe, listen, stopListening, leaveChannel, sendClientEvent, isLoading, error, channelMessages } = useChannel(channelName);

const eventName = '.PublicEvent'; // Example event

const handleNewEvent = (data: any) => {
  console.log(`Received event '${eventName}' on channel '${channelName}':`, data);
  // channelMessages will also be updated automatically
};

// Subscribe and listen
subscribe(); // Connects to the channel itself (e.g., for presence events if it's a presence channel)
listen(eventName, handleNewEvent);

// To stop listening to a specific event
// stopListening(eventName, handleNewEvent);

// To leave the channel entirely
// leaveChannel();

// To send a client event (whisper - for private/presence channels)
// sendClientEvent('client-my-event', { message: 'Hello from client!' });

</script>

<template>
  <div>
    <p>Listening on channel: {{ channelName }} for event: {{ eventName }}</p>
    <div v-if="isLoading">Subscribing to channel...</div>
    <div v-if="error">Error: {{ error }}</div>
    <h4>Channel Messages for {{ channelName }}:</h4>
    <ul>
      <li v-for="(msg, index) in channelMessages" :key="index">
        {{ msg.event }}: {{ msg.data }}
      </li>
    </ul>
  </div>
</template>
```

### Debugging

The `WebSocketDebug.vue` component (available in `App.vue` by default if you followed the refactoring) can be used to manually subscribe to channels, send messages, and view all incoming messages, which is helpful during development and testing.

### Lint with [ESLint](https://eslint.org/)