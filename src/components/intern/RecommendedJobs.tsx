
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const RecommendedJobs = () => {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());

  const jobs = [
    { 
      id: 1,
      company: "InnovateTech", 
      position: "Product Management Intern",
      location: "San Francisco, CA",
      type: "3 months",
      match: 95,
      description: "Join our product team to work on cutting-edge mobile applications."
    },
    { 
      id: 2,
      company: "GrowthCo", 
      position: "Associate Product Manager Intern",
      location: "New York, NY",
      type: "6 months",
      match: 88,
      description: "Help drive product strategy for our B2B SaaS platform."
    },
  ];

  const handleApply = (jobId: number, position: string, company: string) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
    toast({
      title: "Application Submitted!",
      description: `Your application for ${position} at ${company} has been submitted successfully.`,
    });
  };

  const handleSave = (jobId: number, position: string, company: string) => {
    if (savedJobs.has(jobId)) {
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      toast({
        title: "Job Removed",
        description: `${position} at ${company} has been removed from your saved jobs.`,
      });
    } else {
      setSavedJobs(prev => new Set([...prev, jobId]));
      toast({
        title: "Job Saved!",
        description: `${position} at ${company} has been saved to your favorites.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Internships matching your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleApply(job.id, job.position, job.company)}
                  disabled={appliedJobs.has(job.id)}
                >
                  {appliedJobs.has(job.id) ? "Applied" : "Apply Now"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSave(job.id, job.position, job.company)}
                >
                  {savedJobs.has(job.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedJobs;
