// src/utils/events.ts

type EventCallback<T = any> = (data: T) => void;
interface EventListeners {
  [eventName: string]: EventCallback[];
}

export class EventBus {
  private listeners: EventListeners = {};

  on<T = any>(eventName: string, callback: EventCallback<T>): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback as EventCallback);
  }

  off<T = any>(eventName: string, callback: EventCallback<T>): void {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName] = this.listeners[eventName].filter(
      (listener) => listener !== callback
    );
    if (this.listeners[eventName].length === 0) {
      delete this.listeners[eventName];
    }
  }

  emit<T = any>(eventName: string, data?: T): void {
    if (!this.listeners[eventName]) {
      return;
    }
    this.listeners[eventName].forEach((callback) => {
      try {
        callback(data as T);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error in event bus callback for ${eventName}:`, error);
      }
    });
  }

  once<T = any>(eventName: string, callback: EventCallback<T>): void {
    const onceCallback: EventCallback<T> = (data) => {
      callback(data);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }
}

export const eventBus = new EventBus();
