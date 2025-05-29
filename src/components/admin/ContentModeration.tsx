
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Flag, 
  AlertTriangle, 
  Shield,
  FileText,
  User,
  Building2,
  Clock
} from "lucide-react";

const ContentModeration = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const moderationQueue = [
    {
      id: 1,
      type: "job_posting",
      title: "Senior Product Manager Position",
      company: "TechStart Inc",
      reporter: "Anonymous",
      reason: "Misleading job requirements",
      status: "pending",
      priority: "high",
      reportedAt: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techstart"
    },
    {
      id: 2,
      type: "user_profile",
      title: "John Smith's Profile",
      company: null,
      reporter: "Sarah Johnson",
      reason: "Inappropriate profile content",
      status: "review",
      priority: "medium",
      reportedAt: "4 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johnsmith"
    },
    {
      id: 3,
      type: "company_profile",
      title: "Innovation Labs Company Page",
      company: "Innovation Labs",
      reporter: "System Detection",
      reason: "Potential spam content",
      status: "pending",
      priority: "low",
      reportedAt: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=innovation"
    },
    {
      id: 4,
      type: "job_posting",
      title: "Marketing Intern Role",
      company: "Growth Corp",
      reporter: "Multiple Users",
      reason: "Discriminatory language",
      status: "flagged",
      priority: "high",
      reportedAt: "6 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=growth"
    },
  ];

  const stats = [
    { title: "Pending Reviews", value: "23", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    { title: "Approved Today", value: "45", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { title: "Rejected Today", value: "12", icon: XCircle, color: "bg-red-100 text-red-800" },
    { title: "Auto-Flagged", value: "8", icon: Flag, color: "bg-orange-100 text-orange-800" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job_posting":
        return FileText;
      case "user_profile":
        return User;
      case "company_profile":
        return Building2;
      default:
        return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredQueue = activeFilter === "all" 
    ? moderationQueue 
    : moderationQueue.filter(item => item.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Moderation</h2>
          <p className="text-gray-600">Review and manage reported content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-600">Auto-moderation: Active</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {["all", "pending", "review", "flagged"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
            className="capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Moderation Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
          <CardDescription>Review reported content and take appropriate actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQueue.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback>
                        <TypeIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Reported by: {item.reporter}
                      </p>
                      <p className="text-sm text-red-600">{item.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <Badge className={getPriorityColor(item.priority)} variant="secondary">
                        {item.priority}
                      </Badge>
                      <Badge className={`${getStatusColor(item.status)} mt-1`} variant="secondary">
                        {item.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{item.reportedAt}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600">
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Moderation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Moderation Rules</CardTitle>
          <CardDescription>Configure automatic content filtering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Spam Detection</h4>
                <p className="text-sm text-gray-600">Automatically flag potential spam content</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Inappropriate Language</h4>
                <p className="text-sm text-gray-600">Filter posts with inappropriate language</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Duplicate Content</h4>
                <p className="text-sm text-gray-600">Detect and flag duplicate job postings</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModeration;
