import type { WebSocketService } from '../WebSocketService';
import { logger } from '@/utils/logger';

export abstract class BaseChannel {
  protected service: WebSocketService;
  protected name: string;

  constructor(service: WebSocketService, name: string) {
    this.service = service;
    this.name = name;
    logger.info(`[BaseChannel] Initialized for channel: ${name}`);
  }

  /**
   * Listen for a specific event on the channel.
   * @param event The event name.
   * @param callback The callback function to execute when the event is received.
   */
  listen<T = any>(event: string, callback: (data: T) => void): this {
    if (!this.service) {
      logger.error(`[BaseChannel:${this.name}] WebSocketService not available to listen to event '${event}'.`);
      return this;
    }
    logger.info(`[BaseChannel:${this.name}] Listening to event '${event}'`);
    this.service.subscribe(this.name, event, callback);
    return this;
  }

  /**
   * Stop listening for a specific event on the channel.
   * @param event The event name.
   */
  stopListening(event: string): this {
    if (!this.service) {
      logger.error(`[BaseChannel:${this.name}] WebSocketService not available to stop listening to event '${event}'.`);
      return this;
    }
    logger.info(`[BaseChannel:${this.name}] Stopping listening to event '${event}'`);
    this.service.unsubscribe(this.name, event);
    return this;
  }

  /**
   * Leave the channel. This will unsubscribe from all events on this channel.
   */
  leave(): void {
    if (!this.service) {
      logger.error(`[BaseChannel:${this.name}] WebSocketService not available to leave channel.`);
      return;
    }
    logger.info(`[BaseChannel:${this.name}] Leaving channel`);
    this.service.unsubscribe(this.name);
  }

  /**
   * Get the name of the channel.
   */
  getName(): string {
    return this.name;
  }

  // Abstract methods or properties to be implemented by subclasses if needed
  // For example, specific join methods for private/presence channels
}
