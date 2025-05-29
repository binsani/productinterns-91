
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search } from "lucide-react";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Google",
      role: "Hiring Manager",
      lastMessage: "We'd love to schedule an interview with you!",
      time: "2m ago",
      unread: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "Meta",
      role: "Product Manager",
      lastMessage: "Thanks for your application. We're reviewing it now.",
      time: "1h ago",
      unread: 0,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
    },
    {
      id: 3,
      name: "Emily Davis",
      company: "Microsoft",
      role: "Recruiter", 
      lastMessage: "Could you tell us more about your experience with...",
      time: "1d ago",
      unread: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! Thank you for applying to our Product Management Intern position.",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you for considering my application! I'm very excited about this opportunity.",
      time: "10:45 AM", 
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "We'd love to schedule an interview with you! Are you available this week?",
      time: "2:15 PM",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message sending logic here
      setNewMessage("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
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
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.avatar} />
              <AvatarFallback>
                {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {conversations.find(c => c.id === selectedConversation)?.name}
              </CardTitle>
              <CardDescription>
                {conversations.find(c => c.id === selectedConversation)?.company} • 
                {conversations.find(c => c.id === selectedConversation)?.role}
              </CardDescription>
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
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
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
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
