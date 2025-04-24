// src/services/mqttService.ts

// Mock implementation until we set up real MQTT connection
interface MQTTConfig {
  brokerUrl: string;
  clientId: string;
  username?: string;
  password?: string;
}

class MQTTService {
  private connected: boolean = false;
  private messageListeners: Map<string, ((message: string) => void)[]> = new Map();

  // Simulate connection to MQTT broker
  connect(config: MQTTConfig): Promise<void> {
    return new Promise((resolve) => {
      console.log(`Connecting to MQTT broker: ${config.brokerUrl}`);
      setTimeout(() => {
        this.connected = true;
        console.log('Connected to MQTT broker (simulated)');
        resolve();
      }, 1000);
    });
  }

  // Simulate subscribing to a topic
  subscribe(topic: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('MQTT client not connected'));
        return;
      }

      console.log(`Subscribed to topic: ${topic} (simulated)`);
      resolve();
    });
  }

  // Simulate publishing to a topic
  publish(topic: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('MQTT client not connected'));
        return;
      }

      console.log(`Published to topic: ${topic}, message: ${message} (simulated)`);
      
      // Simulate receiving the message we just sent
      setTimeout(() => {
        const listeners = this.messageListeners.get(topic);
        if (listeners) {
          listeners.forEach(listener => listener(message));
        }
      }, 500);
      
      resolve();
    });
  }

  // Add a listener for messages on a topic
  addMessageListener(topic: string, listener: (message: string) => void): void {
    const listeners = this.messageListeners.get(topic) || [];
    listeners.push(listener);
    this.messageListeners.set(topic, listeners);
  }

  // Disconnect from MQTT broker
  disconnect(): void {
    this.connected = false;
    console.log('Disconnected from MQTT broker (simulated)');
  }
}

export default new MQTTService(); 