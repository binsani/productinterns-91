
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye
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

interface ContentReviewProps {
  selectedItem: ModerationItem | null;
  reviewNote: string;
  setReviewNote: (note: string) => void;
  onApprove: (itemId: string) => void;
  onReject: (itemId: string) => void;
  onFlag: (itemId: string) => void;
}

const ContentReview = ({
  selectedItem,
  reviewNote,
  setReviewNote,
  onApprove,
  onReject,
  onFlag
}: ContentReviewProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Review</CardTitle>
        <CardDescription>
          {selectedItem ? "Review and moderate selected content" : "Select an item to review"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedItem ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selectedItem.title}</h3>
              <div className="flex space-x-2">
                <Badge className={getPriorityColor(selectedItem.priority)} variant="outline">
                  {selectedItem.priority} priority
                </Badge>
                <Badge className={getStatusColor(selectedItem.status)} variant="outline">
                  {selectedItem.status}
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">{selectedItem.content}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Submitted by:</span>
                <p>{selectedItem.submittedBy}</p>
              </div>
              <div>
                <span className="font-medium">Submitted at:</span>
                <p>{new Date(selectedItem.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Content type:</span>
                <p className="capitalize">{selectedItem.type}</p>
              </div>
              <div>
                <span className="font-medium">Current status:</span>
                <p className="capitalize">{selectedItem.status}</p>
              </div>
            </div>

            {selectedItem.flags && selectedItem.flags.length > 0 && (
              <div>
                <span className="font-medium text-sm">Flags:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedItem.flags.map((flag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {flag.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Review Notes</label>
              <Textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Add notes about your review decision..."
                rows={3}
              />
            </div>

            {selectedItem.status === 'pending' || selectedItem.status === 'flagged' ? (
              <div className="flex space-x-2">
                <Button 
                  onClick={() => onApprove(selectedItem.id)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => onReject(selectedItem.id)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                {selectedItem.status !== 'flagged' && (
                  <Button 
                    variant="outline"
                    onClick={() => onFlag(selectedItem.id)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">
                  This content has been {selectedItem.status}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Content Selected</h3>
            <p className="text-gray-600">Select an item from the queue to review and moderate</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentReview;
