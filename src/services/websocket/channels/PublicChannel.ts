import { BaseChannel } from './BaseChannel';
import type { WebSocketService } from '../WebSocketService';
import { logger } from '@/utils/logger';

export class PublicChannel extends BaseChannel {
  constructor(service: WebSocketService, name: string) {
    super(service, name);
    logger.info(`[PublicChannel] Initialized for public channel: ${name}`);
    // Public channels are typically subscribed to directly by Echo
    // No specific join logic needed here usually, `listen` will handle it.
  }

  // Public channels don't have specific methods like 'whisper' or 'here' by default.
  // Any specific logic for public channels can be added here.
}
