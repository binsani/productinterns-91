
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  MessageSquare,
  Building2,
  Shield,
  AlertTriangle
} from "lucide-react";

interface ModerationItem {
  id: string;
  type: 'internship' | 'profile' | 'message' | 'company';
  title: string;
  content: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high';
  flags?: string[];
}

interface ContentQueueProps {
  items: ModerationItem[];
  selectedItem: ModerationItem | null;
  onSelectItem: (item: ModerationItem) => void;
}

const ContentQueue = ({ items, selectedItem, onSelectItem }: ContentQueueProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internship': return <FileText className="h-4 w-4" />;
      case 'profile': return <Shield className="h-4 w-4" />;
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Queue</CardTitle>
        <CardDescription>Items awaiting moderation review</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedItem?.id === item.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectItem(item)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(item.type)}
                  <h4 className="font-medium text-sm">{item.title}</h4>
                </div>
                <div className="flex space-x-1">
                  <Badge className={getPriorityColor(item.priority)} variant="outline">
                    {item.priority}
                  </Badge>
                  <Badge className={getStatusColor(item.status)} variant="outline">
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>By {item.submittedBy}</span>
                <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
              </div>
              
              {item.flags && item.flags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.flags.map((flag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {flag.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentQueue;
