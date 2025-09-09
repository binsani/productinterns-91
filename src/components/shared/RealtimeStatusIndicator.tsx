import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export const RealtimeStatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    // Monitor overall connection status
    const checkConnection = () => {
      const channels = supabase.getChannels();
      const connectedChannels = channels.filter(channel => 
        channel.state === 'joined' || channel.state === 'joining'
      );
      
      setConnectionCount(connectedChannels.length);
      setIsConnected(connectedChannels.length > 0);
    };

    // Check initial status
    checkConnection();

    // Set up periodic checks
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600">
      <Wifi className="h-3 w-3" />
      Live ({connectionCount})
    </Badge>
  );
};