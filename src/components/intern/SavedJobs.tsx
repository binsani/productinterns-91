
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Trash2 } from "lucide-react";
import JobCard from "@/components/shared/JobCard";
import { useToast } from "@/hooks/use-toast";

const SavedJobs = () => {
  const [savedInternships, setSavedInternships] = useState([1, 2, 3]);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const { toast } = useToast();

  const mockSavedInternships = [
    {
      id: 1,
      title: "Product Management Intern",
      company: "Spotify",
      location: "New York, NY",
      type: "Full-time",
      match: 94,
      description: "Help build features for millions of music lovers worldwide..."
    },
    {
      id: 2,
      title: "Associate Product Manager Intern",
      company: "Slack",
      location: "San Francisco, CA", 
      type: "Full-time",
      match: 89,
      description: "Work on collaboration tools used by teams globally..."
    },
    {
      id: 3,
      title: "Junior PM Intern",
      company: "Notion",
      location: "Remote",
      type: "Full-time",
      match: 91,
      description: "Shape the future of productivity and note-taking..."
    }
  ];

  const handleApply = (id: number, title: string, company?: string) => {
    setAppliedInternships(prev => [...prev, id]);
    toast({
      title: "Application Submitted",
      description: `Your application for ${title} at ${company} has been submitted successfully.`,
    });
  };

  const handleRemove = (id: number, title: string, company?: string) => {
    setSavedInternships(prev => prev.filter(internshipId => internshipId !== id));
    toast({
      title: "Internship Removed",
      description: `${title} at ${company} has been removed from your saved internships.`,
    });
  };

  const filteredInternships = mockSavedInternships.filter(internship => savedInternships.includes(internship.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Saved PM Internships
              </CardTitle>
              <CardDescription>Your bookmarked product management internship opportunities</CardDescription>
            </div>
            <Badge variant="secondary">{filteredInternships.length} saved</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInternships.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No saved PM internships yet</p>
              <p className="text-sm text-gray-500 mt-1">Save interesting product management internships to review them later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredInternships.map((internship) => (
                <div key={internship.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{internship.title}</h3>
                        <Badge className="bg-green-100 text-green-800">{internship.match}% match</Badge>
                      </div>
                      <p className="text-blue-600 font-medium mb-2">{internship.company}</p>
                      <p className="text-sm text-gray-700 mb-3">{internship.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{internship.location}</span>
                        <span>{internship.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApply(internship.id, internship.title, internship.company)}
                      disabled={appliedInternships.includes(internship.id)}
                    >
                      {appliedInternships.includes(internship.id) ? "Applied" : "Apply Now"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemove(internship.id, internship.title, internship.company)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedJobs;
