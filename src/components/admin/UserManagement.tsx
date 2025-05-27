
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  Search, 
  MoreHorizontal, 
  Shield, 
  Ban, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Building2,
  UserCheck,
  UserX
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "intern" | "employer" | "admin";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  lastActive: string;
  avatar: string;
  verified: boolean;
  companyName?: string;
  applications?: number;
  postings?: number;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@email.com",
      role: "intern",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      verified: true,
      applications: 5
    },
    {
      id: "2",
      name: "TechCorp Inc",
      email: "hr@techcorp.com",
      role: "employer",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techcorp",
      verified: true,
      companyName: "TechCorp Inc",
      postings: 8
    },
    {
      id: "3",
      name: "Sarah Chen",
      email: "sarah@email.com",
      role: "intern",
      status: "pending",
      joinDate: "2024-01-20",
      lastActive: "5 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      verified: false,
      applications: 2
    },
    {
      id: "4",
      name: "StartupX",
      email: "jobs@startupx.com",
      role: "employer",
      status: "suspended",
      joinDate: "2024-01-08",
      lastActive: "1 week ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=startupx",
      verified: false,
      companyName: "StartupX",
      postings: 3
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "intern": return "bg-blue-100 text-blue-800";
      case "employer": return "bg-green-100 text-green-800";
      case "admin": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "intern": return <Users className="h-3 w-3" />;
      case "employer": return <Building2 className="h-3 w-3" />;
      case "admin": return <Shield className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    pending: users.filter(u => u.status === "pending").length,
    suspended: users.filter(u => u.status === "suspended").length,
    interns: users.filter(u => u.role === "intern").length,
    employers: users.filter(u => u.role === "employer").length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-gray-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserX className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <div className="text-sm text-gray-600">Suspended</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.interns}</div>
            <div className="text-sm text-gray-600">Interns</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.employers}</div>
            <div className="text-sm text-gray-600">Employers</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage platform users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="intern">Interns</SelectItem>
                <SelectItem value="employer">Employers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(user.role)}>
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        {user.companyName && (
                          <Badge variant="outline">{user.companyName}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-gray-600">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        Active {user.lastActive}
                      </div>
                      {user.applications !== undefined && (
                        <div className="text-blue-600">
                          {user.applications} applications
                        </div>
                      )}
                      {user.postings !== undefined && (
                        <div className="text-green-600">
                          {user.postings} job postings
                        </div>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        {user.status === "pending" && (
                          <DropdownMenuItem className="text-green-600">
                            Approve User
                          </DropdownMenuItem>
                        )}
                        {user.status === "active" && (
                          <DropdownMenuItem className="text-yellow-600">
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        {user.status === "suspended" && (
                          <DropdownMenuItem className="text-green-600">
                            Reactivate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
