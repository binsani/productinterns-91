import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AddToCalendarModal from "./AddToCalendarModal";
import ApplicationStats from "./application-tracker/ApplicationStats";
import ApplicationCard from "./application-tracker/ApplicationCard";
import UpdatesList from "./application-tracker/UpdatesList";
import InterviewCalendar from "./application-tracker/InterviewCalendar";

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
  const [showAddToCalendar, setShowAddToCalendar] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    company: string;
    date: string;
    time: string;
    type: string;
    location?: string;
  } | null>(null);

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

  const handleAddToCalendar = (app: Application) => {
    if (app.interviewDate) {
      setSelectedEvent({
        title: `${app.position} Interview`,
        company: app.company,
        date: app.interviewDate,
        time: app.nextStep?.includes('at') ? app.nextStep.split('at ')[1] || '2:00 PM' : '2:00 PM',
        type: 'Interview',
        location: app.location
      });
      setShowAddToCalendar(true);
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

  const stats = {
    total: applications.length,
    reviewing: applications.filter(a => a.status === "reviewing").length,
    interviews: applications.filter(a => a.status.includes("interview")).length,
    offers: applications.filter(a => a.status === "offer").length
  };

  return (
    <>
      <div className="space-y-6">
        <ApplicationStats stats={stats} />

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
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onSendMessage={handleSendMessage}
                    onAddToCalendar={handleAddToCalendar}
                    onWithdrawApplication={handleWithdrawApplication}
                  />
                ))}
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                <UpdatesList applications={applications} />
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <InterviewCalendar applications={applications} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <AddToCalendarModal
        isOpen={showAddToCalendar}
        onClose={() => {
          setShowAddToCalendar(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </>
  );
};

export default ApplicationTracker;
