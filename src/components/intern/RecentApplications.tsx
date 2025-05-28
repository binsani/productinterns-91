
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

const RecentApplications = () => {
  const applications = [
    { company: "TechCorp", position: "Product Management Intern", status: "Interview Scheduled", date: "2 days ago" },
    { company: "StartupX", position: "Junior PM Intern", status: "Under Review", date: "1 week ago" },
    { company: "BigTech Inc", position: "PM Summer Intern", status: "Application Sent", date: "1 week ago" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Track your application progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{app.position}</p>
                  <p className="text-sm text-gray-600">{app.company}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={app.status === "Interview Scheduled" ? "default" : "secondary"}>
                  {app.status}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">{app.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplications;
