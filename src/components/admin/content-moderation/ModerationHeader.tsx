
import { Badge } from "@/components/ui/badge";

interface ModerationHeaderProps {
  pendingCount: number;
  flaggedCount: number;
}

const ModerationHeader = ({ pendingCount, flaggedCount }: ModerationHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Content Moderation</h2>
        <p className="text-gray-600">
          Review and moderate user-generated content ({pendingCount} pending, {flaggedCount} flagged)
        </p>
      </div>
      <div className="flex space-x-2">
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          {pendingCount} Pending Review
        </Badge>
        <Badge variant="outline" className="bg-red-50 text-red-700">
          {flaggedCount} Flagged
        </Badge>
      </div>
    </div>
  );
};

export default ModerationHeader;
