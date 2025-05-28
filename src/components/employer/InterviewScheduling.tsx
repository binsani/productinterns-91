
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InterviewScheduling = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      candidateName: "Alex Johnson",
      candidateAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      position: "Product Management Intern",
      date: "2024-01-25",
      time: "10:00 AM",
      type: "Video Call",
      status: "Scheduled",
      interviewer: "Sarah Wilson",
      duration: "45 minutes"
    },
    {
      id: 2,
      candidateName: "Sarah Chen",
      candidateAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      position: "Junior PM Intern",
      date: "2024-01-25",
      time: "2:00 PM",
      type: "In-Person",
      status: "Confirmed",
      interviewer: "Mike Davis",
      duration: "60 minutes"
    },
    {
      id: 3,
      candidateName: "Michael Rodriguez",
      candidateAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      position: "Associate PM Intern",
      date: "2024-01-26",
      time: "11:30 AM",
      type: "Video Call",
      status: "Pending",
      interviewer: "Emily Parker",
      duration: "30 minutes"
    },
  ]);

  const filteredInterviews = interviews.filter(interview =>
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReschedule = (interviewId: number, candidateName: string) => {
    toast({
      title: "Reschedule Interview",
      description: `Rescheduling functionality for ${candidateName} will be available soon.`,
    });
  };

  const handleConfirm = (interviewId: number, candidateName: string) => {
    setInterviews(prev => prev.map(interview => 
      interview.id === interviewId 
        ? { ...interview, status: "Confirmed" }
        : interview
    ));
    toast({
      title: "Interview Confirmed",
      description: `Interview with ${candidateName} has been confirmed.`,
    });
  };

  const handleCancel = (interviewId: number, candidateName: string) => {
    setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
    toast({
      title: "Interview Cancelled",
      description: `Interview with ${candidateName} has been cancelled.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Scheduled": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const todayInterviews = interviews.filter(interview => 
    interview.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      {/* Today's Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today's Interviews
          </CardTitle>
          <CardDescription>
            {todayInterviews.length} interviews scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayInterviews.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No interviews scheduled for today</p>
          ) : (
            <div className="space-y-4">
              {todayInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={interview.candidateAvatar} />
                      <AvatarFallback>{interview.candidateName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{interview.candidateName}</h3>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {interview.time}
                        </span>
                        <span className="flex items-center">
                          {interview.type === "Video Call" ? 
                            <Video className="h-3 w-3 mr-1" /> : 
                            <MapPin className="h-3 w-3 mr-1" />
                          }
                          {interview.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Interviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Interview Schedule</CardTitle>
            <CardDescription>Manage all upcoming interviews</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {filteredInterviews.map((interview) => (
              <div key={interview.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={interview.candidateAvatar} />
                      <AvatarFallback>{interview.candidateName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{interview.candidateName}</h3>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(interview.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {interview.time}
                  </div>
                  <div className="flex items-center">
                    {interview.type === "Video Call" ? 
                      <Video className="h-3 w-3 mr-1" /> : 
                      <MapPin className="h-3 w-3 mr-1" />
                    }
                    {interview.type}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {interview.interviewer}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {interview.status === "Pending" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleConfirm(interview.id, interview.candidateName)}
                    >
                      Confirm
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReschedule(interview.id, interview.candidateName)}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCancel(interview.id, interview.candidateName)}
                  >
                    Cancel
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

export default InterviewScheduling;
