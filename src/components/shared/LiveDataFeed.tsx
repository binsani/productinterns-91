import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Clock, User, Briefcase, MessageSquare, Bell } from 'lucide-react';

interface LiveEvent {
  id: string;
  type: 'application' | 'internship' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
}

export const LiveDataFeed: React.FC = () => {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const addEvent = (event: LiveEvent) => {
      setEvents(prev => [event, ...prev.slice(0, 19)]); // Keep last 20 events
    };

    // Set up real-time listeners for live feed
    const applicationsChannel = supabase
      .channel('live-feed-applications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'applications'
      }, (payload) => {
        if ((payload.new as any).intern_id === user.id) {
          addEvent({
            id: `app-${Date.now()}`,
            type: 'application',
            title: 'Application Submitted',
            description: 'You submitted a new application',
            timestamp: new Date(),
            icon: <Briefcase className="h-4 w-4" />
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'applications'
      }, (payload) => {
        if ((payload.new as any).intern_id === user.id) {
          const status = (payload.new as any).status;
          addEvent({
            id: `app-update-${Date.now()}`,
            type: 'application',
            title: 'Application Updated',
            description: `Status changed to ${status}`,
            timestamp: new Date(),
            icon: <Briefcase className="h-4 w-4" />
          });
        }
      });

    const internshipsChannel = supabase
      .channel('live-feed-internships')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'internships'
      }, (payload) => {
        const internship = payload.new as any;
        addEvent({
          id: `int-${Date.now()}`,
          type: 'internship',
          title: 'New Opportunity',
          description: `${internship.title} posted`,
          timestamp: new Date(),
          icon: <Briefcase className="h-4 w-4" />
        });
      });

    const messagesChannel = supabase
      .channel('live-feed-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const message = payload.new as any;
        if (message.recipient_id === user.id) {
          addEvent({
            id: `msg-${Date.now()}`,
            type: 'message',
            title: 'New Message',
            description: 'You received a new message',
            timestamp: new Date(),
            icon: <MessageSquare className="h-4 w-4" />
          });
        }
      });

    const notificationsChannel = supabase
      .channel('live-feed-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        const notification = payload.new as any;
        if (notification.user_id === user.id) {
          addEvent({
            id: `notif-${Date.now()}`,
            type: 'notification',
            title: notification.title,
            description: notification.message,
            timestamp: new Date(),
            icon: <Bell className="h-4 w-4" />
          });
        }
      });

    // Subscribe to all channels
    applicationsChannel.subscribe();
    internshipsChannel.subscribe();
    messagesChannel.subscribe();
    notificationsChannel.subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(internshipsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user?.id]);

  const getEventColor = (type: LiveEvent['type']) => {
    switch (type) {
      case 'application': return 'bg-blue-100 text-blue-800';
      case 'internship': return 'bg-green-100 text-green-800';
      case 'message': return 'bg-purple-100 text-purple-800';
      case 'notification': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            Live Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity. Real-time updates will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <Badge variant="secondary" className={`text-xs ${getEventColor(event.type)}`}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};