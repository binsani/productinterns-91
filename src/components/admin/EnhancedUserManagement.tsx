
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Ban, 
  CheckCircle, 
  Mail, 
  Eye,
  Trash2,
  Shield,
  Building2,
  GraduationCap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'intern' | 'employer' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  avatar?: string;
  company?: string;
  university?: string;
  applications?: number;
  postings?: number;
}

const EnhancedUserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@university.edu",
      role: "intern",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      university: "Stanford University",
      applications: 5
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      role: "employer",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-20",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      company: "TechCorp Solutions",
      postings: 3
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@startup.com",
      role: "employer",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-19",
      company: "StartupX Inc",
      postings: 0
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@college.edu",
      role: "intern",
      status: "suspended",
      joinDate: "2024-01-05",
      lastActive: "2024-01-12",
      university: "MIT",
      applications: 2
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'activate':
            return { ...user, status: 'active' as const };
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'delete':
            return user; // Handle deletion separately
          default:
            return user;
        }
      }
      return user;
    }));

    const actionMessages = {
      activate: "User has been activated",
      suspend: "User has been suspended",
      delete: "User has been deleted"
    };

    toast({
      title: "Action Completed",
      description: actionMessages[action as keyof typeof actionMessages]
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'intern': return <GraduationCap className="h-4 w-4" />;
      case 'employer': return <Building2 className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <div className="text-sm text-gray-600">Suspended</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="intern">Interns</option>
              <option value="employer">Employers</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage platform users and their access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                      <span>Last active: {new Date(user.lastActive).toLocaleDateString()}</span>
                      {user.company && <span>Company: {user.company}</span>}
                      {user.university && <span>University: {user.university}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.applications !== undefined && (
                    <Badge variant="secondary">{user.applications} apps</Badge>
                  )}
                  {user.postings !== undefined && (
                    <Badge variant="secondary">{user.postings} posts</Badge>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => console.log('View profile', user.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('Send message', user.id)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      {user.status === 'suspended' ? (
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'activate')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserManagement;
