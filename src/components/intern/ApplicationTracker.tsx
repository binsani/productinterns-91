
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, Calendar, Eye, MessageSquare, Clock, CheckCircle } from "lucide-react";

interface Application {
  id: string;
  company: string;
  position: string;
  appliedDate: string;
  status: "applied" | "reviewing" | "interview" | "offer" | "rejected";
  progress: number;
  nextStep?: string;
  location: string;
}

const ApplicationTracker = () => {
  const applications: Application[] = [
    {
      id: "1",
      company: "TechCorp",
      position: "Product Management Intern",
      appliedDate: "2024-01-15",
      status: "interview",
      progress: 75,
      nextStep: "Final interview on Jan 25",
      location: "San Francisco, CA"
    },
    {
      id: "2",
      company: "StartupX",
      position: "Junior PM Intern",
      appliedDate: "2024-01-10",
      status: "reviewing",
      progress: 50,
      nextStep: "Waiting for review",
      location: "Remote"
    },
    {
      id: "3",
      company: "BigTech Inc",
      position: "PM Summer Intern",
      appliedDate: "2024-01-08",
      status: "applied",
      progress: 25,
      location: "Seattle, WA"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800";
      case "reviewing": return "bg-yellow-100 text-yellow-800";
      case "interview": return "bg-purple-100 text-purple-800";
      case "offer": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied": return <Clock className="h-4 w-4" />;
      case "reviewing": return <Eye className="h-4 w-4" />;
      case "interview": return <Calendar className="h-4 w-4" />;
      case "offer": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">1</div>
            <div className="text-sm text-gray-600">Offers</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your internship applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                      <span className="capitalize">{app.status}</span>
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

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTracker;
