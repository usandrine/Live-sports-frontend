export type WSMessageType = 
  | 'welcome'
  | 'subscribed'
  | 'unsubscribed'
  | 'match_created'
  | 'match_update'
  | 'commentary'
  | 'subscribe'
  | 'unsubscribe';

export interface WSMessage {
  type: WSMessageType;
  matchId?: number;
  data?: any;
}

type MessageHandler = (message: WSMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isConnecting = false;
  // Match ids we want updates for; replayed every time the socket opens
  private subscriptions: Set<number> = new Set();

  connect(url: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.subscriptions.forEach((matchId) => {
          this.send({ type: 'subscribe', matchId });
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.attemptReconnect(url);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  private attemptReconnect(url: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      this.connect(url);
    }, this.reconnectDelay);
  }

  subscribe(matchId: number) {
    this.subscriptions.add(matchId);
    // If the socket is still connecting, onopen sends this for us
    if (this.isOpen()) {
      this.send({ type: 'subscribe', matchId });
    }
  }

  unsubscribe(matchId: number) {
    this.subscriptions.delete(matchId);
    if (this.isOpen()) {
      this.send({ type: 'unsubscribe', matchId });
    }
  }

  private isOpen() {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  onMessage(handler: MessageHandler) {
    const key = 'global';
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);

    return () => {
      this.handlers.get(key)?.delete(handler);
    };
  }

  onMatchUpdate(handler: (data: any) => void) {
    const key = 'match_update';
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);

    return () => {
      this.handlers.get(key)?.delete(handler);
    };
  }

  onCommentary(handler: (data: any) => void) {
    const key = 'commentary';
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);

    return () => {
      this.handlers.get(key)?.delete(handler);
    };
  }

  private handleMessage(message: WSMessage) {
    // Call global handlers
    const globalHandlers = this.handlers.get('global');
    globalHandlers?.forEach((handler) => handler(message));

    // Call specific handlers
    if (message.type === 'match_created' || message.type === 'match_update') {
      const matchHandlers = this.handlers.get('match_update');
      matchHandlers?.forEach((handler) => handler(message.data));
    }

    if (message.type === 'commentary') {
      const commentaryHandlers = this.handlers.get('commentary');
      commentaryHandlers?.forEach((handler) => handler(message.data));
    }
  }

  private send(message: WSMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
    this.subscriptions.clear();
  }
}

export const wsClient = new WebSocketClient();
