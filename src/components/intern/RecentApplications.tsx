
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationCard from "@/components/shared/ApplicationCard";

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
            <ApplicationCard
              key={index}
              company={app.company}
              position={app.position}
              status={app.status}
              date={app.date}
              variant="recent"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentApplications;
