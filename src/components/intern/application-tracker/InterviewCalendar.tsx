
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface Application {
  id: string;
  company: string;
  position: string;
  interviewDate?: string;
  nextStep?: string;
}

interface InterviewCalendarProps {
  applications: Application[];
}

const InterviewCalendar = ({ applications }: InterviewCalendarProps) => {
  const interviewApplications = applications.filter(app => app.interviewDate);

  return (
    <div className="space-y-3">
      {interviewApplications.map(app => (
        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-medium">{app.position}</h3>
              <p className="text-sm text-gray-600">{app.company}</p>
              <p className="text-sm text-gray-500">
                {app.interviewDate && new Date(app.interviewDate).toLocaleDateString()} 
                {app.nextStep?.includes('PM') && ` at ${app.nextStep.split('at ')[1]}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Add to Calendar
            </Button>
            <Button size="sm">
              Join Interview
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterviewCalendar;
