
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import JobCard from "@/components/shared/JobCard";

const RecommendedInternships = () => {
  const { toast } = useToast();
  const [savedInternships, setSavedInternships] = useState<Set<number>>(new Set());
  const [appliedInternships, setAppliedInternships] = useState<Set<number>>(new Set());

  const internships = [
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

  const handleApply = (internshipId: number, position: string, company: string = "") => {
    setAppliedInternships(prev => new Set([...prev, internshipId]));
    toast({
      title: "Application Submitted!",
      description: `Your application for ${position} at ${company} has been submitted successfully.`,
    });
  };

  const handleSave = (internshipId: number, position: string, company: string = "") => {
    if (savedInternships.has(internshipId)) {
      setSavedInternships(prev => {
        const newSet = new Set(prev);
        newSet.delete(internshipId);
        return newSet;
      });
      toast({
        title: "Internship Removed",
        description: `${position} at ${company} has been removed from your saved internships.`,
      });
    } else {
      setSavedInternships(prev => new Set([...prev, internshipId]));
      toast({
        title: "Internship Saved!",
        description: `${position} at ${company} has been saved to your favorites.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Product Management Internships</CardTitle>
        <CardDescription>PM internships matching your profile and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship) => (
            <JobCard
              key={internship.id}
              id={internship.id}
              title={internship.title}
              company={internship.company}
              location={internship.location}
              type={internship.type}
              match={internship.match}
              description={internship.description}
              onApply={handleApply}
              onSave={handleSave}
              isApplied={appliedInternships.has(internship.id)}
              isSaved={savedInternships.has(internship.id)}
              variant="recommendation"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedInternships;
