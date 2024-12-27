import { useWebSocketStore } from "@/state";
import { useEffect } from "react";


// baseURL: import.meta.env.VITE_API_URL || 'http://localhost:6300',

export function WebSocketManager() {
  const { connect, connectionStatus, disconnect } = useWebSocketStore();

  const wsUrl = "ws://192.168.8.103:6300"

  // Connect when component mounts
  useEffect(() => {
    connect(wsUrl);

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [wsUrl, connect, disconnect]);

  return (
    <div className="websocket-status">
      <div className={`status-indicator ${connectionStatus}`}>
        Connection Status: {connectionStatus}
      </div>
      <button
        onClick={() => connect(wsUrl)}
        disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
        className="reconnect-btn"
      >
        Reconnect
      </button>
    </div>
  );
};
