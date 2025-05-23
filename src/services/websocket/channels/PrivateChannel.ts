import { BaseChannel } from './BaseChannel';
import type { WebSocketService } from '../WebSocketService';
import { logger } from '@/utils/logger';

export class PrivateChannel extends BaseChannel {
  constructor(service: WebSocketService, name: string) {
    // Ensure private channel names are prefixed appropriately if not already
    // e.g., if your convention is 'private-channelName'
    const privateChannelName = name.startsWith('private-') ? name : `private-${name}`;
    super(service, privateChannelName);
    logger.info(`[PrivateChannel] Initialized for private channel: ${this.name}`);
    // Private channels require authentication, which Echo handles via its auth endpoint.
    // The subscription itself is handled by `listen` or a specific `join` if needed.
  }

  /**
   * Send a client event (whisper) to this private channel.
   * Note: The server must be configured to allow client events on this channel.
   * @param eventName The name of the event (will be prefixed with 'client-').
   * @param data The data to send.
   */
  whisper<T = any>(eventName: string, data: T): this {
    if (!this.service) {
      logger.error(`[PrivateChannel:${this.name}] WebSocketService not available to whisper event '${eventName}'.`);
      return this;
    }
    logger.info(`[PrivateChannel:${this.name}] Whispering event '${eventName}' with data:`, data);
    // Laravel Echo typically prefixes client events with 'client-'.
    // However, the `whisper` method in Echo's PrivateChannel class handles this.
    this.service.send(this.name, eventName, data); 
    return this;
  }

  // Additional methods specific to private channels can be added here.
  // For example, if there's a specific 'join' procedure beyond normal subscription.
}
