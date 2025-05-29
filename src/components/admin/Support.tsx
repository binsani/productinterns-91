import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MoreHorizontal,
  Search,
  FileText,
  Download,
  ArrowUp,
  Book,
  Plus,
  Edit
} from "lucide-react";

const Support = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newKnowledgeBase, setNewKnowledgeBase] = useState({ title: "", content: "" });
  const [isAddingKB, setIsAddingKB] = useState(false);

  const supportTickets = [
    {
      id: "1",
      user: "Sarah Johnson",
      email: "sarah@email.com",
      subject: "Unable to upload resume",
      status: "open",
      priority: "high",
      createdAt: "2 hours ago",
      category: "technical",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      id: "2",
      user: "TechCorp Inc",
      email: "hr@techcorp.com",
      subject: "Job posting not appearing",
      status: "pending",
      priority: "medium",
      createdAt: "4 hours ago",
      category: "billing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techcorp"
    },
    {
      id: "3",
      user: "Alex Chen",
      email: "alex@email.com",
      subject: "Account verification issues",
      status: "resolved",
      priority: "low",
      createdAt: "1 day ago",
      category: "account",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    }
  ];

  const knowledgeBaseArticles = [
    {
      id: "1",
      title: "How to reset password",
      category: "account",
      views: 1234,
      lastUpdated: "2 days ago"
    },
    {
      id: "2",
      title: "Job posting guidelines",
      category: "employers",
      views: 856,
      lastUpdated: "1 week ago"
    },
    {
      id: "3",
      title: "Resume upload troubleshooting",
      category: "technical",
      views: 743,
      lastUpdated: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        totalTickets: supportTickets.length,
        openTickets: supportTickets.filter(t => t.status === "open").length,
        resolvedTickets: supportTickets.filter(t => t.status === "resolved").length,
        avgResponseTime: "2.5 hours",
        satisfactionRate: "94%",
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `support-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log("Support report generated");
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleEscalateTicket = async (ticketId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Escalating ticket ${ticketId} to senior support`);
      alert(`Ticket ${ticketId} has been escalated to senior support team`);
    } catch (error) {
      console.error("Failed to escalate ticket:", error);
      alert("Failed to escalate ticket. Please try again.");
    }
  };

  const handleAddKnowledgeBase = async () => {
    if (!newKnowledgeBase.title.trim() || !newKnowledgeBase.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsAddingKB(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Adding new knowledge base article:", newKnowledgeBase);
      alert("Knowledge base article added successfully!");
      setNewKnowledgeBase({ title: "", content: "" });
    } catch (error) {
      console.error("Failed to add knowledge base article:", error);
      alert("Failed to add article. Please try again.");
    } finally {
      setIsAddingKB(false);
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || ticket.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Center</h2>
          <p className="text-gray-600">Manage support tickets and help resources</p>
        </div>
        <Button 
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>{isGeneratingReport ? "Generating..." : "Generate Report"}</span>
        </Button>
      </div>

      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-yellow-100">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">2.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage and respond to user support requests</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={ticket.avatar} />
                      <AvatarFallback>{ticket.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600">{ticket.user} • {ticket.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(ticket.status)} variant="secondary">
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                          {ticket.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{ticket.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEscalateTicket(ticket.id)}
                      className="flex items-center space-x-1"
                    >
                      <ArrowUp className="h-3 w-3" />
                      <span>Escalate</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Close Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-5 w-5" />
                <span>Knowledge Base</span>
              </CardTitle>
              <CardDescription>Manage help articles and documentation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add New Article */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add New Article</span>
              </h4>
              <div className="space-y-3">
                <Input
                  placeholder="Article title..."
                  value={newKnowledgeBase.title}
                  onChange={(e) => setNewKnowledgeBase(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Article content..."
                  value={newKnowledgeBase.content}
                  onChange={(e) => setNewKnowledgeBase(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
                <Button 
                  onClick={handleAddKnowledgeBase}
                  disabled={isAddingKB}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isAddingKB ? "Adding..." : "Add Article"}</span>
                </Button>
              </div>
            </div>

            {/* Existing Articles */}
            <div className="space-y-3">
              <h4 className="font-medium">Existing Articles</h4>
              {knowledgeBaseArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium">{article.title}</h5>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="outline">{article.category}</Badge>
                      <span>•</span>
                      <span>{article.views} views</span>
                      <span>•</span>
                      <span>Updated {article.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem>View Article</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
