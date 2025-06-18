
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, User, MessageSquare, AlertTriangle, Calendar } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "user" | "security" | "system" | "interview";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "user",
      title: "New User Registration",
      message: "Sarah Chen has registered as an intern",
      timestamp: "5 minutes ago",
      read: false
    },
    {
      id: "2",
      type: "security",
      title: "Security Alert",
      message: "Failed login attempt detected",
      timestamp: "15 minutes ago",
      read: false
    },
    {
      id: "3",
      type: "message",
      title: "New Message",
      message: "You have a new message from TechCorp Inc",
      timestamp: "1 hour ago",
      read: false
    },
    {
      id: "4",
      type: "interview",
      title: "Interview Scheduled",
      message: "Interview scheduled with Alex Johnson",
      timestamp: "2 hours ago",
      read: true
    },
    {
      id: "5",
      type: "system",
      title: "System Update",
      message: "Platform maintenance completed successfully",
      timestamp: "1 day ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case "user": return <User className="h-4 w-4 text-green-600" />;
      case "security": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "interview": return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start space-x-3 p-3 cursor-pointer ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium text-sm ${
                      !notification.read ? "text-gray-900" : "text-gray-700"
                    }`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.timestamp}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 text-center">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
