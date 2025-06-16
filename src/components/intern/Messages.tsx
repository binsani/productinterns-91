
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Send, Search, Bell, BellOff, Mail, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: number;
  name: string;
  company: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  email: string;
  phone?: string;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Google",
      role: "Hiring Manager",
      lastMessage: "We'd love to schedule an interview with you!",
      time: "2m ago",
      unread: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      online: true,
      email: "sarah.johnson@google.com",
      phone: "+1 (555) 123-4567"
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "Meta",
      role: "Product Manager",
      lastMessage: "Thanks for your application. We're reviewing it now.",
      time: "1h ago",
      unread: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      online: false,
      email: "mike.chen@meta.com"
    },
    {
      id: 3,
      name: "Emily Davis",
      company: "Microsoft",
      role: "Recruiter", 
      lastMessage: "Could you tell us more about your experience with...",
      time: "1d ago",
      unread: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      online: true,
      email: "emily.davis@microsoft.com"
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! Thank you for applying to our Product Management Intern position.",
      time: "10:30 AM",
      isOwn: false,
      timestamp: new Date(Date.now() - 180000),
      read: true
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you for considering my application! I'm very excited about this opportunity.",
      time: "10:45 AM", 
      isOwn: true,
      timestamp: new Date(Date.now() - 120000),
      read: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "We'd love to schedule an interview with you! Are you available this week?",
      time: "2:15 PM",
      isOwn: false,
      timestamp: new Date(Date.now() - 60000),
      read: false
    }
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Request notification permission
  useEffect(() => {
    if (pushNotifications && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            toast({
              title: "Notifications Enabled",
              description: "You'll receive push notifications for new messages."
            });
          }
        });
      }
    }
  }, [pushNotifications]);

  // Simulate receiving new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newMsg: Message = {
          id: messages.length + Math.random(),
          sender: conversations.find(c => c.id === selectedConversation)?.name || "Unknown",
          content: getRandomMessage(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false,
          timestamp: new Date(),
          read: false
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Update conversation unread count
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unread: conv.unread + 1, lastMessage: newMsg.content }
            : conv
        ));

        // Send push notification
        if (pushNotifications && "Notification" in window && Notification.permission === "granted") {
          new Notification(`New message from ${newMsg.sender}`, {
            body: newMsg.content,
            icon: "/placeholder.svg"
          });
        }

        // Send email notification (simulated)
        if (emailNotifications) {
          sendEmailNotification(newMsg);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedConversation, conversations, messages.length, pushNotifications, emailNotifications]);

  const getRandomMessage = () => {
    const messages = [
      "Can you share more details about your PM experience?",
      "What's your availability for next week?",
      "We're impressed with your application!",
      "Would you be interested in a quick call?",
      "Thanks for your quick response!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const sendEmailNotification = (message: Message) => {
    // Simulate email notification
    console.log(`Email notification sent: New message from ${message.sender}`);
    toast({
      title: "Email Sent",
      description: `Notification email sent about new message from ${message.sender}`
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date();
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        timestamp: currentTime,
        read: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // Update conversation
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage, time: "now" }
          : conv
      ));
      
      setNewMessage("");
      
      // Simulate response after delay
      setTimeout(() => {
        const responseMsg: Message = {
          id: messages.length + 2,
          sender: conversations.find(c => c.id === selectedConversation)?.name || "Unknown",
          content: "Thanks for your message! I'll get back to you soon.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false,
          timestamp: new Date(),
          read: false
        };
        setMessages(prev => [...prev, responseMsg]);
      }, 2000);
    }
  };

  const markAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation ? { ...conv, unread: 0 } : conv
    ));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive email alerts for new messages</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-600">Receive browser notifications for new messages</p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    markAsRead();
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{conversation.name}</p>
                        {conversation.unread > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{conversation.company} • {conversation.role}</p>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConv?.avatar} />
                    <AvatarFallback>
                      {selectedConv?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConv?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {selectedConv?.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedConv?.company} • {selectedConv?.role}
                    {selectedConv?.online && (
                      <span className="text-green-600 ml-2">• Online</span>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                {selectedConv?.phone && (
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[400px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex flex-col">
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${
                          message.isOwn ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {message.time}
                        </p>
                        {!message.isOwn && !message.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
