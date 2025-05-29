
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Users, 
  Building2, 
  FileText, 
  TrendingUp, 
  Settings, 
  AlertTriangle,
  BarChart3,
  Database,
  Lock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import UserManagement from "@/components/admin/UserManagement";
import Analytics from "@/components/admin/Analytics";
import ContentModeration from "@/components/admin/ContentModeration";
import Support from "@/components/admin/Support";
import PlatformSettings from "@/components/admin/PlatformSettings";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  const navigationItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "users", label: "User Management", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "content", label: "Content Moderation", icon: FileText },
    { id: "billing", label: "Subscriptions", icon: DollarSign },
    { id: "support", label: "Support", icon: MessageSquare },
    { id: "security", label: "Security", icon: Lock },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-4 border-white/20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <p className="text-purple-100">Monitor and manage the Product Interns platform</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+23% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>Latest platform registrations and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", type: "intern", action: "Registered", time: "2 minutes ago" },
                { name: "TechCorp Inc", type: "employer", action: "Posted Job", time: "15 minutes ago" },
                { name: "Alex Chen", type: "intern", action: "Applied", time: "1 hour ago" },
                { name: "StartupX", type: "employer", action: "Scheduled Interview", time: "2 hours ago" },
                { name: "Maria Garcia", type: "intern", action: "Completed Assessment", time: "3 hours ago" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.name}`} />
                    <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.name}</span> {activity.action}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={activity.type === "intern" ? "default" : "secondary"} className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Moderation Queue</CardTitle>
            <CardDescription>Items requiring review and approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Job Posting", company: "NewTech Solutions", status: "pending", priority: "high" },
                { type: "User Profile", user: "John Smith", status: "flagged", priority: "medium" },
                { type: "Company Profile", company: "Innovation Labs", status: "pending", priority: "low" },
                { type: "Job Posting", company: "Growth Corp", status: "review", priority: "medium" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-gray-600">{item.company || item.user}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health & Alerts</CardTitle>
          <CardDescription>Monitor platform performance and security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Server Status</span>
              </div>
              <p className="text-sm text-gray-600">All systems operational</p>
              <p className="text-xs text-gray-500">99.9% uptime</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Database</span>
              </div>
              <p className="text-sm text-gray-600">Performance monitoring</p>
              <p className="text-xs text-gray-500">Response time: 120ms</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Security</span>
              </div>
              <p className="text-sm text-gray-600">No threats detected</p>
              <p className="text-xs text-gray-500">Last scan: 1 hour ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
          <CardDescription>Manage registered users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,892</div>
              <div className="text-sm text-gray-600">Active Interns</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600">Active Employers</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">799</div>
              <div className="text-sm text-gray-600">Total Registrations This Month</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Recent User Registrations</h3>
            {[
              { name: "Emily Davis", email: "emily@email.com", role: "intern", status: "active", joined: "2 hours ago" },
              { name: "TechStart Inc", email: "hr@techstart.com", role: "employer", status: "pending", joined: "5 hours ago" },
              { name: "Michael Brown", email: "michael@email.com", role: "intern", status: "active", joined: "1 day ago" },
              { name: "Innovation Corp", email: "jobs@innovation.com", role: "employer", status: "active", joined: "2 days ago" },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.role === "intern" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === "active" ? "outline" : "secondary"}>
                    {user.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{user.joined}</span>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "users":
        return <UserManagement />;
      case "analytics":
        return <Analytics />;
      case "content":
        return <ContentModeration />;
      case "support":
        return <Support />;
      case "settings":
        return <PlatformSettings />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{navigationItems.find(item => item.id === activeTab)?.label}</CardTitle>
              <CardDescription>This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Content for {activeTab} will be available soon.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <DashboardLayout
      title="Administrator Dashboard"
      navigationItems={navigationItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
