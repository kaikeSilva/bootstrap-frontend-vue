import { defineStore } from 'pinia';
import { reactive, readonly, computed } from 'vue';
import type { WebSocketService } from '@/services/websocket/WebSocketService';
import { WEBSOCKET_EVENTS } from '@/services/websocket/config';
import type { WebSocketState, WebSocketMessage, ConnectionStatus } from '@/services/websocket/types';
import { eventBus } from '@/utils/events';
import { logger } from '@/utils/logger';

export const useWebSocketStore = defineStore('websocket', () => {
  let serviceInstance: WebSocketService | null = null;

  const state = reactive<WebSocketState>({
    status: 'disconnected',
    isConnected: false,
    socketId: null,
    lastError: null,
    reconnectAttempts: 0,
    messages: [],
  });

  const initializeService = (service: WebSocketService) => {
    logger.info('Pinia Store: Initializing WebSocketService...');
    serviceInstance = service;
    Object.assign(state, serviceInstance.state);
  };

  const connect = async () => {
    if (!serviceInstance) {
      logger.error('Pinia Store: Service not initialized before connect.');
      return;
    }
    logger.info('Pinia Store: Conectando ao WebSocket...');
    await serviceInstance.connect();
  };

  const disconnect = () => {
    if (!serviceInstance) return;
    logger.info('Pinia Store: Desconectando do WebSocket...');
    serviceInstance.disconnect();
  };

  const subscribe = (channel: string, event: string, callback: (data: any) => void) => {
    if (!serviceInstance) return;
    logger.info(`Pinia Store: Inscrevendo no canal ${channel}, evento ${event}`);
    serviceInstance.subscribe(channel, event, callback);
  };

  const unsubscribe = (channel: string, event?: string) => {
    if (!serviceInstance) return;
    logger.info(`Pinia Store: Cancelando inscrição do canal ${channel}` + (event ? `, evento ${event}`: ''));
    serviceInstance.unsubscribe(channel, event);
  };

  const sendMessage = (channel: string, event: string, data: any) => {
    if (!serviceInstance) return;
    logger.info(`Pinia Store: Enviando mensagem para canal ${channel}, evento ${event}`, data);
    serviceInstance.send(channel, event, data);
  };
  
  eventBus.on(WEBSOCKET_EVENTS.CONNECTED, ({ socketId }) => {
    logger.info('Pinia Store: Evento CONNECTED recebido', { socketId });
    if (serviceInstance) Object.assign(state, serviceInstance.state);
  });

  eventBus.on(WEBSOCKET_EVENTS.DISCONNECTED, () => {
    logger.info('Pinia Store: Evento DISCONNECTED recebido');
    if (serviceInstance) Object.assign(state, serviceInstance.state);
  });

  eventBus.on(WEBSOCKET_EVENTS.ERROR, (error) => {
    logger.error('Pinia Store: Evento ERROR recebido', error);
    if (serviceInstance) Object.assign(state, serviceInstance.state);
  });

  eventBus.on(WEBSOCKET_EVENTS.MESSAGE_RECEIVED, (message: WebSocketMessage) => {
    logger.info('Pinia Store: Evento MESSAGE_RECEIVED recebido', message);
    if (serviceInstance) Object.assign(state, serviceInstance.state);
  });

  eventBus.on(WEBSOCKET_EVENTS.RECONNECTING, ({ attempt }) => {
    logger.info(`Pinia Store: Evento RECONNECTING recebido (tentativa ${attempt})`);
    if (serviceInstance) Object.assign(state, serviceInstance.state);
  });

  eventBus.on(WEBSOCKET_EVENTS.RECONNECT_FAILED, () => {
    logger.error('Pinia Store: Evento RECONNECT_FAILED recebido');
    if (serviceInstance) Object.assign(state, serviceInstance.state);
  });

  const lastMessage = computed(() => {
    if (serviceInstance && serviceInstance.state.messages.length > 0) {
      return serviceInstance.state.messages[serviceInstance.state.messages.length - 1];
    }
    return null;
  });

  const exposedState = computed(() => serviceInstance ? serviceInstance.state : state);

  return {
    state: readonly(exposedState.value),
    initializeService,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    getSocketId: () => serviceInstance?.getSocketId() ?? null,
    status: computed(() => serviceInstance?.state.status ?? state.status),
    isConnected: computed(() => serviceInstance?.state.isConnected ?? state.isConnected),
    socketId: computed(() => serviceInstance?.state.socketId ?? state.socketId),
    lastError: computed(() => serviceInstance?.state.lastError ?? state.lastError),
    messages: computed(() => serviceInstance?.state.messages ?? state.messages),
    lastMessage,
  };
});
