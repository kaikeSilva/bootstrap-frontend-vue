nos sistema atual existe um teste sendo feito de uma conexao com websocket. agora eh preciso deixar mais robusto componentizavel e facil de manter. siga os passos abaixo e construa na aplicacao:

# Guia Completo: Arquitetura WebSocket Robusta para Vue.js

Este guia detalha como transformar sua implementação WebSocket em uma solução robusta, componentizável e escalável para aplicações Vue.js profissionais.

## 📁 1. Estrutura de Pastas

Primeiro, organize seu projeto com esta estrutura:

```
src/
├── services/
│   ├── websocket/
│   │   ├── WebSocketService.ts
│   │   ├── types.ts
│   │   ├── config.ts
│   │   └── channels/
│   │       ├── BaseChannel.ts
│   │       ├── PublicChannel.ts
│   │       ├── PrivateChannel.ts
│   │       └── PresenceChannel.ts
├── composables/
│   ├── useWebSocket.ts
│   ├── useChannel.ts
│   └── usePresence.ts
├── stores/
│   ├── websocket.ts
│   └── notifications.ts
├── components/
│   ├── WebSocket/
│   │   ├── WebSocketStatus.vue
│   │   ├── WebSocketDebug.vue
│   │   ├── ConnectionIndicator.vue
│   │   └── index.ts
├── utils/
│   ├── logger.ts
│   └── events.ts
└── types/
    └── websocket.ts
```

## 🔧 2. Tipos e Interfaces

**`src/services/websocket/types.ts`**
```typescript
export type ConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting' 
  | 'failed';

export interface WebSocketConfig {
  broadcaster: 'reverb';
  key: string;
  wsHost: string;
  wsPort: number;
  wssPort: number;
  forceTLS: boolean;
  enabledTransports: Array<'ws' | 'wss' | 'xhr_streaming' | 'xhr_polling' | 'sockjs'>;
  cluster: string;
  enableLogging?: boolean;
  logToConsole?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export interface WebSocketMessage {
  id: string;
  channel: string;
  event: string;
  data: any;
  timestamp: Date;
}

export interface ChannelSubscription {
  channel: string;
  events: string[];
  callback: (data: any) => void;
}

export interface WebSocketState {
  status: ConnectionStatus;
  isConnected: boolean;
  socketId: string | null;
  lastError: string | null;
  reconnectAttempts: number;
  messages: WebSocketMessage[];
}
```

## ⚙️ 3. Configuração Centralizada

**`src/services/websocket/config.ts`**
```typescript
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
```

## 🔌 4. Serviço WebSocket Principal

**`src/services/websocket/WebSocketService.ts`**
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { reactive } from 'vue';
import type { WebSocketConfig, WebSocketState, WebSocketMessage } from './types';
import { WEBSOCKET_EVENTS } from './config';
import { logger } from '@/utils/logger';
import { eventBus } from '@/utils/events';

// Tornar Pusher disponível globalmente
(window as any).Pusher = Pusher;

export class WebSocketService {
  private echo: Echo<any> | null = null;
  private config: WebSocketConfig;
  private reconnectTimer: NodeJS.Timeout | null = null;
  
