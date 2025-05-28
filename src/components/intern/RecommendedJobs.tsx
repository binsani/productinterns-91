
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

const RecommendedJobs = () => {
  const jobs = [
    { 
      company: "InnovateTech", 
      position: "Product Management Intern",
      location: "San Francisco, CA",
      type: "3 months",
      match: 95,
      description: "Join our product team to work on cutting-edge mobile applications."
    },
    { 
      company: "GrowthCo", 
      position: "Associate Product Manager Intern",
      location: "New York, NY",
      type: "6 months",
      match: 88,
      description: "Help drive product strategy for our B2B SaaS platform."
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Internships matching your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{job.position}</h3>
                <Badge className="bg-green-100 text-green-800">{job.match}% match</Badge>
              </div>
              <p className="text-blue-600 font-medium mb-2">{job.company}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{job.location}</span>
                <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{job.type}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{job.description}</p>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">Apply Now</Button>
                <Button size="sm" variant="outline">Save</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedJobs;
