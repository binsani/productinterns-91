
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  User,
  Building2,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

const Support = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const tickets = [
    {
      id: "T-001",
      subject: "Cannot upload resume",
      user: "Sarah Johnson",
      userType: "intern",
      priority: "high",
      status: "open",
      category: "technical",
      lastUpdate: "2 hours ago",
      messages: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      id: "T-002",
      subject: "Job posting not appearing in search",
      user: "TechCorp Inc",
      userType: "employer",
      priority: "medium",
      status: "in_progress",
      category: "platform",
      lastUpdate: "4 hours ago",
      messages: 7,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techcorp"
    },
    {
      id: "T-003",
      subject: "Billing question about subscription",
      user: "StartupX",
      userType: "employer",
      priority: "low",
      status: "waiting",
      category: "billing",
      lastUpdate: "1 day ago",
      messages: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=startupx"
    },
    {
      id: "T-004",
      subject: "Account verification issues",
      user: "Alex Chen",
      userType: "intern",
      priority: "high",
      status: "open",
      category: "account",
      lastUpdate: "3 hours ago",
      messages: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    },
    {
      id: "T-005",
      subject: "Feature request: Interview scheduling",
      user: "Maria Garcia",
      userType: "intern",
      priority: "low",
      status: "closed",
      category: "feature",
      lastUpdate: "2 days ago",
      messages: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
    },
  ];

  const stats = [
    { title: "Open Tickets", value: "15", icon: AlertCircle, color: "bg-red-100 text-red-800" },
    { title: "In Progress", value: "8", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    { title: "Resolved Today", value: "12", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { title: "Avg Response Time", value: "2.5h", icon: MessageSquare, color: "bg-blue-100 text-blue-800" },
  ];

  const categories = [
    { name: "Technical", count: 8, color: "bg-red-100 text-red-800" },
    { name: "Platform", count: 5, color: "bg-blue-100 text-blue-800" },
    { name: "Billing", count: 3, color: "bg-green-100 text-green-800" },
    { name: "Account", count: 6, color: "bg-purple-100 text-purple-800" },
    { name: "Feature", count: 2, color: "bg-orange-100 text-orange-800" },
  ];

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
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "waiting":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserIcon = (userType: string) => {
    return userType === "employer" ? Building2 : User;
  };

  const filteredTickets = activeFilter === "all" 
    ? tickets 
    : tickets.filter(ticket => ticket.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Center</h2>
          <p className="text-gray-600">Manage user support tickets and requests</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ticket Categories */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Tickets by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge className={category.color} variant="secondary">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage and respond to user inquiries</CardDescription>
              </div>
              <div className="flex space-x-2">
                {["all", "open", "in_progress", "waiting", "closed"].map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className="capitalize"
                  >
                    {filter.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const UserIcon = getUserIcon(ticket.userType);
                return (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={ticket.avatar} />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">{ticket.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {ticket.category}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{ticket.subject}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">{ticket.user}</span>
                          <Badge variant={ticket.userType === "employer" ? "secondary" : "default"} className="text-xs">
                            {ticket.userType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                          {ticket.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(ticket.status)} mt-1`} variant="secondary">
                          {ticket.status.replace("_", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 mt-1">
                          <MessageSquare className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{ticket.messages}</span>
                          <span className="text-xs text-gray-500">• {ticket.lastUpdate}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Base Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common support resources and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <HelpCircle className="h-6 w-6" />
              <span>Knowledge Base</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Create Ticket</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-6 w-6" />
              <span>Escalate Issue</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