  public state = reactive<WebSocketState>({
    status: 'disconnected',
    isConnected: false,
    socketId: null,
    lastError: null,
    reconnectAttempts: 0,
    messages: [],
  });

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.setupGlobalErrorHandling();
  }

  async connect(): Promise<void> {
    try {
      this.updateStatus('connecting');
      logger.info('Iniciando conexão WebSocket...', this.config);

      if (this.echo) {
        this.disconnect();
      }

      this.echo = new Echo(this.config);
      await this.setupConnectionHandlers();
      
    } catch (error) {
      logger.error('Erro ao conectar WebSocket:', error);
      this.handleConnectionError(error);
    }
  }

  disconnect(): void {
    if (this.echo) {
      logger.info('Desconectando WebSocket...');
      this.echo.disconnect();
      this.echo = null;
    }
    
    this.clearReconnectTimer();
    this.updateStatus('disconnected');
    eventBus.emit(WEBSOCKET_EVENTS.DISCONNECTED);
  }

  subscribe(channel: string, event: string, callback: (data: any) => void): void {
    if (!this.echo) {
      throw new Error('WebSocket não conectado');
    }

    logger.info(`Inscrevendo no canal: ${channel}, evento: ${event}`);
    
    this.echo.channel(channel).listen(event, (data: any) => {
      const message: WebSocketMessage = {
        id: crypto.randomUUID(),
        channel,
        event,
        data,
        timestamp: new Date(),
      };

      this.addMessage(message);
      callback(data);
      eventBus.emit(WEBSOCKET_EVENTS.MESSAGE_RECEIVED, message);
    });
  }

  subscribeToPrivate(channel: string, event: string, callback: (data: any) => void): void {
    if (!this.echo) {
      throw new Error('WebSocket não conectado');
    }

    this.echo.private(channel).listen(event, callback);
  }

  subscribeToPresence(channel: string, callbacks: {
    here?: (users: any[]) => void;
    joining?: (user: any) => void;
    leaving?: (user: any) => void;
    listen?: Record<string, (data: any) => void>;
  }): void {
    if (!this.echo) {
      throw new Error('WebSocket não conectado');
    }

    const presenceChannel = this.echo.join(channel);

    if (callbacks.here) presenceChannel.here(callbacks.here);
    if (callbacks.joining) presenceChannel.joining(callbacks.joining);
    if (callbacks.leaving) presenceChannel.leaving(callbacks.leaving);
    
    if (callbacks.listen) {
      Object.entries(callbacks.listen).forEach(([event, callback]) => {
        presenceChannel.listen(event, callback);
      });
    }
  }

  private async setupConnectionHandlers(): Promise<void> {
    if (!this.echo) return;

    // Aguardar inicialização do pusher
    await this.waitForPusher();

    const pusher = this.echo.connector.pusher;

    pusher.connection.bind('connecting', () => {
      logger.info('Conectando ao Reverb...');
      this.updateStatus('connecting');
      eventBus.emit(WEBSOCKET_EVENTS.CONNECTING);
    });

    pusher.connection.bind('connected', () => {
      logger.info('Conectado ao Reverb com sucesso!');
      this.state.socketId = this.echo?.socketId() || null;
      this.state.reconnectAttempts = 0;
      this.updateStatus('connected');
      eventBus.emit(WEBSOCKET_EVENTS.CONNECTED);
    });

    pusher.connection.bind('disconnected', () => {
      logger.warn('Desconectado do Reverb');
      this.updateStatus('disconnected');
      this.scheduleReconnect();
    });

    pusher.connection.bind('error', (error: any) => {
      logger.error('Erro de conexão:', error);
      this.handleConnectionError(error);
    });

    // Verificar se já está conectado
    if (pusher.connection.state === 'connected') {
      this.state.socketId = this.echo?.socketId() || null;
      this.updateStatus('connected');
      eventBus.emit(WEBSOCKET_EVENTS.CONNECTED);
    }
  }

  private async waitForPusher(): Promise<void> {
    return new Promise((resolve) => {
      const maxAttempts = 10;
      let attempts = 0;

      const checkPusher = () => {
        if (this.echo?.connector?.pusher || attempts >= maxAttempts) {
          resolve();
          return;
        }
        attempts++;
        setTimeout(checkPusher, 100);
      };

      checkPusher();
    });
  }

  private scheduleReconnect(): void {
    if (this.state.reconnectAttempts >= (this.config.reconnectAttempts || 5)) {
      logger.error('Máximo de tentativas de reconexão atingido');
      this.updateStatus('failed');
      eventBus.emit(WEBSOCKET_EVENTS.RECONNECT_FAILED);
      return;
    }

    this.clearReconnectTimer();
    this.state.reconnectAttempts++;
    
    logger.info(`Tentativa de reconexão ${this.state.reconnectAttempts}/${this.config.reconnectAttempts} em ${this.config.reconnectInterval}ms`);
    
    this.updateStatus('reconnecting');
    eventBus.emit(WEBSOCKET_EVENTS.RECONNECTING, this.state.reconnectAttempts);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval || 3000);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private handleConnectionError(error: any): void {
    const errorMessage = error?.message || error?.toString() || 'Erro desconhecido';
    this.state.lastError = errorMessage;
    this.updateStatus('failed');
    eventBus.emit(WEBSOCKET_EVENTS.ERROR, error);
  }

  private updateStatus(status: WebSocketState['status']): void {
    this.state.status = status;
    this.state.isConnected = status === 'connected';
  }

  private addMessage(message: WebSocketMessage): void {
    this.state.messages.unshift(message);
    
    // Manter apenas as últimas 100 mensagens
    if (this.state.messages.length > 100) {
      this.state.messages = this.state.messages.slice(0, 100);
    }
  }

  private setupGlobalErrorHandling(): void {
    window.addEventListener('online', () => {
      logger.info('Conexão com internet restaurada, tentando reconectar...');
      if (this.state.status !== 'connected') {
        this.connect();
      }
    });

    window.addEventListener('offline', () => {
      logger.warn('Conexão com internet perdida');
      this.updateStatus('disconnected');
    });
  }

  // Getters
  get isConnected(): boolean {
    return this.state.isConnected;
  }

  get status(): WebSocketState['status'] {
    return this.state.status;
  }

  get messages(): WebSocketMessage[] {
    return this.state.messages;
  }
}
```

## 🏪 5. Store Pinia

**`src/stores/websocket.ts`**
```typescript
import { defineStore } from 'pinia';
import { WebSocketService } from '@/services/websocket/WebSocketService';
import { createWebSocketConfig } from '@/services/websocket/config';
import type { WebSocketMessage } from '@/services/websocket/types';

