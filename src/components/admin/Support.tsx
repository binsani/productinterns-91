
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Building2,
  Send,
  Paperclip
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string;
  subject: string;
  content: string;
  userType: 'intern' | 'employer';
  userName: string;
  userEmail: string;
  userAvatar: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  category: 'technical' | 'account' | 'billing' | 'general';
  createdAt: string;
  lastActivity: string;
  assignedTo?: string;
  responses: Array<{
    id: string;
    content: string;
    author: string;
    authorType: 'user' | 'admin';
    timestamp: string;
  }>;
}

const Support = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TKT-001",
      subject: "Unable to upload resume",
      content: "I'm having trouble uploading my resume. The page keeps showing an error message when I try to upload a PDF file.",
      userType: "intern",
      userName: "Sarah Johnson",
      userEmail: "sarah.johnson@email.com",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      priority: "medium",
      status: "open",
      category: "technical",
      createdAt: "2024-01-15T10:30:00Z",
      lastActivity: "2024-01-15T10:30:00Z",
      responses: []
    },
    {
      id: "TKT-002",
      subject: "Billing inquiry about premium subscription",
      content: "I was charged twice for my premium subscription this month. Can you please help me resolve this billing issue?",
      userType: "employer",
      userName: "TechCorp Solutions",
      userEmail: "billing@techcorp.com",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp",
      priority: "high",
      status: "pending",
      category: "billing",
      createdAt: "2024-01-14T16:45:00Z",
      lastActivity: "2024-01-15T09:20:00Z",
      assignedTo: "Admin Team",
      responses: [
        {
          id: "R1",
          content: "Thank you for reaching out. I'm looking into your billing history now and will get back to you within 24 hours.",
          author: "Admin Team",
          authorType: "admin",
          timestamp: "2024-01-15T09:20:00Z"
        }
      ]
    },
    {
      id: "TKT-003",
      subject: "How to schedule interviews?",
      content: "I'm new to the platform and need help understanding how to schedule interviews with candidates. Is there a guide available?",
      userType: "employer",
      userName: "Innovation Labs",
      userEmail: "hr@innovationlabs.com",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Innovation",
      priority: "low",
      status: "resolved",
      category: "general",
      createdAt: "2024-01-13T14:20:00Z",
      lastActivity: "2024-01-14T11:15:00Z",
      responses: [
        {
          id: "R2",
          content: "Hi! You can schedule interviews by going to the candidate's profile and clicking the 'Schedule Interview' button. I'll also send you our quick start guide.",
          author: "Support Team",
          authorType: "admin",
          timestamp: "2024-01-13T15:45:00Z"
        },
        {
          id: "R3",
          content: "Perfect! Thank you for the quick response and the guide. Everything is clear now.",
          author: "Innovation Labs",
          authorType: "user",
          timestamp: "2024-01-14T11:15:00Z"
        }
      ]
    }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendReply = () => {
    if (!replyContent.trim() || !selectedTicket) return;

    const newResponse = {
      id: `R${Date.now()}`,
      content: replyContent.trim(),
      author: "Support Team",
      authorType: "admin" as const,
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id
        ? {
            ...ticket,
            responses: [...ticket.responses, newResponse],
            lastActivity: new Date().toISOString(),
            status: 'pending' as const
          }
        : ticket
    ));

    if (selectedTicket) {
      setSelectedTicket({
        ...selectedTicket,
        responses: [...selectedTicket.responses, newResponse],
        lastActivity: new Date().toISOString(),
        status: 'pending'
      });
    }

    setReplyContent("");
    toast({
      title: "Reply Sent",
      description: "Your response has been sent to the user.",
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId
        ? { ...ticket, status: newStatus, lastActivity: new Date().toISOString() }
        : ticket
    ));

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }

    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Support Center</h2>
          <p className="text-gray-600">
            Manage user support tickets and inquiries
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {openTickets} Open
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {pendingTickets} Pending
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {urgentTickets} Urgent
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>All support requests and inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={ticket.userAvatar} />
                        <AvatarFallback>{ticket.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{ticket.subject}</h4>
                        <p className="text-xs text-gray-600">{ticket.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)} variant="outline">
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {ticket.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      {ticket.userType === 'intern' ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                      <span>{ticket.userName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(ticket.lastActivity).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              {selectedTicket ? `Ticket ${selectedTicket.id}` : "Select a ticket to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-4">
                {/* Ticket Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedTicket.userAvatar} />
                      <AvatarFallback>{selectedTicket.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedTicket.userName}</h3>
                      <p className="text-sm text-gray-600">{selectedTicket.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(selectedTicket.priority)} variant="outline">
                      {selectedTicket.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTicket.status)} variant="outline">
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedTicket.id, 'pending')}
                    disabled={selectedTicket.status === 'pending'}
                  >
                    Mark Pending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                    disabled={selectedTicket.status === 'resolved'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                    disabled={selectedTicket.status === 'closed'}
                  >
                    Close
                  </Button>
                </div>

                {/* Original Message */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{selectedTicket.subject}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{selectedTicket.content}</p>
                </div>

                {/* Conversation */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedTicket.responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-3 rounded-lg ${
                        response.authorType === 'admin' 
                          ? 'bg-blue-50 ml-4' 
                          : 'bg-gray-50 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{response.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{response.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'closed' && (
                  <div className="space-y-3">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your response..."
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach File
                      </Button>
                      <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                )}
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

export default Support;
