
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Users,
  FileText,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Interview {
  id: string;
  company: string;
  position: string;
  type: "phone" | "video" | "in_person" | "panel";
  date: string;
  time: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewers: string[];
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  preparation: {
    materials: string[];
    tips: string[];
  };
}

const InterviewScheduling = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: "1",
      company: "TechCorp",
      position: "Product Management Intern",
      type: "video",
      date: "2024-01-25",
      time: "2:00 PM",
      duration: 60,
      meetingLink: "https://zoom.us/j/123456789",
      interviewers: ["Sarah Johnson - Senior PM", "Mike Chen - Engineering Manager"],
      status: "confirmed",
      preparation: {
        materials: ["Resume", "Portfolio", "Case Study Prep"],
        tips: [
          "Review the company's latest product releases",
          "Prepare STAR method examples",
          "Research the interviewer's background on LinkedIn",
          "Practice product sense questions"
        ]
      }
    },
    {
      id: "2",
      company: "StartupX",
      position: "Junior PM Intern",
      type: "phone",
      date: "2024-01-28",
      time: "10:00 AM",
      duration: 30,
      interviewers: ["Alex Rodriguez - Head of Product"],
      status: "scheduled",
      preparation: {
        materials: ["Resume", "Questions list"],
        tips: [
          "Understand the startup's business model",
          "Prepare questions about the PM internship program",
          "Review common behavioral questions",
          "Have examples of problem-solving ready"
        ]
      }
    },
    {
      id: "3",
      company: "BigTech Inc",
      position: "PM Summer Intern",
      type: "panel",
      date: "2024-02-02",
      time: "11:00 AM",
      duration: 90,
      location: "Seattle Office - Building A, Floor 12",
      interviewers: [
        "Jennifer Kim - Principal PM",
        "David Smith - Senior PM",
        "Lisa Chen - PM Manager"
      ],
      status: "scheduled",
      preparation: {
        materials: ["Resume", "Portfolio", "ID", "Transcript"],
        tips: [
          "Prepare for technical PM questions",
          "Practice whiteboarding product design",
          "Review BigTech's product ecosystem",
          "Prepare thoughtful questions for each interviewer"
        ]
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "phone": return <Clock className="h-4 w-4" />;
      case "in_person": return <MapPin className="h-4 w-4" />;
      case "panel": return <Users className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const handleConfirmInterview = (interviewId: string) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === interviewId 
          ? { ...interview, status: "confirmed" as const }
          : interview
      )
    );
    toast({
      title: "Interview Confirmed",
      description: "Your interview has been confirmed. You'll receive a calendar invite shortly.",
    });
  };

  const handleReschedule = (interviewId: string) => {
    toast({
      title: "Reschedule Request",
      description: "Your reschedule request has been sent to the hiring team.",
    });
  };

  const handleJoinInterview = (interview: Interview) => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, '_blank');
    }
    toast({
      title: "Joining Interview",
      description: `Opening ${interview.type} interview link.`,
    });
  };

  const upcomingInterviews = interviews.filter(interview => 
    new Date(interview.date) >= new Date() && interview.status !== "cancelled"
  );

  const todayInterviews = interviews.filter(interview => 
    interview.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Scheduling</CardTitle>
          <CardDescription>Manage your PM internship interviews and prepare for success</CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{upcomingInterviews.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {interviews.filter(i => i.status === "confirmed").length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{todayInterviews.length}</div>
            <div className="text-sm text-gray-600">Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {interviews.filter(i => i.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="preparation">Preparation</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingInterviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming interviews scheduled</p>
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{interview.position}</h3>
                        <p className="text-gray-600">{interview.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(interview.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {interview.time} ({interview.duration} min)
                          </span>
                          <span className="flex items-center">
                            {getTypeIcon(interview.type)}
                            <span className="ml-1 capitalize">{interview.type.replace('_', ' ')}</span>
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(interview.status)}>
                        <span className="capitalize">{interview.status}</span>
                      </Badge>
                    </div>

                    {interview.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {interview.location}
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Interviewers:</h4>
                      <div className="flex flex-wrap gap-2">
                        {interview.interviewers.map((interviewer, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interviewer}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex space-x-2">
                        {interview.status === "scheduled" && (
                          <Button size="sm" onClick={() => handleConfirmInterview(interview.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirm
                          </Button>
                        )}
                        {interview.meetingLink && (
                          <Button size="sm" variant="outline" onClick={() => handleJoinInterview(interview)}>
                            <Video className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleReschedule(interview.id)}>
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message HR
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-3">
                    {selectedDate ? `Interviews on ${selectedDate.toLocaleDateString()}` : 'Select a date'}
                  </h3>
                  <div className="space-y-2">
                    {selectedDate && interviews
                      .filter(interview => interview.date === selectedDate.toISOString().split('T')[0])
                      .map(interview => (
                        <div key={interview.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{interview.position}</p>
                              <p className="text-sm text-gray-600">{interview.company}</p>
                              <p className="text-sm text-gray-500">{interview.time}</p>
                            </div>
                            <Badge className={getStatusColor(interview.status)}>
                              {interview.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {selectedDate && interviews.filter(interview => 
                      interview.date === selectedDate.toISOString().split('T')[0]
                    ).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No interviews scheduled for this date</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preparation" className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{interview.position} - {interview.company}</CardTitle>
                    <CardDescription>
                      {new Date(interview.date).toLocaleDateString()} at {interview.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Required Materials
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {interview.preparation.materials.map((material, index) => (
                          <Badge key={index} variant="outline">{material}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Preparation Tips
                      </h4>
                      <ul className="space-y-1">
                        {interview.preparation.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewScheduling;