export const useWebSocketStore = defineStore('websocket', () => {
  // Criar instância única do serviço
  const service = new WebSocketService(createWebSocketConfig());

  // Métodos
  const connect = () => service.connect();
  const disconnect = () => service.disconnect();
  
  const subscribe = (channel: string, event: string, callback: (data: any) => void) => {
    return service.subscribe(channel, event, callback);
  };

  const subscribeToPrivate = (channel: string, event: string, callback: (data: any) => void) => {
    return service.subscribeToPrivate(channel, event, callback);
  };

  const subscribeToPresence = (channel: string, callbacks: any) => {
    return service.subscribeToPresence(channel, callbacks);
  };

  // Estado reativo
  const state = service.state;

  return {
    // Estado
    state,
    
    // Getters
    isConnected: () => service.isConnected,
    status: () => service.status,
    messages: () => service.messages,
    
    // Actions
    connect,
    disconnect,
    subscribe,
    subscribeToPrivate,
    subscribeToPresence,
  };
});
```

## 🎯 6. Composables

**`src/composables/useWebSocket.ts`**
```typescript
import { computed, onMounted, onUnmounted } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';

export function useWebSocket() {
  const store = useWebSocketStore();

  // Auto conectar quando usar o composable
  onMounted(() => {
    if (!store.isConnected()) {
      store.connect();
    }
  });

  // Desconectar quando component for destruído (opcional)
  // onUnmounted(() => {
  //   store.disconnect();
  // });

  return {
    // Estado reativo
    state: store.state,
    
    // Computed properties
    isConnected: computed(() => store.isConnected()),
    status: computed(() => store.status()),
    messages: computed(() => store.messages()),
    
    // Métodos
    connect: store.connect,
    disconnect: store.disconnect,
    subscribe: store.subscribe,
    subscribeToPrivate: store.subscribeToPrivate,
    subscribeToPresence: store.subscribeToPresence,
  };
}
```

**`src/composables/useChannel.ts`**
```typescript
import { onUnmounted, ref } from 'vue';
import { useWebSocket } from './useWebSocket';
import type { WebSocketMessage } from '@/services/websocket/types';

export function useChannel(channelName: string) {
  const { subscribe, subscribeToPrivate, isConnected } = useWebSocket();
  const messages = ref<WebSocketMessage[]>([]);
  const subscriptions = ref<string[]>([]);

  const listen = (event: string, callback: (data: any) => void) => {
    if (!isConnected.value) {
      console.warn('WebSocket não conectado. Aguardando conexão...');
    }

    subscribe(channelName, event, (data) => {
      messages.value.unshift({
        id: crypto.randomUUID(),
        channel: channelName,
        event,
        data,
        timestamp: new Date(),
      });
      callback(data);
    });

    subscriptions.value.push(event);
  };

  const listenPrivate = (event: string, callback: (data: any) => void) => {
    subscribeToPrivate(channelName, event, callback);
    subscriptions.value.push(event);
  };

  // Limpar inscrições quando component for destruído
  onUnmounted(() => {
    // Aqui você implementaria a lógica para unsubscribe
    subscriptions.value = [];
  });

  return {
    messages,
    listen,
    listenPrivate,
    subscriptions,
  };
}
```

## 🎨 7. Componentes

**`src/components/WebSocket/WebSocketStatus.vue`**
```vue
<template>
  <div class="websocket-status">
    <div class="status-indicator" :class="statusClass">
      <div class="status-dot"></div>
      <span class="status-text">{{ statusText }}</span>
    </div>
    
    <div v-if="showDetails" class="status-details">
      <p><strong>Socket ID:</strong> {{ state.socketId || 'N/A' }}</p>
      <p v-if="state.lastError"><strong>Último Erro:</strong> {{ state.lastError }}</p>
      <p v-if="state.reconnectAttempts > 0">
        <strong>Tentativas de Reconexão:</strong> {{ state.reconnectAttempts }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

interface Props {
  showDetails?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDetails: false,
});

