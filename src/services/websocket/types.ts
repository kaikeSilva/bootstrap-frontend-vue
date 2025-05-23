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
