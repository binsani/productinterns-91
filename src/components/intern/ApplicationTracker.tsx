
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Send,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationUpdate {
  id: string;
  message: string;
  timestamp: string;
  type: "status_change" | "message" | "interview" | "document_request";
}

interface Application {
  id: string;
  company: string;
  position: string;
  appliedDate: string;
  status: "applied" | "reviewing" | "interview_scheduled" | "interview_completed" | "final_review" | "offer" | "rejected";
  progress: number;
  nextStep?: string;
  location: string;
  updates: ApplicationUpdate[];
  interviewDate?: string;
  documents: {
    resume: boolean;
    coverLetter: boolean;
    transcript: boolean;
    portfolio: boolean;
  };
}

const ApplicationTracker = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      company: "TechCorp",
      position: "Product Management Intern",
      appliedDate: "2024-01-15",
      status: "interview_scheduled",
      progress: 75,
      nextStep: "Technical interview on Jan 25 at 2:00 PM",
      location: "San Francisco, CA",
      interviewDate: "2024-01-25",
      documents: {
        resume: true,
        coverLetter: true,
        transcript: false,
        portfolio: true
      },
      updates: [
        {
          id: "u1",
          message: "Your application has been reviewed and moved to the interview stage",
          timestamp: "2024-01-20 10:30 AM",
          type: "status_change"
        },
        {
          id: "u2",
          message: "Interview scheduled for January 25th at 2:00 PM PST",
          timestamp: "2024-01-20 11:00 AM",
          type: "interview"
        }
      ]
    },
    {
      id: "2",
      company: "StartupX",
      position: "Junior PM Intern",
      appliedDate: "2024-01-10",
      status: "reviewing",
      progress: 50,
      nextStep: "Waiting for initial review",
      location: "Remote",
      documents: {
        resume: true,
        coverLetter: true,
        transcript: true,
        portfolio: false
      },
      updates: [
        {
          id: "u3",
          message: "Application received and under review",
          timestamp: "2024-01-10 3:45 PM",
          type: "status_change"
        },
        {
          id: "u4",
          message: "Please submit your unofficial transcript",
          timestamp: "2024-01-18 9:00 AM",
          type: "document_request"
        }
      ]
    },
    {
      id: "3",
      company: "BigTech Inc",
      position: "PM Summer Intern",
      appliedDate: "2024-01-08",
      status: "applied",
      progress: 25,
      location: "Seattle, WA",
      documents: {
        resume: true,
        coverLetter: true,
        transcript: false,
        portfolio: false
      },
      updates: [
        {
          id: "u5",
          message: "Application submitted successfully",
          timestamp: "2024-01-08 4:20 PM",
          type: "status_change"
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800";
      case "reviewing": return "bg-yellow-100 text-yellow-800";
      case "interview_scheduled": return "bg-purple-100 text-purple-800";
      case "interview_completed": return "bg-indigo-100 text-indigo-800";
      case "final_review": return "bg-orange-100 text-orange-800";
      case "offer": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied": return <Clock className="h-4 w-4" />;
      case "reviewing": return <Eye className="h-4 w-4" />;
      case "interview_scheduled": 
      case "interview_completed": return <Calendar className="h-4 w-4" />;
      case "final_review": return <AlertCircle className="h-4 w-4" />;
      case "offer": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "status_change": return <Bell className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "interview": return <Calendar className="h-4 w-4" />;
      case "document_request": return <FileText className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleWithdrawApplication = (appId: string) => {
    toast({
      title: "Application Withdrawn",
      description: "Your application has been withdrawn successfully.",
    });
  };

  const handleSendMessage = (appId: string) => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the hiring team.",
    });
  };

  const handleUploadDocument = (appId: string, docType: string) => {
    toast({
      title: "Document Uploaded",
      description: `Your ${docType} has been uploaded successfully.`,
    });
  };

  const stats = {
    total: applications.length,
    reviewing: applications.filter(a => a.status === "reviewing").length,
    interviews: applications.filter(a => a.status.includes("interview")).length,
    offers: applications.filter(a => a.status === "offer").length
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.interviews}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
            <div className="text-sm text-gray-600">Offers</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Status Tracking</CardTitle>
          <CardDescription>Real-time updates on your PM internship applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="updates">Recent Updates</TabsTrigger>
              <TabsTrigger value="calendar">Interview Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{app.position}</h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{app.company}</span>
                        <span>•</span>
                        <span>{app.location}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>

                  {app.nextStep && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                      Next: {app.nextStep}
                    </div>
                  )}

                  {/* Document Status */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Required Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(app.documents).map(([doc, submitted]) => (
                        <Badge 
                          key={doc} 
                          variant={submitted ? "default" : "secondary"}
                          className={submitted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {doc.charAt(0).toUpperCase() + doc.slice(1)}
                          {submitted ? " ✓" : " ✗"}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleSendMessage(app.id)}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleWithdrawApplication(app.id)}>
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="updates" className="space-y-4">
              <div className="space-y-3">
                {applications.flatMap(app => 
                  app.updates.map(update => (
                    <div key={update.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getUpdateIcon(update.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{update.message}</p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>{app.company}</span>
                          <span>•</span>
                          <span>{update.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ).sort((a, b) => new Date(b.key).getTime() - new Date(a.key).getTime())}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="space-y-3">
                {applications
                  .filter(app => app.interviewDate)
                  .map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div>
                          <h3 className="font-medium">{app.position}</h3>
                          <p className="text-sm text-gray-600">{app.company}</p>
                          <p className="text-sm text-gray-500">
                            {app.interviewDate && new Date(app.interviewDate).toLocaleDateString()} 
                            {app.nextStep?.includes('PM') && ` at ${app.nextStep.split('at ')[1]}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Add to Calendar
                        </Button>
                        <Button size="sm">
                          Join Interview
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTracker;