const { state } = useWebSocket();

const statusClass = computed(() => ({
  'status-connected': state.status === 'connected',
  'status-connecting': state.status === 'connecting' || state.status === 'reconnecting',
  'status-disconnected': state.status === 'disconnected',
  'status-failed': state.status === 'failed',
}));

const statusText = computed(() => {
  const statusTexts = {
    connected: 'Conectado',
    connecting: 'Conectando...',
    disconnected: 'Desconectado',
    reconnecting: 'Reconectando...',
    failed: 'Falha na Conexão',
  };
  return statusTexts[state.status] || 'Status Desconhecido';
});
</script>

<style scoped>
.websocket-status {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.status-connected .status-dot {
  background-color: #28a745;
  animation: pulse 2s infinite;
}

.status-connecting .status-dot {
  background-color: #ffc107;
  animation: blink 1s infinite;
}

.status-disconnected .status-dot,
.status-failed .status-dot {
  background-color: #dc3545;
}

.status-text {
  font-weight: 500;
  font-size: 14px;
}

.status-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
  color: #6c757d;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
```

## 🔧 8. Utilitários

**`src/utils/logger.ts`**
```typescript
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDev = import.meta.env.DEV;

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.isDev && level === 'debug') return;

    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [WebSocket]`;

    switch (level) {
      case 'info':
        console.log(`${prefix} ${message}`, ...args);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, ...args);
        break;
      case 'error':
        console.error(`${prefix} ${message}`, ...args);
        break;
      case 'debug':
        console.debug(`${prefix} ${message}`, ...args);
        break;
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();
```

**`src/utils/events.ts`**
```typescript
import { reactive } from 'vue';

type EventCallback = (...args: any[]) => void;

class EventBus {
  private events: Record<string, EventCallback[]> = reactive({});

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (this.events[event]) {
      const index = this.events[event].indexOf(callback);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  }

  once(event: string, callback: EventCallback) {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

export const eventBus = new EventBus();
```

## 🚀 9. Como Usar na Aplicação

### Em um componente simples:
```vue
<template>
  <div>
    <WebSocketStatus :show-details="true" />
    
    <div v-for="message in channelMessages" :key="message.id">
      <strong>{{ message.event }}:</strong>
      <pre>{{ JSON.stringify(message.data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChannel } from '@/composables/useChannel';
import WebSocketStatus from '@/components/WebSocket/WebSocketStatus.vue';

const { messages: channelMessages, listen } = useChannel('public.playground');

onMounted(() => {
  // Escutar eventos específicos
  listen('.PublicEvent', (data) => {
    console.log('Evento público recebido:', data);
  });

  listen('.test.websocket.event', (data) => {
    console.log('Evento de teste recebido:', data);
  });
});
</script>
```

### Para canais privados:
```vue
<script setup lang="ts">
import { useChannel } from '@/composables/useChannel';

const { listenPrivate } = useChannel('private.user.123');

onMounted(() => {
  listenPrivate('.PrivateMessage', (data) => {
    // Lidar com mensagem privada
  });
});
</script>
```

## 📦 10. Instalação e Configuração

### Instalar dependências:
```bash
npm install pinia laravel-echo pusher-js
```

### Configurar no main.ts:
```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

### Variáveis de ambiente (.env):
```env
VITE_REVERB_APP_KEY=rpfnh21jtr3szlu5frah
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=6001
VITE_REVERB_SCHEME=ws
VITE_REVERB_CLUSTER=mt1
```

## ✅ 11. Benefícios desta Arquitetura

1. **Separação de Responsabilidades**: Cada parte tem uma função específica
2. **Reutilização**: Composables podem ser usados em qualquer componente
3. **Estado Global**: Pinia gerencia o estado de forma reativa
4. **Robustez**: Reconexão automática e tratamento de erros
5. **Debugging**: Logs estruturados e componente de debug
6. **Tipagem**: TypeScript para maior segurança
7. **Escalabilidade**: Fácil adicionar novos canais e eventos
8. **Testabilidade**: Cada parte pode ser testada isoladamente

## 🔧 12. Próximos Passos

1. **Implementar testes unitários** para cada parte
2. **Adicionar middleware** para autenticação em canais privados
3. **Criar sistema de notificações** baseado nos eventos
4. **Implementar cache** para mensagens offline
5. **Adicionar métricas** de performance e conectividade
6. **Criar plugin Vue** para facilitar uso global

Esta arquitetura fornece uma base sólida para aplicações WebSocket profissionais em Vue.js!