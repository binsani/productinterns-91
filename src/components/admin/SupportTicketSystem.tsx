
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Calendar,
  Send,
  Paperclip
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  submittedBy: {
    name: string;
    email: string;
    avatar?: string;
    role: 'intern' | 'employer';
  };
  assignedTo?: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
    isStaff: boolean;
  };
  timestamp: string;
  attachments?: string[];
}

const SupportTicketSystem = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "1",
      title: "Unable to upload resume",
      description: "I'm getting an error when trying to upload my resume. The file is a PDF and under 5MB.",
      category: "technical",
      priority: "high",
      status: "open",
      submittedBy: {
        name: "John Smith",
        email: "john.smith@university.edu",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        role: "intern"
      },
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-20T10:30:00Z",
      messages: [
        {
          id: "m1",
          content: "I'm getting an error when trying to upload my resume. The file is a PDF and under 5MB. Can you help?",
          sender: {
            name: "John Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
            isStaff: false
          },
          timestamp: "2024-01-20T10:30:00Z"
        }
      ]
    },
    {
      id: "2",
      title: "Billing inquiry - Premium features",
      description: "I was charged for premium features but can't access them. Please help.",
      category: "billing",
      priority: "medium",
      status: "in_progress",
      submittedBy: {
        name: "Sarah Johnson",
        email: "sarah.johnson@techcorp.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        role: "employer"
      },
      assignedTo: {
        name: "Support Team",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support"
      },
      createdAt: "2024-01-19T14:20:00Z",
      updatedAt: "2024-01-20T09:15:00Z",
      messages: [
        {
          id: "m2",
          content: "I was charged for premium features but can't access them. Please help.",
          sender: {
            name: "Sarah Johnson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
            isStaff: false
          },
          timestamp: "2024-01-19T14:20:00Z"
        },
        {
          id: "m3",
          content: "Hi Sarah, I'm looking into your billing issue. Can you please provide your transaction ID?",
          sender: {
            name: "Support Team",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
            isStaff: true
          },
          timestamp: "2024-01-20T09:15:00Z"
        }
      ]
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusUpdate = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket
    ));
    
    toast({
      title: "Status Updated",
      description: `Ticket status has been updated to ${newStatus.replace('_', ' ')}.`
    });
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;

    const message: TicketMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        name: "Support Team",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=support",
        isStaff: true
      },
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { 
            ...ticket, 
            messages: [...ticket.messages, message],
            updatedAt: new Date().toISOString(),
            status: ticket.status === 'open' ? 'in_progress' : ticket.status
          }
        : ticket
    ));

    setNewMessage("");
    toast({
      title: "Message Sent",
      description: "Your response has been sent to the user."
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tickets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
            <div className="text-sm text-gray-600">Open Tickets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Manage customer support requests</CardDescription>
            
            {/* Filters */}
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{ticket.title}</h4>
                    <div className="flex space-x-1">
                      <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)} variant="outline">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={ticket.submittedBy.avatar} />
                        <AvatarFallback>{ticket.submittedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{ticket.submittedBy.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {ticket.submittedBy.role}
                      </Badge>
                    </div>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTicket ? "Ticket Details" : "Select a Ticket"}
            </CardTitle>
            {selectedTicket && (
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority} priority
                </Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-4">
                {/* Ticket Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedTicket.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedTicket.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Category: {selectedTicket.category.replace('_', ' ')}</span>
                    <span>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'in_progress' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(selectedTicket.id, 'in_progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'resolved' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(selectedTicket.id, 'resolved')}
                  >
                    Resolved
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'closed' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(selectedTicket.id, 'closed')}
                  >
                    Close
                  </Button>
                </div>

                {/* Messages */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender.isStaff ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender.isStaff 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{message.sender.name}</span>
                          <span className={`text-xs ${message.sender.isStaff ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium">Reply to ticket</Label>
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach File
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Ticket Selected</h3>
                <p className="text-gray-600">Select a ticket from the list to view details and respond</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportTicketSystem;
