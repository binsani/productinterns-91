import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  application_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender_name: string;
}

interface MessagingSystemProps {
  applicationId: string;
  recipientId: string;
  recipientName: string;
}

export const MessagingSystem = ({ applicationId, recipientId, recipientName }: MessagingSystemProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `application_id=eq.${applicationId}`
        }, 
        (payload) => {
          const newMsg = payload.new as any;
          setMessages(prev => [...prev, {
            ...newMsg,
            sender_name: newMsg.sender_id === profile?.id ? profile.name : recipientName
          }]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [applicationId, profile?.id, recipientName]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name)
        `)
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data.map(msg => ({
        ...msg,
        sender_name: msg.sender?.name || 'Unknown'
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: profile.id,
          recipient_id: recipientId,
          application_id: applicationId,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been delivered"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Messages with {recipientName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] space-y-1 ${message.sender_id === profile?.id ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {message.sender_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {message.sender_name}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender_id === profile?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};