import { PrivateChannel } from './PrivateChannel';
import type { WebSocketService } from '../WebSocketService';
import { logger } from '@/utils/logger';

export interface PresenceMember {
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: Record<string, any>; 
}

export class PresenceChannel extends PrivateChannel {
  constructor(service: WebSocketService, name: string) {
    // Ensure presence channel names are prefixed appropriately
    const presenceChannelName = name.startsWith('presence-') ? name : `presence-${name}`;
    super(service, presenceChannelName);
    logger.info(`[PresenceChannel] Initialized for presence channel: ${this.name}`);
    // Echo's join(channelName) method handles the actual subscription and auth for presence channels.
    // This class wraps that functionality.
  }

  /**
   * Register a callback to be executed when the client successfully joins the channel.
   * @param callback Callback that receives the list of current members in the channel.
   */
  here(callback: (members: PresenceMember[]) => void): this {
    if (!this.service || !this.service['echo']) { // Check if echo instance exists
      logger.error(`[PresenceChannel:${this.name}] Echo instance not available for 'here'.`);
      return this;
    }
    logger.info(`[PresenceChannel:${this.name}] Registering 'here' callback.`);
    this.service['echo'].join(this.name).here(callback);
    return this;
  }

  /**
   * Register a callback to be executed when a new member joins the channel.
   * @param callback Callback that receives the member who joined.
   */
  joining(callback: (member: PresenceMember) => void): this {
    if (!this.service || !this.service['echo']) {
      logger.error(`[PresenceChannel:${this.name}] Echo instance not available for 'joining'.`);
      return this;
    }
    logger.info(`[PresenceChannel:${this.name}] Registering 'joining' callback.`);
    this.service['echo'].join(this.name).joining(callback);
    return this;
  }

  /**
   * Register a callback to be executed when a member leaves the channel.
   * @param callback Callback that receives the member who left.
   */
  leaving(callback: (member: PresenceMember) => void): this {
    if (!this.service || !this.service['echo']) {
      logger.error(`[PresenceChannel:${this.name}] Echo instance not available for 'leaving'.`);
      return this;
    }
    logger.info(`[PresenceChannel:${this.name}] Registering 'leaving' callback.`);
    this.service['echo'].join(this.name).leaving(callback);
    return this;
  }

  // The `listen` and `whisper` methods are inherited from PrivateChannel/BaseChannel.
  // `listen` will work for custom broadcast events on the presence channel.
  // `whisper` will work for client events on the presence channel.

  // Note: The actual `join` call to Echo is implicitly handled when `here`, `joining`, or `leaving`
  // are first called on the Echo instance for a given presence channel.
  // This class structure assumes you might call these setup methods once.
}
