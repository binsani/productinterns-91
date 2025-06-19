
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface ApplicationCardProps {
  id?: number;
  name?: string;
  company?: string;
  position: string;
  university?: string;
  skills?: string[];
  status?: string;
  date?: string;
  applied?: string;
  match?: number;
  onReview?: (id: number, name: string) => void;
  onScheduleInterview?: () => void;
  variant?: "recent" | "applicant";
}

const ApplicationCard = ({
  id,
  name,
  company,
  position,
  university,
  skills,
  status,
  date,
  applied,
  match,
  onReview,
  onScheduleInterview,
  variant = "recent"
}: ApplicationCardProps) => {
  if (variant === "applicant" && name && university && skills && applied && match && onReview && id) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold">{name}</h3>
              <Badge className="bg-blue-100 text-blue-800">{match}% match</Badge>
            </div>
            <p className="text-sm text-gray-600">{university} • Applied to {position}</p>
            <div className="flex space-x-1 mt-1">
              {skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{applied}</span>
          <Button size="sm" onClick={() => onReview(id, name)}>Review</Button>
          {onScheduleInterview && (
            <Button size="sm" variant="outline" onClick={onScheduleInterview}>
              Schedule Interview
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <Building2 className="h-8 w-8 text-blue-600" />
        <div>
          <p className="font-medium">{position}</p>
          {company && <p className="text-sm text-gray-600">{company}</p>}
        </div>
      </div>
      <div className="text-right">
        {status && (
          <Badge variant={status === "Interview Scheduled" ? "default" : "secondary"}>
            {status}
          </Badge>
        )}
        {date && <p className="text-xs text-gray-500 mt-1">{date}</p>}
      </div>
    </div>
  );
};

export default ApplicationCard;
