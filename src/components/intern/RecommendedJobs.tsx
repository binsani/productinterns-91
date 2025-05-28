
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import JobCard from "@/components/shared/JobCard";

const RecommendedJobs = () => {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());

  const jobs = [
    { 
      id: 1,
      company: "InnovateTech", 
      title: "Product Management Intern",
      location: "San Francisco, CA",
      type: "3 months",
      match: 95,
      description: "Join our product team to work on cutting-edge mobile applications."
    },
    { 
      id: 2,
      company: "GrowthCo", 
      title: "Associate Product Manager Intern",
      location: "New York, NY",
      type: "6 months",
      match: 88,
      description: "Help drive product strategy for our B2B SaaS platform."
    },
  ];

  const handleApply = (jobId: number, position: string, company: string = "") => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
    toast({
      title: "Application Submitted!",
      description: `Your application for ${position} at ${company} has been submitted successfully.`,
    });
  };

  const handleSave = (jobId: number, position: string, company: string = "") => {
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
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              type={job.type}
              match={job.match}
              description={job.description}
              onApply={handleApply}
              onSave={handleSave}
              isApplied={appliedJobs.has(job.id)}
              isSaved={savedJobs.has(job.id)}
              variant="recommendation"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedJobs;
