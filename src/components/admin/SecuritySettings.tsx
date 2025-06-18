
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  Eye, 
  Ban, 
  RefreshCw,
  Users,
  Globe,
  Key,
  Activity
} from "lucide-react";

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [suspiciousActivityAlerts, setSuspiciousActivityAlerts] = useState(true);
  const [passwordResetEmails, setPasswordResetEmails] = useState(true);

  const securityEvents = [
    {
      id: 1,
      type: "login_attempt",
      description: "Failed login attempt from unknown IP",
      ip: "192.168.1.100",
      location: "San Francisco, CA",
      timestamp: "2 minutes ago",
      severity: "high"
    },
    {
      id: 2,
      type: "password_change",
      description: "Admin password changed successfully",
      user: "admin@company.com",
      timestamp: "1 hour ago",
      severity: "medium"
    },
    {
      id: 3,
      type: "user_suspension",
      description: "User account suspended for policy violation",
      user: "suspicious@email.com",
      timestamp: "3 hours ago",
      severity: "medium"
    },
    {
      id: 4,
      type: "mass_login",
      description: "Unusual login pattern detected",
      ip: "203.45.67.89",
      location: "Unknown",
      timestamp: "6 hours ago",
      severity: "high"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login_attempt": return <Lock className="h-4 w-4" />;
      case "password_change": return <Key className="h-4 w-4" />;
      case "user_suspension": return <Ban className="h-4 w-4" />;
      case "mass_login": return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <div className="text-sm text-gray-600">Overall Status</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-gray-600">Active Threats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">247</div>
            <div className="text-sm text-gray-600">Monitored Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Ban className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Blocked IPs</div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>Configure platform security and monitoring settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Authentication</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              <div>
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue="30"
                  min="5"
                  max="480"
                />
              </div>

              <div>
                <Label htmlFor="password-policy">Password Policy</Label>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Minimum 8 characters</div>
                  <div>• Must include uppercase, lowercase, numbers</div>
                  <div>• Password expires every 90 days</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Notifications</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login-notifications">Login Notifications</Label>
                  <p className="text-sm text-gray-600">Email alerts for admin logins</p>
                </div>
                <Switch
                  id="login-notifications"
                  checked={loginNotifications}
                  onCheckedChange={setLoginNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="suspicious-activity">Suspicious Activity Alerts</Label>
                  <p className="text-sm text-gray-600">Detect unusual patterns</p>
                </div>
                <Switch
                  id="suspicious-activity"
                  checked={suspiciousActivityAlerts}
                  onCheckedChange={setSuspiciousActivityAlerts}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="password-reset">Password Reset Emails</Label>
                  <p className="text-sm text-gray-600">Send notifications for password changes</p>
                </div>
                <Switch
                  id="password-reset"
                  checked={passwordResetEmails}
                  onCheckedChange={setPasswordResetEmails}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t">
            <Button>Save Security Settings</Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Security Events</span>
          </CardTitle>
          <CardDescription>Monitor suspicious activities and security incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {event.ip && (
                        <span className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span>{event.ip}</span>
                        </span>
                      )}
                      {event.location && <span>• {event.location}</span>}
                      {event.user && (
                        <span className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{event.user}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <span className="text-sm text-gray-500">{event.timestamp}</span>
                  <Button size="sm" variant="outline">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IP Blocking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ban className="h-5 w-5" />
            <span>IP Address Management</span>
          </CardTitle>
          <CardDescription>Block or allow specific IP addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input placeholder="Enter IP address to block (e.g., 192.168.1.1)" className="flex-1" />
              <Button>Block IP</Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Currently Blocked IPs</h4>
              {[
                "192.168.1.100 - Suspicious login attempts",
                "203.45.67.89 - Bot activity detected",
                "10.0.0.25 - Policy violation"
              ].map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                  <span className="text-sm">{ip}</span>
                  <Button size="sm" variant="outline">Unblock</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
