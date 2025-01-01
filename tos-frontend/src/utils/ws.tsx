import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWebSocketStore } from "@/state";
import { RefreshCcw, Wifi, WifiOff } from "lucide-react";
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
    <div className="websocket-status flex flex-row items-center justify-center">
      <div className={`status-indicator ${connectionStatus}`}>
        {
          connectionStatus == 'connected' ? (
            <Badge className="bg-green-700 gap-x-2">
              <Wifi className="w-4 h-4" /> connected
            </Badge>
          ) : (
            <Badge className="bg-red-700">
              <WifiOff className="w-4 h-4" /> disconnected
            </Badge>
          )
        }
      </div>
      <Button
        onClick={() => connect(wsUrl)}
        disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
        className="reconnect-btn"
        variant="ghost"
      >
        <RefreshCcw />
      </Button>
    </div>
  );
};

{/* <div className="websocket-status"> */ }
{/*   <div className={`status-indicator ${connectionStatus}`}> */ }
{/*     Connection Status: {connectionStatus} */ }
{/*   </div> */ }
{/*   <button */ }
{/*     onClick={() => connect(wsUrl)} */ }
{/*     disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'} */ }
{/*     className="reconnect-btn" */ }
{/*   > */ }
{/*     Reconnect */ }
{/*   </button> */ }
{/* </div> */ }
