
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Database, 
  Download, 
  Upload, 
  Bell, 
  Shield, 
  Server, 
  Users, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

const PlatformSettings = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

  const handleDatabaseBackup = async () => {
    setIsBackingUp(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log("Database backup initiated");
      alert("Database backup completed successfully!");
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Backup failed. Please try again.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      // Simulate user export
      await new Promise(resolve => setTimeout(resolve, 2000));
      const userData = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "intern" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "employer" },
        { id: 3, name: "Admin User", email: "admin@example.com", role: "admin" }
      ];
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log("Users exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportUsers = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const userData = JSON.parse(text);
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Importing users:", userData);
      alert(`Successfully imported ${userData.length} users!`);
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed. Please check the file format.");
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) {
      alert("Please enter an announcement message");
      return;
    }

    setIsSendingAnnouncement(true);
    try {
      // Simulate sending announcement
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Sending announcement:", announcement);
      alert("Announcement sent successfully to all users!");
      setAnnouncement("");
    } catch (error) {
      console.error("Failed to send announcement:", error);
      alert("Failed to send announcement. Please try again.");
    } finally {
      setIsSendingAnnouncement(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <p className="text-gray-600">Manage system configuration and platform settings</p>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>System Health</span>
          </CardTitle>
          <CardDescription>Monitor platform performance and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Server Status</p>
                <p className="text-sm text-gray-600">Online - 99.9% uptime</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-gray-600">Healthy - 120ms avg response</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">API Status</p>
                <p className="text-sm text-gray-600">Minor delays - 350ms avg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Management</span>
          </CardTitle>
          <CardDescription>Backup and restore database operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Database Backup</h4>
                <p className="text-sm text-gray-600">Create a complete backup of the platform database</p>
              </div>
              <Button 
                onClick={handleDatabaseBackup}
                disabled={isBackingUp}
                className="flex items-center space-x-2"
              >
                <Database className="h-4 w-4" />
                <span>{isBackingUp ? "Backing up..." : "Backup Now"}</span>
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Last backup: Yesterday at 3:00 AM</p>
              <p>Backup size: 2.4 GB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Data Management</span>
          </CardTitle>
          <CardDescription>Import and export user data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Export Users</h4>
                <p className="text-sm text-gray-600">Download user data as JSON file</p>
              </div>
              <Button 
                onClick={handleExportUsers}
                disabled={isExporting}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? "Exporting..." : "Export"}</span>
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Import Users</h4>
                <p className="text-sm text-gray-600">Upload user data from JSON file</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportUsers}
                  disabled={isImporting}
                  className="hidden"
                  id="user-import"
                />
                <Button 
                  onClick={() => document.getElementById('user-import')?.click()}
                  disabled={isImporting}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isImporting ? "Importing..." : "Import"}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Send Announcement</span>
          </CardTitle>
          <CardDescription>Send platform-wide announcements to all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your announcement message..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={4}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                This will be sent to all registered users ({2847} recipients)
              </p>
              <Button 
                onClick={handleSendAnnouncement}
                disabled={isSendingAnnouncement || !announcement.trim()}
                className="flex items-center space-x-2"
              >
                <Bell className="h-4 w-4" />
                <span>{isSendingAnnouncement ? "Sending..." : "Send Announcement"}</span>
              </Button>
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
          <CardDescription>Configure platform security and access controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Session Timeout</h4>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
              <Badge variant="outline">30 minutes</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Password Policy</h4>
                <p className="text-sm text-gray-600">Minimum security requirements</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Strong</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettings;
