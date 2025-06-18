
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Eye, Users } from "lucide-react";

interface InternshipCardProps {
  id: number;
  title: string;
  company?: string;
  location: string;
  type: string;
  match?: number;
  description?: string;
  applications?: number;
  views?: number;
  posted?: string;
  status?: string;
  onApply?: (id: number, title: string, company?: string) => void;
  onSave?: (id: number, title: string, company?: string) => void;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
  isApplied?: boolean;
  isSaved?: boolean;
  variant?: "recommendation" | "posting";
}

const InternshipCard = ({
  id,
  title,
  company,
  location,
  type,
  match,
  description,
  applications,
  views,
  posted,
  status,
  onApply,
  onSave,
  onEdit,
  onView,
  isApplied,
  isSaved,
  variant = "recommendation"
}: InternshipCardProps) => {
  if (variant === "posting") {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold">{title}</h3>
            {status && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {status}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{location}</span>
            {views && <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />{views} views</span>}
            {applications && <span className="flex items-center"><Users className="h-3 w-3 mr-1" />{applications} applications</span>}
            {posted && <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />Posted {posted}</span>}
          </div>
        </div>
        <div className="flex space-x-2">
          {onView && <Button variant="outline" size="sm" onClick={() => onView(id)}>View Applications</Button>}
          {onEdit && <Button variant="outline" size="sm" onClick={() => onEdit(id)}>Edit</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{title}</h3>
        {match && <Badge className="bg-green-100 text-green-800">{match}% match</Badge>}
      </div>
      {company && <p className="text-blue-600 font-medium mb-2">{company}</p>}
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
        <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{location}</span>
        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{type}</span>
      </div>
      {description && <p className="text-sm text-gray-700 mb-3">{description}</p>}
      <div className="flex space-x-2">
        {onApply && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onApply(id, title, company)}
            disabled={isApplied}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </Button>
        )}
        {onSave && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onSave(id, title, company)}
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
