
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Eye, Users, Calendar, Edit } from "lucide-react";

interface InternshipCardProps {
  id: number;
  title: string;
  location: string;
  type: string;
  applications?: number;
  views?: number;
  posted?: string;
  status?: string;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  variant?: "posting" | "application";
}

const InternshipCard = ({
  id,
  title,
  location,
  type,
  applications,
  views,
  posted,
  status,
  onView,
  onEdit,
  variant = "posting"
}: InternshipCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Paused": return "bg-yellow-100 text-yellow-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <Building2 className="h-8 w-8 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
              <Badge variant="secondary">{type}</Badge>
            </div>
          </div>
        </div>
        {status && (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {applications !== undefined && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {applications} applications
            </div>
          )}
          {views !== undefined && (
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {views} views
            </div>
          )}
          {posted && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {posted}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(id)}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
