
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Settings, Bell, BellOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'application' | 'interview' | 'message' | 'reminder';
}

interface NotificationPreference {
  type: string;
  email: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

const EmailNotificationService = () => {
  const [emailAddress, setEmailAddress] = useState("john.doe@example.com");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreference[]>([
    { type: 'New Application', email: true, push: true, frequency: 'immediate' },
    { type: 'Interview Scheduled', email: true, push: true, frequency: 'immediate' },
    { type: 'New Message', email: true, push: true, frequency: 'immediate' },
    { type: 'Application Update', email: true, push: false, frequency: 'daily' },
    { type: 'Weekly Summary', email: true, push: false, frequency: 'weekly' }
  ]);

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Application Confirmation',
      subject: 'Application Received - {{company}} {{position}}',
      body: 'Thank you for applying to {{position}} at {{company}}. We have received your application and will review it shortly.',
      type: 'application'
    },
    {
      id: '2', 
      name: 'Interview Invitation',
      subject: 'Interview Invitation - {{company}} {{position}}',
      body: 'We would like to invite you for an interview for the {{position}} role at {{company}}. Please confirm your availability.',
      type: 'interview'
    },
    {
      id: '3',
      name: 'New Message Alert',
      subject: 'New Message from {{sender}}',
      body: 'You have received a new message from {{sender}} at {{company}}. Please check your InternMatch dashboard.',
      type: 'message'
    }
  ]);

  const [emailStats] = useState({
    sent: 127,
    delivered: 124,
    opened: 89,
    clicked: 34
  });

  useEffect(() => {
    // Simulate email verification check
    const checkEmailVerification = () => {
      // In real app, this would check with backend
      setIsEmailVerified(Math.random() > 0.5);
    };
    
    checkEmailVerification();
  }, []);

  const sendVerificationEmail = () => {
    // Simulate sending verification email
    toast({
      title: "Verification Email Sent",
      description: `A verification email has been sent to ${emailAddress}`
    });
    
    // Simulate verification after 3 seconds
    setTimeout(() => {
      setIsEmailVerified(true);
      toast({
        title: "Email Verified",
        description: "Your email address has been successfully verified!"
      });
    }, 3000);
  };

  const updateNotificationPreference = (index: number, field: keyof NotificationPreference, value: any) => {
    setNotifications(prev => prev.map((notif, i) => 
      i === index ? { ...notif, [field]: value } : notif
    ));
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved."
    });
  };

  const sendTestEmail = (template: EmailTemplate) => {
    toast({
      title: "Test Email Sent",
      description: `Test email sent using "${template.name}" template`
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Configure your email settings for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center space-x-2">
                {isEmailVerified ? (
                  <Badge className="bg-green-600">Verified</Badge>
                ) : (
                  <>
                    <Badge variant="outline">Unverified</Badge>
                    <Button onClick={sendVerificationEmail} size="sm">
                      Verify
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Email Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{emailStats.sent}</div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{emailStats.delivered}</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{emailStats.opened}</div>
              <div className="text-sm text-gray-600">Opened</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{emailStats.clicked}</div>
              <div className="text-sm text-gray-600">Clicked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive different types of notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notif, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="font-medium">{notif.type}</Label>
                  <p className="text-sm text-gray-600">
                    Frequency: {notif.frequency}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Switch
                      checked={notif.email}
                      onCheckedChange={(checked) => 
                        updateNotificationPreference(index, 'email', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    {notif.push ? (
                      <Bell className="h-4 w-4 text-gray-500" />
                    ) : (
                      <BellOff className="h-4 w-4 text-gray-500" />
                    )}
                    <Switch
                      checked={notif.push}
                      onCheckedChange={(checked) => 
                        updateNotificationPreference(index, 'push', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Preview and test email templates used for notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="outline">{template.type}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <Label className="text-xs text-gray-600">Subject:</Label>
                    <p className="text-gray-800">{template.subject}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Body:</Label>
                    <p className="text-gray-600">{template.body}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => sendTestEmail(template)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailNotificationService;
