
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Smartphone, Globe, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  type: 'message' | 'application' | 'interview' | 'reminder';
  delivered: boolean;
  clicked: boolean;
}

const PushNotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);
  
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: '1',
      title: 'New Message from Sarah Johnson',
      body: 'We would like to schedule an interview with you!',
      timestamp: new Date(Date.now() - 300000),
      type: 'message',
      delivered: true,
      clicked: true
    },
    {
      id: '2',
      title: 'Application Update',
      body: 'Your application to Google has been reviewed',
      timestamp: new Date(Date.now() - 3600000),
      type: 'application',
      delivered: true,
      clicked: false
    },
    {
      id: '3',
      title: 'Interview Reminder',
      body: 'Your interview with Meta is tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 7200000),
      type: 'interview',
      delivered: true,
      clicked: true
    }
  ]);

  const [settings, setSettings] = useState({
    messages: true,
    applications: true,
    interviews: true,
    reminders: false,
    soundEnabled: true,
    vibrateEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  useEffect(() => {
    // Check if push notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      setIsEnabled(Notification.permission === 'granted');
    }

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          setServiceWorkerRegistered(true);
          console.log('Service Worker registered for push notifications');
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser."
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        setIsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You will now receive push notifications."
        });
        
        // Send a welcome notification
        new Notification('InternMatch Notifications', {
          body: 'Push notifications are now enabled!',
          icon: '/placeholder.svg',
          badge: '/placeholder.svg'
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request notification permission."
      });
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      // Handle vibration separately if enabled and supported
      if (settings.vibrateEnabled && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      const notification = new Notification('Test Notification', {
        body: 'This is a test notification from InternMatch!',
        icon: '/placeholder.svg',
        badge: '/placeholder.svg',
        silent: !settings.soundEnabled
      });

      // Add to logs
      const newLog: NotificationLog = {
        id: Date.now().toString(),
        title: 'Test Notification',
        body: 'This is a test notification from InternMatch!',
        timestamp: new Date(),
        type: 'reminder',
        delivered: true,
        clicked: false
      };

      setNotificationLogs(prev => [newLog, ...prev]);

      notification.onclick = () => {
        // Update click status
        setNotificationLogs(prev => prev.map(log => 
          log.id === newLog.id ? { ...log, clicked: true } : log
        ));
        window.focus();
        notification.close();
      };

      toast({
        title: "Test Notification Sent",
        description: "Check your browser notifications!"
      });
    } else {
      toast({
        title: "Permission Required",
        description: "Please enable notifications first."
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return '💬';
      case 'application': return '📄';
      case 'interview': return '🗓️';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-600">Enabled</Badge>;
      case 'denied':
        return <Badge className="bg-red-600">Denied</Badge>;
      default:
        return <Badge variant="outline">Not Set</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Push Notification Status
          </CardTitle>
          <CardDescription>
            Manage browser push notifications for real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Browser Support</span>
              </div>
              {isSupported ? (
                <Badge className="bg-green-600">Supported</Badge>
              ) : (
                <Badge className="bg-red-600">Not Supported</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Permission</span>
              </div>
              {getPermissionBadge()}
            </div>
          </div>

          <div className="flex space-x-2">
            {permission !== 'granted' && (
              <Button onClick={requestPermission} disabled={!isSupported}>
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            )}
            
            {permission === 'granted' && (
              <Button onClick={sendTestNotification} variant="outline">
                <Smartphone className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'messages', label: 'New Messages', icon: '💬' },
            { key: 'applications', label: 'Application Updates', icon: '📄' },
            { key: 'interviews', label: 'Interview Notifications', icon: '🗓️' },
            { key: 'reminders', label: 'General Reminders', icon: '⏰' }
          ].map(({ key, label, icon }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{icon}</span>
                <Label className="font-medium">{label}</Label>
              </div>
              <Switch
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Customize notification behavior and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-gray-600">Play sound when notifications arrive</p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, soundEnabled: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vibration</Label>
              <p className="text-sm text-gray-600">Vibrate device for notifications (mobile)</p>
            </div>
            <Switch
              checked={settings.vibrateEnabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, vibrateEnabled: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Quiet Hours</Label>
              <p className="text-sm text-gray-600">Disable notifications during specific hours</p>
            </div>
            <Switch
              checked={settings.quietHours}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, quietHours: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            View your recent push notification history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notificationLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <span className="text-lg">{getTypeIcon(log.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium truncate">{log.title}</h4>
                    <div className="flex space-x-2">
                      {log.delivered && <Badge variant="outline" className="text-xs">Delivered</Badge>}
                      {log.clicked && <Badge variant="outline" className="text-xs bg-green-50">Clicked</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.body}</p>
                  <p className="text-xs text-gray-400">
                    {log.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushNotificationManager;
