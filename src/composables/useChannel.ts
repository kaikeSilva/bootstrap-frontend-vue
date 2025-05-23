import { onUnmounted, ref, watch } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';
import { logger } from '@/utils/logger';

export function useChannel(channelName: string) {
  const store = useWebSocketStore();
  const isSubscribed = ref(false);
  const lastMessage = ref<any | null>(null);

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (!store.state.isConnected) {
      logger.warn(`[useChannel] WebSocket not connected. Cannot subscribe to ${channelName}, event ${event}. Waiting for connection...`);
      // Optionally, queue subscription or wait for connection
      const unwatch = watch(() => store.state.isConnected, (connected) => {
        if (connected) {
          logger.info(`[useChannel] WebSocket connected. Subscribing to ${channelName}, event ${event}`);
          store.subscribe(channelName, event, (data) => {
            lastMessage.value = data;
            callback(data);
          });
          isSubscribed.value = true;
          unwatch(); // Stop watching once connected and subscribed
        }
      });
      return; // Exit, subscription will happen once connected
    }

    logger.info(`[useChannel] Subscribing to ${channelName}, event ${event}`);
    store.subscribe(channelName, event, (data) => {
      lastMessage.value = data;
      callback(data);
    });
    isSubscribed.value = true;
  };

  const unsubscribe = (event?: string) => {
    logger.info(`[useChannel] Unsubscribing from ${channelName}` + (event ? `, event ${event}` : ''));
    store.unsubscribe(channelName, event);
    isSubscribed.value = false;
  };

  const sendMessage = (event: string, data: any) => {
    if (!store.state.isConnected) {
        logger.error(`[useChannel] Cannot send message on ${channelName}, WebSocket not connected.`);
        throw new Error('WebSocket not connected');
    }
    logger.info(`[useChannel] Sending message on ${channelName}, event ${event}`, data);
    store.sendMessage(channelName, event, data);
  };

  onUnmounted(() => {
    // Unsubscribe from all events on this channel when the component is unmounted
    if (isSubscribed.value) {
      logger.info(`[useChannel] Component unmounted. Unsubscribing from all events on ${channelName}`);
      unsubscribe(); 
    }
  });

  return {
    isSubscribed,
    lastMessage,
    subscribe,
    unsubscribe,
    sendMessage,
  };
}
