class WebSocketService {
    constructor(url) {
      this.url = url;
      this.socket = null;
      this.listeners = [];
      this.reconnectTimeout = 5000; // Reconnect after 5 seconds if disconnected
    }
  
    // Connect to WebSocket
    connect() {
      if (this.socket) {
        console.warn("WebSocket is already connected.");
        return;
      }
  
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log("✅ WebSocket connected to", this.url);
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket Message Received:", data);
        
        // Notify all listeners
        this.listeners.forEach((callback) => callback(data));
      };
  
      this.socket.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
      };
  
      this.socket.onclose = () => {
        console.warn("⚠️ WebSocket Disconnected. Reconnecting in 5s...");
        this.socket = null;
  
        setTimeout(() => {
          this.connect(); // Reconnect automatically
        }, this.reconnectTimeout);
      };
    }
  
    // Send message to WebSocket server
    sendMessage(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
        console.log("📤 Sent message:", message);
      } else {
        console.warn("⚠️ Cannot send message. WebSocket is not open.");
      }
    }
  
    // Add listener for incoming messages
    addMessageListener(callback) {
      this.listeners.push(callback);
    }
  
    // Remove a listener
    removeMessageListener(callback) {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    }
  
    // Disconnect WebSocket
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  // Create a single WebSocketService instance
  const wsService = new WebSocketService("wss://74c4-103-247-52-218.ngrok-free.app/ws/vciq/");
  export default wsService;
   