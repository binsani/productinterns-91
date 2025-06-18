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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  UserX,
  Plus
} from "lucide-react";
import UserProfileModal from "./UserProfileModal";
import MessageModal from "./MessageModal";

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

interface NewUser {
  name: string;
  email: string;
  role: "intern" | "employer" | "admin";
  companyName: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "intern",
    companyName: ""
  });

  const [selectedUserForProfile, setSelectedUserForProfile] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<"view" | "edit">("view");
  const [selectedUserForMessage, setSelectedUserForMessage] = useState<User | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
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

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Please fill in name and email");
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      alert("User with this email already exists");
      return;
    }

    setIsAddingUser(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: String(users.length + 1),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "pending",
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: "Just now",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
        verified: false,
        companyName: newUser.role === "employer" ? newUser.companyName : undefined,
        applications: newUser.role === "intern" ? 0 : undefined,
        postings: newUser.role === "employer" ? 0 : undefined
      };

      setUsers(prev => [...prev, user]);
      setNewUser({ name: "", email: "", role: "intern", companyName: "" });
      console.log("New user added:", user);
      alert("User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("Failed to add user. Please try again.");
    } finally {
      setIsAddingUser(false);
    }
  };

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

  const handleViewProfile = (user: User) => {
    setSelectedUserForProfile(user);
    setProfileModalMode("view");
    setIsProfileModalOpen(true);
  };

  const handleSendMessage = (user: User) => {
    setSelectedUserForMessage(user);
    setIsMessageModalOpen(true);
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;
    
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: "suspended" as const } : user
      ));
      console.log("User suspended:", userId);
      alert("User suspended successfully!");
    } catch (error) {
      console.error("Failed to suspend user:", error);
      alert("Failed to suspend user. Please try again.");
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: "active" as const } : user
      ));
      console.log("User reactivated:", userId);
      alert("User reactivated successfully!");
    } catch (error) {
      console.error("Failed to reactivate user:", error);
      alert("Failed to reactivate user. Please try again.");
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: "active" as const, verified: true } : user
      ));
      console.log("User approved:", userId);
      alert("User approved successfully!");
    } catch (error) {
      console.error("Failed to approve user:", error);
      alert("Failed to approve user. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      console.log("User deleted:", userId);
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleSaveProfile = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    console.log("Profile updated:", updatedUser);
    alert("Profile updated successfully!");
  };

  const handleSendMessageAction = (message: { to: string; subject: string; body: string }) => {
    console.log("Message sent:", message);
    // In a real app, this would send the message via API
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their permissions</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add New User</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for the platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: "intern" | "employer" | "admin") => 
                        setNewUser(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="intern">Intern</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.role === "employer" && (
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <Input
                        placeholder="Enter company name"
                        value={newUser.companyName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, companyName: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleAddUser}
                    disabled={isAddingUser}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isAddingUser ? "Adding..." : "Add User"}</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                        <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                          Send Message
                        </DropdownMenuItem>
                        {user.status === "pending" && (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleApproveUser(user.id)}
                          >
                            Approve User
                          </DropdownMenuItem>
                        )}
                        {user.status === "active" && (
                          <DropdownMenuItem 
                            className="text-yellow-600"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        {user.status === "suspended" && (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleReactivateUser(user.id)}
                          >
                            Reactivate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
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

      {/* Profile Modal */}
      <UserProfileModal
        user={selectedUserForProfile}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUserForProfile(null);
        }}
        onSave={handleSaveProfile}
        mode={profileModalMode}
      />

      {/* Message Modal */}
      <MessageModal
        user={selectedUserForMessage}
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setSelectedUserForMessage(null);
        }}
        onSend={handleSendMessageAction}
      />
    </div>
  );
};

export default UserManagement;
