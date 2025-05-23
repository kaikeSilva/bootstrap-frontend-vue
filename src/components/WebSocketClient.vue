<template>
  <div class="websocket-client">
    <h2>Laravel Echo with Reverb Example</h2>

    <div class="status-display">
      <h3>Connection Status:</h3>
      <p :class="statusClass"><strong>Status:</strong> {{ connectionStatus }}</p>
      <p><strong>App ID:</strong> {{ echoOptions.key || 'N/A' }}</p>
      <p><strong>Host:</strong> {{ echoOptions.wsHost || 'N/A' }}</p>
      <p><strong>Port:</strong> {{ echoOptions.wsPort || 'N/A' }}</p>
      <p v-if="statusMessage"><strong>Message:</strong> {{ statusMessage }}</p>
    </div>

    <div class="messages">
      <h3>Received Messages/Events:</h3>
      <ul>
        <li v-for="(message, index) in receivedMessages" :key="index">
          <strong>{{ message.channel }} / {{ message.event }}:</strong>
          <pre>{{ JSON.stringify(message.data, null, 2) }}</pre>
        </li>
      </ul>
      <p v-if="receivedMessages.length === 0 && connectionStatus === 'Connected'">No messages received yet.</p>
    </div>

     <div class="event-log">
      <h3>Event Log:</h3>
      <ul>
        <li v-for="(log, index) in eventLog" :key="index">{{ log }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Echo
(window as any).Pusher = Pusher;

// Verificar se Pusher foi carregado corretamente
console.log('Pusher loaded:', typeof Pusher);
console.log('Window.Pusher:', typeof (window as any).Pusher);

// Define the Transport type based on Pusher's expected values
type PusherTransport = 'ws' | 'wss' | 'xhr_streaming' | 'xhr_polling' | 'sockjs';

// Renamed to avoid conflict with Echo's own EchoOptions type
interface MyReverbConfig {
  broadcaster: 'reverb'; // Specific literal type
  key: string;
  wsHost: string;
  wsPort: number;
  wssPort: number;
  forceTLS: boolean;
  enabledTransports: PusherTransport[]; // Use the specific Transport type
  cluster: string; // Made mandatory as per PusherEchoOptions
}

interface ReceivedMessage {
  channel: string;
  event: string;
  data: any;
}

export default defineComponent({
  name: 'WebSocketClient',
  setup() {
    const connectionStatus = ref('Initializing...');
    const statusMessage = ref('');
    const receivedMessages = ref<ReceivedMessage[]>([]);
    const eventLog = ref<string[]>([]);
    let echo: Echo<any> | null = null;

    const VITE_REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY || 'rpfnh21jtr3szlu5frah';
    const VITE_REVERB_HOST = import.meta.env.VITE_REVERB_HOST || 'localhost';
    const VITE_REVERB_PORT = parseInt(import.meta.env.VITE_REVERB_PORT || '6001', 10);
    const VITE_REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME || 'ws';
    const VITE_REVERB_CLUSTER = import.meta.env.VITE_REVERB_CLUSTER || 'mt1';

    const echoOptions = ref<any>({
      broadcaster: 'reverb',
      key: VITE_REVERB_APP_KEY,
      wsHost: VITE_REVERB_HOST,
      wsPort: VITE_REVERB_PORT,
      wssPort: VITE_REVERB_PORT,
      forceTLS: VITE_REVERB_SCHEME === 'https',
      enabledTransports: ['ws', 'wss'],
      cluster: VITE_REVERB_CLUSTER,
      // Adicionar configurações extras para debug
      enableLogging: true,
      logToConsole: true,
    });

    const logEvent = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`[${timestamp}] ${message}`);
      eventLog.value.push(`[${timestamp}] ${message}`);
    };

    const statusClass = computed(() => {
      if (connectionStatus.value === 'Connected') return 'status-connected';
      if (connectionStatus.value === 'Connecting...') return 'status-connecting';
      return 'status-disconnected';
    });

    const subscribeToChannels = () => {
      if (!echo) return;

      try {
        // Listen on the public channel 'public.playground'
        echo.channel('public.playground')
          .listen('.PublicEvent', (data: any) => {
            logEvent(`Received from public.playground .PublicEvent: ${JSON.stringify(data)}`);
            receivedMessages.value.push({ channel: 'public.playground', event: '.PublicEvent', data });
          });

        // Listen on test channels
        const testChannels = [
          { channel: 'test-channel', event: '.test.websocket.event' },
          { channel: 'message-channel', event: '.test.message.event' },
          { channel: 'notification-channel', event: '.test.notification.event' },
        ];

        testChannels.forEach(sub => {
          echo!.channel(sub.channel)
            .listen(sub.event, (e: any) => {
              logEvent(`Received ${sub.event} on ${sub.channel}: ${JSON.stringify(e)}`);
              receivedMessages.value.push({ channel: sub.channel, event: sub.event, data: e });
            });
          logEvent(`Subscribed to ${sub.channel} for ${sub.event}`);
        });

        logEvent('All channels subscribed successfully.');
      } catch (error: any) {
        logEvent(`Error subscribing to channels: ${JSON.stringify(error)}`);
      }
    };

    const initializeEcho = () => {
      logEvent('Attempting to connect to WebSocket...');
      logEvent(`Config: ${JSON.stringify(echoOptions.value)}`);
      logEvent(`Will connect to: ${VITE_REVERB_SCHEME}://${VITE_REVERB_HOST}:${VITE_REVERB_PORT}`);
      
      try {
        if (echo) {
          logEvent('Disconnecting existing Echo instance...');
          echo.disconnect();
        }

        logEvent('Creating new Echo instance...');
        echo = new Echo(echoOptions.value);

        if (!echo) {
          throw new Error('Failed to create Echo instance - instance is null');
        }

        logEvent('Echo instance created successfully.');
        
        // Check if connector exists
        if (!echo.connector) {
          throw new Error('Echo connector is not available');
        }

        logEvent('Echo connector found.');
        connectionStatus.value = 'Connecting...';

        // Para Reverb, precisamos aguardar o socket ser criado
        // Vamos usar um timeout para dar tempo para o socket ser inicializado
        setTimeout(() => {
          if (!echo || !echo.connector) {
            logEvent('Echo or connector not available after timeout');
            return;
          }

          // Verificar se o socket foi criado
          if (echo.connector.socket) {
            logEvent('Socket found after timeout. Setting up event listeners...');
            setupSocketListeners();
          } else {
            logEvent('Socket still not available after timeout. Trying alternative approach...');
            // Tenta usar os eventos do pusher diretamente
            setupPusherListeners();
          }
        }, 1000);

        // Também tenta conectar após 2 segundos se ainda não conectou
        setTimeout(() => {
          if (echo && echo.connector && echo.connector.pusher) {
            const state = echo.connector.pusher.connection.state;
            logEvent(`Connection state after 2s: ${state}`);
            
            if (state === 'initialized' || state === 'disconnected') {
              logEvent('Attempting manual connection...');
              echo.connector.pusher.connect();
            }
          }
        }, 2000);

        // Também tenta configurar listeners imediatamente caso o socket já exista
        if (echo.connector.socket) {
          logEvent('Socket available immediately. Setting up event listeners...');
          setupSocketListeners();
        } else {
          logEvent('Socket not immediately available, waiting...');
        }

      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : '';
        logEvent(`Error initializing Echo: ${errorMessage}`);
        if (errorStack) {
          logEvent(`Error stack: ${errorStack}`);
        }
        logEvent(`Raw error object: ${JSON.stringify(error)}`);
        connectionStatus.value = 'Error';
        statusMessage.value = `Failed to initialize Echo: ${errorMessage}`;
      }
    };

    const setupSocketListeners = () => {
      if (!echo || !echo.connector || !echo.connector.socket) {
        logEvent('Cannot setup socket listeners - socket not available');
        return;
      }

      // Connection event handlers
      echo.connector.socket.on('connect', () => {
        connectionStatus.value = 'Connected';
        const socketId = echo?.socketId() || 'unknown';
        statusMessage.value = `Connected with socket ID: ${socketId}`;
        logEvent('Successfully connected to WebSocket.');
        subscribeToChannels();
      });

      echo.connector.socket.on('disconnect', (reason: string) => {
        connectionStatus.value = 'Disconnected';
        statusMessage.value = `Disconnected: ${reason}`;
        logEvent(`WebSocket disconnected: ${reason}`);
      });

      echo.connector.socket.on('error', (error: any) => {
        connectionStatus.value = 'Error';
        statusMessage.value = `Error: ${error.message || error}`;
        logEvent(`WebSocket error: ${JSON.stringify(error)}`);
      });

      echo.connector.socket.on('connect_error', (error: any) => {
        connectionStatus.value = 'Connection Error';
        statusMessage.value = `Connection failed: ${error.message || error}`;
        logEvent(`WebSocket connection error: ${JSON.stringify(error)}`);
      });

      logEvent('Socket event listeners set up successfully.');
    };

    const setupPusherListeners = () => {
      if (!echo || !echo.connector || !echo.connector.pusher) {
        logEvent('Cannot setup pusher listeners - pusher not available');
        return;
      }

      const currentState = echo.connector.pusher.connection.state;
      logEvent(`Pusher connection state: ${currentState}`);
      
      // Se já está conectado, atualizar status imediatamente
      if (currentState === 'connected') {
        logEvent('Pusher: Already connected!');
        connectionStatus.value = 'Connected';
        statusMessage.value = 'Connected to Reverb';
        subscribeToChannels();
      }
      
      // Usar eventos do Pusher diretamente
      echo.connector.pusher.connection.bind('connecting', () => {
        logEvent('Pusher: Connecting...');
        connectionStatus.value = 'Connecting...';
        statusMessage.value = 'Connecting to Reverb...';
      });

      echo.connector.pusher.connection.bind('connected', () => {
        logEvent('Pusher: Connected successfully!');
        connectionStatus.value = 'Connected';
        statusMessage.value = 'Connected to Reverb';
        subscribeToChannels();
      });

      echo.connector.pusher.connection.bind('disconnected', () => {
        logEvent('Pusher: Disconnected');
        connectionStatus.value = 'Disconnected';
        statusMessage.value = 'Disconnected from Reverb';
      });

      echo.connector.pusher.connection.bind('error', (error: any) => {
        logEvent(`Pusher: Connection error - ${JSON.stringify(error)}`);
        connectionStatus.value = 'Error';
        statusMessage.value = 'Connection error';
      });

      echo.connector.pusher.connection.bind('unavailable', () => {
        logEvent('Pusher: Connection unavailable');
        connectionStatus.value = 'Unavailable';
        statusMessage.value = 'Connection unavailable';
      });

      echo.connector.pusher.connection.bind('failed', () => {
        logEvent('Pusher: Connection failed');
        connectionStatus.value = 'Failed';
        statusMessage.value = 'Connection failed';
      });

      // Forçar tentativa de conexão se não está conectando automaticamente
      if (echo.connector.pusher.connection.state === 'initialized') {
        logEvent('Forcing connection attempt...');
        echo.connector.pusher.connect();
      }

      logEvent('Pusher event listeners set up successfully.');
    };

    onMounted(() => {
      initializeEcho();
    });

    onUnmounted(() => {
      if (echo) {
        logEvent('Disconnecting from WebSocket...');
        echo.disconnect();
        connectionStatus.value = 'Disconnected (Component Unmounted)';
        logEvent('Disconnected due to component unmount.');
      }
    });

    return {
      connectionStatus,
      statusMessage,
      receivedMessages,
      eventLog,
      echoOptions,
      statusClass
    };
  },
});
</script>

<style scoped>
.websocket-client {
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-display, .messages, .event-log {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.status-display h3, .messages h3, .event-log h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2c3e50;
}

.status-connected {
  color: green;
  font-weight: bold;
}

.status-disconnected, .status-error {
  color: red;
  font-weight: bold;
}

.status-connecting {
  color: orange;
  font-weight: bold;
}

.messages ul, .event-log ul {
  list-style-type: none;
  padding-left: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.messages li, .event-log li {
  padding: 8px;
  border-bottom: 1px dashed #eee;
  font-size: 0.9em;
}

.messages li:last-child, .event-log li:last-child {
  border-bottom: none;
}

.messages pre {
  background-color: #eef;
  padding: 5px;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>