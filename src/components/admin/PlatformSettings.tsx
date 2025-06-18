
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Server,
  Zap,
  AlertTriangle,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PlatformSettings = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Product Interns",
    tagline: "Connecting talented interns with innovative companies",
    supportEmail: "support@productinterns.com",
    maintenanceMode: false,
    registrationEnabled: true,
    maxInternshipsPerCompany: 10
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUser: "noreply@productinterns.com",
    emailVerificationRequired: true,
    welcomeEmailEnabled: true,
    notificationEmailsEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireStrongPasswords: true,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    twoFactorRequired: false,
    allowedDomains: ""
  });

  const [systemSettings, setSystemSettings] = useState({
    maxFileUploadSize: 10,
    allowedFileTypes: "pdf,doc,docx,jpg,png",
    backupFrequency: "daily",
    logRetentionDays: 30,
    cacheEnabled: true
  });

  const handleSaveGeneral = () => {
    toast({
      title: "General Settings Saved",
      description: "Platform settings have been updated successfully.",
    });
  };

  const handleSaveEmail = () => {
    toast({
      title: "Email Settings Saved",
      description: "Email configuration has been updated successfully.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Settings Saved",
      description: "Security policies have been updated successfully.",
    });
  };

  const handleSaveSystem = () => {
    toast({
      title: "System Settings Saved",
      description: "System configuration has been updated successfully.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "Manual backup process has been initiated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure basic platform settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={generalSettings.platformName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, platformName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tagline">Platform Tagline</Label>
              <Input
                id="tagline"
                value={generalSettings.tagline}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, tagline: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxInternships">Max Internships per Company</Label>
              <Input
                id="maxInternships"
                type="number"
                value={generalSettings.maxInternshipsPerCompany}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, maxInternshipsPerCompany: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Enable to temporarily disable user access</p>
              </div>
              <Switch
                checked={generalSettings.maintenanceMode}
                onCheckedChange={(checked) => 
                  setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">User Registration</Label>
                <p className="text-sm text-gray-600">Allow new users to register</p>
              </div>
              <Switch
                checked={generalSettings.registrationEnabled}
                onCheckedChange={(checked) => 
                  setGeneralSettings(prev => ({ ...prev, registrationEnabled: checked }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveGeneral}>
            <Save className="h-4 w-4 mr-2" />
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Configure email server and notification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={emailSettings.smtpUser}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Email Verification Required</Label>
                <p className="text-sm text-gray-600">Require users to verify their email address</p>
              </div>
              <Switch
                checked={emailSettings.emailVerificationRequired}
                onCheckedChange={(checked) => 
                  setEmailSettings(prev => ({ ...prev, emailVerificationRequired: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Welcome Emails</Label>
                <p className="text-sm text-gray-600">Send welcome email to new users</p>
              </div>
              <Switch
                checked={emailSettings.welcomeEmailEnabled}
                onCheckedChange={(checked) => 
                  setEmailSettings(prev => ({ ...prev, welcomeEmailEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Notification Emails</Label>
                <p className="text-sm text-gray-600">Send notification emails to users</p>
              </div>
              <Switch
                checked={emailSettings.notificationEmailsEnabled}
                onCheckedChange={(checked) => 
                  setEmailSettings(prev => ({ ...prev, notificationEmailsEnabled: checked }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveEmail}>
            <Save className="h-4 w-4 mr-2" />
            Save Email Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security policies and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedDomains">Allowed Email Domains (comma-separated)</Label>
            <Textarea
              id="allowedDomains"
              value={securitySettings.allowedDomains}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, allowedDomains: e.target.value }))}
              placeholder="example.com, company.com"
              rows={2}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Require Strong Passwords</Label>
                <p className="text-sm text-gray-600">Enforce password complexity requirements</p>
              </div>
              <Switch
                checked={securitySettings.requireStrongPasswords}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, requireStrongPasswords: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Two-Factor Authentication Required</Label>
                <p className="text-sm text-gray-600">Require 2FA for all users</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorRequired}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({ ...prev, twoFactorRequired: checked }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveSecurity}>
            <Save className="h-4 w-4 mr-2" />
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="h-5 w-5 mr-2" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure system performance and maintenance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={systemSettings.maxFileUploadSize}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileUploadSize: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logRetention">Log Retention (days)</Label>
              <Input
                id="logRetention"
                type="number"
                value={systemSettings.logRetentionDays}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, logRetentionDays: parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={systemSettings.allowedFileTypes}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                placeholder="pdf,doc,docx,jpg,png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <select
                id="backupFrequency"
                value={systemSettings.backupFrequency}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Cache Enabled</Label>
              <p className="text-sm text-gray-600">Enable system caching for better performance</p>
            </div>
            <Switch
              checked={systemSettings.cacheEnabled}
              onCheckedChange={(checked) => 
                setSystemSettings(prev => ({ ...prev, cacheEnabled: checked }))
              }
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSaveSystem}>
              <Save className="h-4 w-4 mr-2" />
              Save System Settings
            </Button>
            <Button variant="outline" onClick={handleClearCache}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button variant="outline" onClick={handleBackupNow}>
              <Database className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Database</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
              </div>
              <p className="text-sm text-gray-600">Connection: Active</p>
              <p className="text-sm text-gray-600">Response time: 12ms</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Storage</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Warning</Badge>
              </div>
              <p className="text-sm text-gray-600">Used: 78GB / 100GB</p>
              <p className="text-sm text-gray-600">22GB remaining</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Email Service</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">Queue: 3 pending</p>
              <p className="text-sm text-gray-600">Last sent: 2 min ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettings;
