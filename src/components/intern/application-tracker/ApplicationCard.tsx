
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Calendar, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye
} from "lucide-react";

interface Application {
  id: string;
  company: string;
  position: string;
  appliedDate: string;
  status: "applied" | "reviewing" | "interview_scheduled" | "interview_completed" | "final_review" | "offer" | "rejected";
  progress: number;
  nextStep?: string;
  location: string;
  interviewDate?: string;
  documents: {
    resume: boolean;
    coverLetter: boolean;
    transcript: boolean;
    portfolio: boolean;
  };
}

interface ApplicationCardProps {
  app: Application;
  onSendMessage: (appId: string) => void;
  onAddToCalendar: (app: Application) => void;
  onWithdrawApplication: (appId: string) => void;
}

const ApplicationCard = ({ 
  app, 
  onSendMessage, 
  onAddToCalendar, 
  onWithdrawApplication 
}: ApplicationCardProps) => {
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

  return (
    <div className="border rounded-lg p-4">
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
          <Button size="sm" variant="outline" onClick={() => onSendMessage(app.id)}>
            <MessageSquare className="h-3 w-3 mr-1" />
            Message
          </Button>
          {app.interviewDate && (
            <Button size="sm" variant="outline" onClick={() => onAddToCalendar(app)}>
              <Calendar className="h-3 w-3 mr-1" />
              Add to Calendar
            </Button>
          )}
          <Button size="sm" variant="outline">
            View Details
          </Button>
          <Button size="sm" variant="outline" onClick={() => onWithdrawApplication(app.id)}>
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
