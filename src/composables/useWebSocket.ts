import { computed, onMounted, onUnmounted } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';
import type { ConnectionStatus, WebSocketMessage } from '@/services/websocket/types';

export function useWebSocket() {
  const store = useWebSocketStore();

  // Use direct computed properties from the store
  const status = computed<ConnectionStatus>(() => store.status);
  const isConnected = computed<boolean>(() => store.isConnected);
  const socketId = computed<string | null>(() => store.socketId);
  const lastError = computed<string | null>(() => store.lastError);
  // The type for messages will be `readonly WebSocketMessage[]` if store.messages is correctly typed
  const messages = computed<ReadonlyArray<WebSocketMessage>>(() => store.messages);
  const lastMessage = computed<WebSocketMessage | null>(() => store.lastMessage);

  const connect = () => store.connect();
  const disconnect = () => store.disconnect();
  
  // Automatically connect on mount if autoConnect is enabled in config
  // This logic might be better placed in App.vue or a global setup
  // For now, let's keep it, but consider VITE_WEBSOCKET_AUTO_CONNECT
  onMounted(() => {
    const autoConnect = import.meta.env.VITE_WEBSOCKET_AUTO_CONNECT === 'true';
    if (autoConnect && !isConnected.value && status.value !== 'connecting' && status.value !== 'reconnecting') {
      connect();
    }
  });

  onUnmounted(() => {
    // Decide if disconnect should happen automatically
    // Generally, you might not want to disconnect if other parts of the app use the WebSocket
    // Consider application-level connection management instead of component-level.
    // if (import.meta.env.VITE_WEBSOCKET_AUTO_DISCONNECT_ON_UNMOUNT === 'true') {
    //   disconnect(); 
    // }
  });

  return {
    status,
    isConnected,
    socketId,
    lastError,
    messages,
    lastMessage, // Expose lastMessage
    connect,
    disconnect,
    getSocketId: store.getSocketId,
  };
}
