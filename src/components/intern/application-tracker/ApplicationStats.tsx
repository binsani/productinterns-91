
import { Card, CardContent } from "@/components/ui/card";

interface ApplicationStatsProps {
  stats: {
    total: number;
    reviewing: number;
    interviews: number;
    offers: number;
  };
}

const ApplicationStats = ({ stats }: ApplicationStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
          <div className="text-sm text-gray-600">Under Review</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.interviews}</div>
          <div className="text-sm text-gray-600">Interviews</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
          <div className="text-sm text-gray-600">Offers</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStats;
