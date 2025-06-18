
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  MessageSquare,
  FileText,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModerationItem {
  id: string;
  type: 'internship' | 'profile' | 'message' | 'company';
  title: string;
  content: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high';
  flags?: string[];
}

const ContentModeration = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const [items, setItems] = useState<ModerationItem[]>([
    {
      id: "1",
      type: "internship",
      title: "Product Management Intern - Summer 2024",
      content: "Looking for a passionate PM intern to join our growing team. Must have strong analytical skills...",
      submittedBy: "TechCorp Solutions",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      priority: "medium",
      flags: ["salary_range_missing"]
    },
    {
      id: "2",
      type: "profile",
      title: "John Smith - Intern Profile",
      content: "Computer Science student at Stanford University. Passionate about product management...",
      submittedBy: "John Smith",
      submittedAt: "2024-01-15T09:15:00Z",
      status: "flagged",
      priority: "high",
      flags: ["inappropriate_content", "fake_experience"]
    },
    {
      id: "3",
      type: "company",
      title: "Innovation Labs Company Profile",
      content: "We are a cutting-edge technology company focused on AI and machine learning solutions...",
      submittedBy: "Innovation Labs",
      submittedAt: "2024-01-14T16:45:00Z",
      status: "pending",
      priority: "low"
    },
    {
      id: "4",
      type: "message",
      title: "Interview Follow-up Message",
      content: "Thank you for the interview opportunity. I wanted to follow up on the next steps...",
      submittedBy: "Sarah Johnson",
      submittedAt: "2024-01-14T14:20:00Z",
      status: "approved",
      priority: "low"
    }
  ]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesType = filterType === "all" || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'approved' as const } : item
    ));
    toast({
      title: "Content Approved",
      description: "The content has been approved and published.",
    });
    setSelectedItem(null);
    setReviewNote("");
  };

  const handleReject = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'rejected' as const } : item
    ));
    toast({
      title: "Content Rejected",
      description: "The content has been rejected and will not be published.",
      variant: "destructive"
    });
    setSelectedItem(null);
    setReviewNote("");
  };

  const handleFlag = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'flagged' as const, priority: 'high' as const } : item
    ));
    toast({
      title: "Content Flagged",
      description: "The content has been flagged for further review.",
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internship': return <FileText className="h-4 w-4" />;
      case 'profile': return <Shield className="h-4 w-4" />;
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const pendingCount = items.filter(item => item.status === 'pending').length;
  const flaggedCount = items.filter(item => item.status === 'flagged').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Moderation</h2>
          <p className="text-gray-600">
            Review and moderate user-generated content ({pendingCount} pending, {flaggedCount} flagged)
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {pendingCount} Pending Review
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {flaggedCount} Flagged
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
                  placeholder="Search content..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="internship">Internships</option>
              <option value="profile">Profiles</option>
              <option value="company">Companies</option>
              <option value="message">Messages</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Queue</CardTitle>
            <CardDescription>Items awaiting moderation review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedItem?.id === item.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <h4 className="font-medium text-sm">{item.title}</h4>
                    </div>
                    <div className="flex space-x-1">
                      <Badge className={getPriorityColor(item.priority)} variant="outline">
                        {item.priority}
                      </Badge>
                      <Badge className={getStatusColor(item.status)} variant="outline">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By {item.submittedBy}</span>
                    <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {item.flags && item.flags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {flag.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Content Review</CardTitle>
            <CardDescription>
              {selectedItem ? "Review and moderate selected content" : "Select an item to review"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{selectedItem.title}</h3>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(selectedItem.priority)} variant="outline">
                      {selectedItem.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(selectedItem.status)} variant="outline">
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedItem.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Submitted by:</span>
                    <p>{selectedItem.submittedBy}</p>
                  </div>
                  <div>
                    <span className="font-medium">Submitted at:</span>
                    <p>{new Date(selectedItem.submittedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Content type:</span>
                    <p className="capitalize">{selectedItem.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Current status:</span>
                    <p className="capitalize">{selectedItem.status}</p>
                  </div>
                </div>

                {selectedItem.flags && selectedItem.flags.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Flags:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedItem.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {flag.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Notes</label>
                  <Textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Add notes about your review decision..."
                    rows={3}
                  />
                </div>

                {selectedItem.status === 'pending' || selectedItem.status === 'flagged' ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleApprove(selectedItem.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleReject(selectedItem.id)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    {selectedItem.status !== 'flagged' && (
                      <Button 
                        variant="outline"
                        onClick={() => handleFlag(selectedItem.id)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Flag
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">
                      This content has been {selectedItem.status}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Content Selected</h3>
                <p className="text-gray-600">Select an item from the queue to review and moderate</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentModeration;
