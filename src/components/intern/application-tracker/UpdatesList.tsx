
import { Bell, MessageSquare, Calendar, FileText } from "lucide-react";

interface ApplicationUpdate {
  id: string;
  message: string;
  timestamp: string;
  type: "status_change" | "message" | "interview" | "document_request";
}

interface Application {
  id: string;
  company: string;
  updates: ApplicationUpdate[];
}

interface UpdatesListProps {
  applications: Application[];
}

const UpdatesList = ({ applications }: UpdatesListProps) => {
  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "status_change": return <Bell className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "interview": return <Calendar className="h-4 w-4" />;
      case "document_request": return <FileText className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const allUpdates = applications.flatMap(app => 
    app.updates.map(update => ({
      ...update,
      company: app.company
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-3">
      {allUpdates.map(update => (
        <div key={update.id} className="flex items-start space-x-3 p-3 border rounded-lg">
          <div className="flex-shrink-0 mt-1">
            {getUpdateIcon(update.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm">{update.message}</p>
            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
              <span>{update.company}</span>
              <span>•</span>
              <span>{update.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdatesList;
