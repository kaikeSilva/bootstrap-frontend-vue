import './assets/main.css'
import './styles/fontawesome.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia

import App from './App.vue';
import router from './router';

// Import WebSocket related services and configurations
import { WebSocketService } from './services/websocket/WebSocketService';
import { createWebSocketConfig } from './services/websocket/config';
import { useWebSocketStore } from './stores/websocket';
import { useNotificationStore } from './stores/notifications'; // Import notification store
import { eventBus } from './utils/events'; // Import event bus
import { logger } from './utils/logger'; // Import logger
import { setupInterceptors } from './services/interceptors'; // Import auth interceptors

const app = createApp(App);

// Initialize Pinia
const pinia = createPinia();
app.use(pinia);

app.use(router);

// Setup API interceptors for authentication
setupInterceptors();

// Initialize WebSocket Service
const wsConfig = createWebSocketConfig();
const webSocketService = new WebSocketService(wsConfig, eventBus, logger);

// Make the service available to stores or globally if needed
// For now, the store will initialize and use it.
const webSocketStore = useWebSocketStore();
webSocketStore.initializeService(webSocketService);

// Initialize Notification Store (already imported, Pinia handles its registration)
// const notificationStore = useNotificationStore(); // No need to call if just using it in components

// Example: Auto-connect on startup (optional)
// Consider moving this to a user action or a specific component's onMounted hook
// if (import.meta.env.VITE_WEBSOCKET_AUTO_CONNECT === 'true') {
//   logger.info('[Main] Auto-connecting WebSocket...');
//   webSocketStore.connect();
// }

app.mount('#app');

// Reminder for .env configuration:
// Ensure your .env or .env.local file has the following variables set for Reverb/Pusher:
// VITE_REVERB_APP_KEY="your_app_key"
// VITE_REVERB_HOST="your_reverb_host" (e.g., localhost)
// VITE_REVERB_PORT="6001" (or your Reverb port)
// VITE_REVERB_SCHEME="http" (or https)
// VITE_REVERB_APP_CLUSTER="mt1" (if applicable, usually not for self-hosted Reverb)
// VITE_WEBSOCKET_AUTO_CONNECT="true" (optional, for auto-connection)
