
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Clock, Bookmark } from "lucide-react";
import JobCard from "@/components/shared/JobCard";
import { useToast } from "@/hooks/use-toast";

const InternshipBrowser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedInternships, setSavedInternships] = useState<number[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const { toast } = useToast();

  const pmInternships = [
    {
      id: 1,
      title: "Product Management Intern",
      company: "Google",
      location: "Mountain View, CA",
      type: "Full-time",
      match: 95,
      description: "Join our product team to help build the next generation of consumer products..."
    },
    {
      id: 2,
      title: "Associate Product Manager Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      type: "Full-time", 
      match: 88,
      description: "Work on products used by billions of people worldwide..."
    },
    {
      id: 3,
      title: "Junior PM Intern",
      company: "Microsoft",
      location: "Seattle, WA",
      type: "Full-time",
      match: 92,
      description: "Help shape the future of cloud computing and productivity tools..."
    },
    {
      id: 4,
      title: "Product Strategy Intern",
      company: "Apple",
      location: "Cupertino, CA", 
      type: "Full-time",
      match: 85,
      description: "Work on strategic initiatives for consumer hardware products..."
    }
  ];

  const handleApply = (id: number, title: string, company?: string) => {
    setAppliedInternships(prev => [...prev, id]);
    toast({
      title: "Application Submitted",
      description: `Your application for ${title} at ${company} has been submitted successfully.`,
    });
  };

  const handleSave = (id: number, title: string, company?: string) => {
    if (savedInternships.includes(id)) {
      setSavedInternships(prev => prev.filter(internshipId => internshipId !== id));
      toast({
        title: "Internship Removed",
        description: `${title} at ${company} has been removed from your saved internships.`,
      });
    } else {
      setSavedInternships(prev => [...prev, id]);
      toast({
        title: "Internship Saved",
        description: `${title} at ${company} has been saved to your favorites.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect PM Internship</CardTitle>
          <CardDescription>Browse and apply to product management internships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search PM internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pmInternships.map((internship) => (
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
                isApplied={appliedInternships.includes(internship.id)}
                isSaved={savedInternships.includes(internship.id)}
                variant="recommendation"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternshipBrowser;
