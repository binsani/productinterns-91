import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Lock, 
  Save,
  Camera,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

const AdminProfileSettings = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useAuthStore();
  
  const [profileData, setProfileData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newTickets: true,
    urgentIssues: true,
    systemAlerts: true,
    weeklyReports: true,
    userReports: true,
  });

  const handleProfileSave = async () => {
    try {
      const { error } = await updateProfile(profileData);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSecuritySave = () => {
    // In a real app, this would update security settings in the backend
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleNotificationSave = () => {
    // In a real app, this would update notification settings in the backend
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleAvatarUpload = () => {
    // In a real app, this would handle file upload
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality would be implemented here.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Profile Settings</h2>
          <p className="text-gray-600">Manage your admin account and preferences</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          <Shield className="h-3 w-3 mr-1" />
          Administrator
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar_url} alt={profileData.name} />
                  <AvatarFallback>{profileData.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" onClick={handleAvatarUpload}>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button onClick={handleProfileSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive security alerts via email</p>
                  </div>
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Receive security alerts via SMS</p>
                  </div>
                  <Switch
                    checked={securitySettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="mr-2">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button onClick={handleSecuritySave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Support Tickets</h4>
                    <p className="text-sm text-gray-500">Get notified when new tickets are created</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newTickets}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, newTickets: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Urgent Issues</h4>
                    <p className="text-sm text-gray-500">Get immediate alerts for urgent issues</p>
                  </div>
                  <Switch
                    checked={notificationSettings.urgentIssues}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, urgentIssues: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Alerts</h4>
                    <p className="text-sm text-gray-500">Receive system maintenance and downtime alerts</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-gray-500">Get weekly platform analytics reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">User Reports</h4>
                    <p className="text-sm text-gray-500">Get notified of user-reported content</p>
                  </div>
                  <Switch
                    checked={notificationSettings.userReports}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, userReports: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleNotificationSave}>
                <Bell className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Admin Preferences</CardTitle>
              <CardDescription>Customize your admin dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Dashboard Theme</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="sm">Light</Button>
                    <Button variant="outline" size="sm">Dark</Button>
                    <Button variant="outline" size="sm">Auto</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Default Dashboard View</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">Overview</Button>
                    <Button variant="outline" size="sm">Analytics</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items per Page</h4>
                  <div className="grid grid-cols-4 gap-3">
                    <Button variant="outline" size="sm">10</Button>
                    <Button variant="outline" size="sm">25</Button>
                    <Button variant="outline" size="sm">50</Button>
                    <Button variant="outline" size="sm">100</Button>
                  </div>
                </div>
              </div>

              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfileSettings;