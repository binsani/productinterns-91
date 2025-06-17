
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter,
  Calendar,
  Paperclip,
  Star,
  Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  candidateName: string;
  candidateAvatar: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  position: string;
}

const Messages = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      candidateName: "Alex Johnson",
      candidateAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      subject: "Thank you for the interview opportunity",
      preview: "I wanted to thank you for considering me for the Product Management Intern position...",
      timestamp: "2 hours ago",
      unread: true,
      starred: false,
      position: "Product Management Intern"
    },
    {
      id: 2,
      candidateName: "Sarah Chen",
      candidateAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      subject: "Question about the internship program",
      preview: "I have a few questions about the structure of your PM internship program...",
      timestamp: "1 day ago",
      unread: false,
      starred: true,
      position: "Junior PM Intern"
    },
    {
      id: 3,
      candidateName: "Michael Rodriguez",
      candidateAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      subject: "Follow-up on application status",
      preview: "I submitted my application last week and wanted to follow up on the status...",
      timestamp: "3 days ago",
      unread: false,
      starred: false,
      position: "Associate PM Intern"
    }
  ]);

  const filteredMessages = messages.filter(message =>
    message.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    toast({
      title: "Message Sent",
      description: `Your reply to ${selectedMessage?.candidateName} has been sent.`,
    });

    setReplyText("");
  };

  const toggleStar = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const markAsRead = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, unread: false } : msg
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Messages List */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
            </CardTitle>
            <CardDescription>
              {messages.filter(m => m.unread).length} unread messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  } ${message.unread ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    markAsRead(message.id);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.candidateAvatar} />
                        <AvatarFallback>{message.candidateName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm truncate ${message.unread ? 'font-semibold' : ''}`}>
                          {message.candidateName}
                        </p>
                        <p className="text-xs text-gray-500">{message.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                        className={`p-1 rounded ${message.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                        <Star className="h-3 w-3" fill={message.starred ? 'currentColor' : 'none'} />
                      </button>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                    </div>
                  </div>
                  <h4 className={`text-sm mb-1 ${message.unread ? 'font-semibold' : ''}`}>
                    {message.subject}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{message.preview}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedMessage.candidateAvatar} />
                    <AvatarFallback>{selectedMessage.candidateName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedMessage.candidateName}</h3>
                    <p className="text-sm text-gray-600">{selectedMessage.position}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{selectedMessage.subject}</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    Dear Hiring Manager,
                    <br /><br />
                    {selectedMessage.preview} I am very excited about the opportunity to contribute to your team and learn from experienced product managers. 
                    <br /><br />
                    I have been following your company's product development and am particularly impressed by your recent product launches. I believe my background in data analysis and user research would be valuable for this role.
                    <br /><br />
                    I would be happy to discuss my qualifications further at your convenience. Please let me know if you need any additional information.
                    <br /><br />
                    Best regards,<br />
                    {selectedMessage.candidateName}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-500">
                    <span>Sent {selectedMessage.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-3 w-3" />
                      <span>Resume.pdf</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Reply</Label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button onClick={handleSendReply}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent>
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select a message</h3>
                <p>Choose a message from the list to view and reply</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Messages;
