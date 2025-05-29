
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Lock, 
  Globe,
  Zap,
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Save
} from "lucide-react";

const PlatformSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoModeration, setAutoModeration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [userRegistration, setUserRegistration] = useState(true);
  const [publicJobSearch, setPublicJobSearch] = useState(true);

  const systemStatus = [
    { name: "API Server", status: "operational", uptime: "99.9%", icon: Database },
    { name: "Email Service", status: "operational", uptime: "99.8%", icon: Mail },
    { name: "File Storage", status: "degraded", uptime: "97.2%", icon: FileText },
    { name: "Authentication", status: "operational", uptime: "99.9%", icon: Lock },
    { name: "Payment Gateway", status: "operational", uptime: "99.5%", icon: DollarSign },
  ];

  const securitySettings = [
    { 
      name: "Two-Factor Authentication", 
      description: "Require 2FA for admin accounts",
      enabled: true,
      critical: true
    },
    { 
      name: "Password Policy", 
      description: "Enforce strong password requirements",
      enabled: true,
      critical: true
    },
    { 
      name: "Session Timeout", 
      description: "Auto-logout after 30 minutes of inactivity",
      enabled: true,
      critical: false
    },
    { 
      name: "IP Whitelist", 
      description: "Restrict admin access to specific IP addresses",
      enabled: false,
      critical: false
    },
  ];

  const integrationSettings = [
    { 
      name: "Email Provider", 
      service: "SendGrid",
      status: "connected",
      lastSync: "2 minutes ago"
    },
    { 
      name: "Payment Gateway", 
      service: "Stripe",
      status: "connected",
      lastSync: "5 minutes ago"
    },
    { 
      name: "Analytics", 
      service: "Google Analytics",
      status: "connected",
      lastSync: "1 hour ago"
    },
    { 
      name: "File Storage", 
      service: "AWS S3",
      status: "degraded",
      lastSync: "3 hours ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "down":
        return "bg-red-100 text-red-800";
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "connected":
        return CheckCircle;
      case "degraded":
        return AlertTriangle;
      case "down":
      case "disconnected":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>System Status</span>
          </CardTitle>
          <CardDescription>Monitor the health of platform services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.map((service, index) => {
              const Icon = service.icon;
              const StatusIcon = getStatusIcon(service.status);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-4 w-4 text-green-600" />
                    <Badge className={getStatusColor(service.status)} variant="secondary">
                      {service.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>Platform-wide configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">User Registration</h4>
                  <p className="text-sm text-gray-600">Allow new users to register</p>
                </div>
                <Switch
                  checked={userRegistration}
                  onCheckedChange={setUserRegistration}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Job Search</h4>
                  <p className="text-sm text-gray-600">Allow non-registered users to view jobs</p>
                </div>
                <Switch
                  checked={publicJobSearch}
                  onCheckedChange={setPublicJobSearch}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Send system notifications via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto Moderation</h4>
                  <p className="text-sm text-gray-600">Automatically moderate content</p>
                </div>
                <Switch
                  checked={autoModeration}
                  onCheckedChange={setAutoModeration}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-600">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">Temporarily disable platform access</p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription>Manage platform security and access controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securitySettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{setting.name}</h4>
                      {setting.critical && (
                        <Badge variant="destructive" className="text-xs">Critical</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => {}}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Third-Party Integrations</span>
          </CardTitle>
          <CardDescription>Manage external service connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationSettings.map((integration, index) => {
              const StatusIcon = getStatusIcon(integration.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.service}</p>
                    <p className="text-xs text-gray-500">Last sync: {integration.lastSync}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-4 w-4" />
                    <Badge className={getStatusColor(integration.status)} variant="secondary">
                      {integration.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Database className="h-6 w-6" />
              <span>Backup Database</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Export Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Mail className="h-6 w-6" />
              <span>Send Announcement</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettings;
