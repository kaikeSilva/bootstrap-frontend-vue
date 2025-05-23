import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { reactive } from 'vue';
import type { WebSocketConfig, WebSocketState, WebSocketMessage } from './types';
import { WEBSOCKET_EVENTS } from './config';
import type { Logger } from '@/utils/logger';
import type { EventBus } from '@/utils/events';

// Tornar Pusher disponível globalmente
(window as any).Pusher = Pusher;

export class WebSocketService {
  private echo: Echo<any> | null = null;
  private config: WebSocketConfig;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private logger: Logger;
  private eventBus: EventBus;
  
  public state = reactive<WebSocketState>({
    status: 'disconnected',
    isConnected: false,
    socketId: null,
    lastError: null,
    reconnectAttempts: 0,
    messages: [],
  });

  constructor(config: WebSocketConfig, eventBus: EventBus, logger: Logger) {
    this.config = config;
    this.eventBus = eventBus;
    this.logger = logger;
    this.setupGlobalErrorHandling();
  }

  async connect(): Promise<void> {
    try {
      this.updateStatus('connecting');
      this.logger.info('Iniciando conexão WebSocket...', this.config);

      if (this.echo) {
        this.disconnect();
      }

      this.echo = new Echo(this.config as any); // Cast to any due to Echo types
      await this.setupConnectionHandlers();
      
    } catch (error) {
      this.logger.error('Erro ao conectar WebSocket:', error);
      this.handleConnectionError(error as Error);
    }
  }

  disconnect(): void {
    if (this.echo) {
      this.logger.info('Desconectando WebSocket...');
      this.echo.disconnect();
      this.echo = null;
    }
    
    this.clearReconnectTimer();
    this.updateStatus('disconnected');
    this.eventBus.emit(WEBSOCKET_EVENTS.DISCONNECTED);
  }

  subscribe(channel: string, event: string, callback: (data: any) => void): void {
    if (!this.echo) {
      throw new Error('WebSocket não conectado');
    }

    this.logger.info(`Inscrevendo no canal: ${channel}, evento: ${event}`);
    
    this.echo.channel(channel).listen(event, (data: any) => {
      const message: WebSocketMessage = {
        id: crypto.randomUUID(),
        channel,
        event,
        data,
        timestamp: new Date(),
      };
      this.state.messages.push(message);
      this.eventBus.emit(WEBSOCKET_EVENTS.MESSAGE_RECEIVED, message);
      callback(data);
    });
  }

  unsubscribe(channel: string, event?: string): void {
    if (!this.echo) {
      return;
    }
    this.logger.info(`Cancelando inscrição do canal: ${channel}` + (event ? `, evento: ${event}` : ''));
    if (event) {
      this.echo.channel(channel).stopListening(event);
    } else {
      this.echo.leaveChannel(channel);
    }
  }

  send(channel: string, event: string, data: any): void {
    if (!this.echo || !this.state.isConnected) {
      throw new Error('WebSocket não conectado para enviar mensagem.');
    }
    // Laravel Echo's client events are typically prefixed with 'client-'
    // This example assumes you might be using whisper or a similar client event mechanism
    // Pusher client events need to be enabled on the server side
    // For standard Pusher, you might need a different approach or use HTTP for sending if not using client events.
    this.logger.info(`Enviando mensagem para canal: ${channel}, evento: ${event}`, data);
    this.echo.private(channel).whisper(event, data); 
  }

  private async setupConnectionHandlers(): Promise<void> {
    if (!this.echo) return;

    this.echo.connector.pusher.connection.bind('connected', () => {
      this.updateStatus('connected');
      this.state.socketId = this.echo?.socketId() || null;
      this.state.reconnectAttempts = 0;
      this.clearReconnectTimer();
      this.logger.info('WebSocket conectado com sucesso!', { socketId: this.state.socketId });
      this.eventBus.emit(WEBSOCKET_EVENTS.CONNECTED, { socketId: this.state.socketId });
    });

    this.echo.connector.pusher.connection.bind('connecting', () => {
      this.updateStatus('connecting');
      this.logger.info('WebSocket tentando conectar...');
      this.eventBus.emit(WEBSOCKET_EVENTS.CONNECTING);
    });

    this.echo.connector.pusher.connection.bind('disconnected', () => {
      this.logger.warn('WebSocket desconectado.');
      this.updateStatus('disconnected');
      this.eventBus.emit(WEBSOCKET_EVENTS.DISCONNECTED);
      if (this.config.reconnectAttempts && this.config.reconnectInterval) {
        this.scheduleReconnect();
      }
    });

    this.echo.connector.pusher.connection.bind('error', (err: any) => {
      this.logger.error('Erro na conexão WebSocket:', err);
      this.handleConnectionError(err as Error);
      this.eventBus.emit(WEBSOCKET_EVENTS.ERROR, err);
    });
  }

  private handleConnectionError(error: Error): void {
    this.state.lastError = error.message;
    this.updateStatus('failed');
    if (this.config.reconnectAttempts && this.config.reconnectInterval) {
        this.scheduleReconnect();
    }
  }

  private updateStatus(status: WebSocketState['status']): void {
    this.state.status = status;
    this.state.isConnected = status === 'connected';
    if (status === 'disconnected' || status === 'failed') {
        this.state.socketId = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.state.reconnectAttempts >= (this.config.reconnectAttempts || 5)) {
      this.logger.error('Máximo de tentativas de reconexão atingido');
      this.updateStatus('failed');
      this.eventBus.emit(WEBSOCKET_EVENTS.RECONNECT_FAILED);
      return;
    }

    this.clearReconnectTimer();
    this.updateStatus('reconnecting');
    this.state.reconnectAttempts++;
    this.logger.info(`Tentando reconectar em ${this.config.reconnectInterval}ms... (Tentativa ${this.state.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
    this.eventBus.emit(WEBSOCKET_EVENTS.RECONNECTING, { attempt: this.state.reconnectAttempts });
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setupGlobalErrorHandling(): void {
    // Exemplo: Capturar erros não tratados que podem indicar problemas de conexão
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && typeof event.reason.message === 'string') {
          if (event.reason.message.includes('Pusher: Connection timed out')) {
            this.logger.error('Erro global: Timeout de conexão Pusher detectado.', event.reason);
            this.handleConnectionError(new Error('Pusher connection timed out'));
          }
        }
      });
    }
  }

  public getSocketId(): string | null {
    return this.state.socketId;
  }
}
