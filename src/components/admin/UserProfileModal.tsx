
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building2, Users, Calendar } from "lucide-react";

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

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  mode: "view" | "edit";
}

const UserProfileModal = ({ user, isOpen, onClose, onSave, mode }: UserProfileModalProps) => {
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [isEditing, setIsEditing] = useState(mode === "edit");

  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser);
      setIsEditing(false);
      onClose();
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

  if (!user || !editedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{isEditing ? "Edit User Profile" : "User Profile"}</span>
            {user.verified && <CheckCircle className="h-5 w-5 text-green-500" />}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update user information and settings" : "View user details and activity"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getRoleColor(user.role)}>
                  {user.role === "intern" && <Users className="h-3 w-3 mr-1" />}
                  {user.role === "employer" && <Building2 className="h-3 w-3 mr-1" />}
                  {user.role === "admin" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {user.role}
                </Badge>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div>Last active: {user.lastActive}</div>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editedUser.name}
                onChange={(e) => setEditedUser(prev => prev ? {...prev, name: e.target.value} : null)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select 
                value={editedUser.role} 
                onValueChange={(value: "intern" | "employer" | "admin") => 
                  setEditedUser(prev => prev ? {...prev, role: value} : null)
                }
                disabled={!isEditing}
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
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editedUser.status} 
                onValueChange={(value: "active" | "suspended" | "pending") => 
                  setEditedUser(prev => prev ? {...prev, status: value} : null)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editedUser.companyName && (
              <div className="col-span-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={editedUser.companyName}
                  onChange={(e) => setEditedUser(prev => prev ? {...prev, companyName: e.target.value} : null)}
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {user.applications || user.postings || 0}
              </div>
              <div className="text-sm text-gray-600">
                {user.role === "intern" ? "Applications" : "Job Postings"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {user.verified ? "Verified" : "Unverified"}
              </div>
              <div className="text-sm text-gray-600">Account Status</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
