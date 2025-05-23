import type { WebSocketConfig } from './types';

export const createWebSocketConfig = (): WebSocketConfig => ({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'rpfnh21jtr3szlu5frah',
  wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
  wsPort: parseInt(import.meta.env.VITE_REVERB_PORT || '6001', 10),
  wssPort: parseInt(import.meta.env.VITE_REVERB_PORT || '6001', 10),
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  cluster: import.meta.env.VITE_REVERB_CLUSTER || 'mt1',
  enableLogging: import.meta.env.DEV,
  logToConsole: import.meta.env.DEV,
  reconnectAttempts: 5,
  reconnectInterval: 3000,
});

export const WEBSOCKET_EVENTS = {
  CONNECTING: 'ws:connecting',
  CONNECTED: 'ws:connected',
  DISCONNECTED: 'ws:disconnected',
  ERROR: 'ws:error',
  MESSAGE_RECEIVED: 'ws:message',
  RECONNECTING: 'ws:reconnecting',
  RECONNECT_FAILED: 'ws:reconnect-failed',
} as const;
