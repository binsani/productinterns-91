
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Shield, 
  Mail,
  Phone,
  MapPin,
  Upload,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

const EmployerProfileSettings = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useAuthStore();
  const [profileState, setProfileState] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: profile?.avatar_url || "",
    companyRole: "HR Manager"
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    applicationAlerts: true,
    interviewReminders: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    dataAnalytics: true
  });

  const handleProfileSave = () => {
    updateProfile({ 
      name: profileState.name, 
      email: profileState.email, 
      avatar_url: profileState.avatar 
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileState.name}`;
      setProfileState(prev => ({ ...prev, avatar: mockUrl }));
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    }
  };

  const handleNotificationsSave = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handlePrivacySave = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileState.avatar} />
              <AvatarFallback>{profileState.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{profileState.name}</h3>
              <p className="text-sm text-gray-600">{profileState.email}</p>
              <p className="text-sm text-gray-500">{profileState.companyRole}</p>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileState.name}
                onChange={(e) => setProfileState(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileState.email}
                onChange={(e) => setProfileState(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileState.phone}
                onChange={(e) => setProfileState(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyRole">Role in Company</Label>
              <Input
                id="companyRole"
                value={profileState.companyRole}
                onChange={(e) => setProfileState(prev => ({ ...prev, companyRole: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileState.location}
                onChange={(e) => setProfileState(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleProfileSave}>
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
            { key: 'applicationAlerts', label: 'Application Alerts', description: 'Get notified when candidates apply' },
            { key: 'interviewReminders', label: 'Interview Reminders', description: 'Reminders for upcoming interviews' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features' },
            { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of activity' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="font-medium">{label}</Label>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <Switch
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}

          <Button onClick={handleNotificationsSave}>
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control your privacy and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'profileVisible', label: 'Profile Visibility', description: 'Make your profile visible to candidates' },
            { key: 'showEmail', label: 'Show Email', description: 'Display email address on public profile' },
            { key: 'showPhone', label: 'Show Phone', description: 'Display phone number on public profile' },
            { key: 'dataAnalytics', label: 'Data Analytics', description: 'Allow usage data for improving the platform' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="font-medium">{label}</Label>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <Switch
                checked={privacy[key as keyof typeof privacy]}
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({ ...prev, [key]: checked }))
                }
              />
            </div>
          ))}

          <Button onClick={handlePrivacySave}>
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
            
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
              <User className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerProfileSettings;
