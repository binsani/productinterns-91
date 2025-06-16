
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, MapPin, Clock, Bookmark, Building, Calendar, DollarSign, Users } from "lucide-react";
import JobCard from "@/components/shared/JobCard";
import CompanyProfileModal from "@/components/intern/CompanyProfileModal";
import { useToast } from "@/hooks/use-toast";

const InternshipBrowser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedInternships, setSavedInternships] = useState<number[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<number[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    companySize: "",
    duration: "",
    techStack: "",
    salaryRange: [0, 100000] as [number, number]
  });
  const { toast } = useToast();

  const pmInternships = [
    {
      id: 1,
      title: "Technical Product Manager Intern",
      company: "Google",
      companyId: 1,
      location: "Mountain View, CA",
      type: "Full-time",
      duration: "12 weeks",
      category: "Technical PM",
      match: 95,
      salary: 8000,
      deadline: "2024-03-15",
      description: "Join our product team to help build the next generation of consumer products...",
      techStack: ["React", "Python", "TensorFlow"],
      companySize: "10000+"
    },
    {
      id: 2,
      title: "Growth Product Manager Intern",
      company: "Meta",
      companyId: 2,
      location: "Menlo Park, CA",
      type: "Full-time", 
      duration: "16 weeks",
      category: "Growth PM",
      match: 88,
      salary: 7500,
      deadline: "2024-03-20",
      description: "Work on products used by billions of people worldwide...",
      techStack: ["React", "GraphQL", "Machine Learning"],
      companySize: "10000+"
    },
    {
      id: 3,
      title: "Platform Product Manager Intern",
      company: "Microsoft",
      companyId: 3,
      location: "Seattle, WA",
      type: "Full-time",
      duration: "14 weeks",
      category: "Platform PM",
      match: 92,
      salary: 7800,
      deadline: "2024-03-10",
      description: "Help shape the future of cloud computing and productivity tools...",
      techStack: ["Azure", "C#", "Kubernetes"],
      companySize: "10000+"
    },
    {
      id: 4,
      title: "Data Product Manager Intern",
      company: "Apple",
      companyId: 4,
      location: "Cupertino, CA", 
      type: "Full-time",
      duration: "12 weeks",
      category: "Data PM",
      match: 85,
      salary: 8200,
      deadline: "2024-03-25",
      description: "Work on strategic initiatives for consumer hardware products...",
      techStack: ["Swift", "Python", "ML"],
      companySize: "10000+"
    }
  ];

  const filteredInternships = pmInternships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || internship.category === filters.category;
    const matchesCompanySize = !filters.companySize || internship.companySize === filters.companySize;
    const matchesDuration = !filters.duration || internship.duration.includes(filters.duration);
    const matchesTechStack = !filters.techStack || internship.techStack.some(tech => 
      tech.toLowerCase().includes(filters.techStack.toLowerCase()));
    const matchesSalary = internship.salary >= filters.salaryRange[0] && internship.salary <= filters.salaryRange[1];

    return matchesSearch && matchesCategory && matchesCompanySize && matchesDuration && matchesTechStack && matchesSalary;
  });

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

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect PM Internship</CardTitle>
          <CardDescription>Browse and apply to specialized product management internships</CardDescription>
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
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">PM Category</label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="Technical PM">Technical PM</SelectItem>
                        <SelectItem value="Growth PM">Growth PM</SelectItem>
                        <SelectItem value="Platform PM">Platform PM</SelectItem>
                        <SelectItem value="Data PM">Data PM</SelectItem>
                        <SelectItem value="Mobile PM">Mobile PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Size</label>
                    <Select value={filters.companySize} onValueChange={(value) => setFilters(prev => ({ ...prev, companySize: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Sizes</SelectItem>
                        <SelectItem value="1-50">Startup (1-50)</SelectItem>
                        <SelectItem value="51-200">Small (51-200)</SelectItem>
                        <SelectItem value="201-1000">Medium (201-1000)</SelectItem>
                        <SelectItem value="1001-5000">Large (1001-5000)</SelectItem>
                        <SelectItem value="10000+">Enterprise (10000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Select value={filters.duration} onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Durations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Durations</SelectItem>
                        <SelectItem value="8">8 weeks</SelectItem>
                        <SelectItem value="10">10 weeks</SelectItem>
                        <SelectItem value="12">12 weeks</SelectItem>
                        <SelectItem value="16">16 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tech Stack</label>
                    <Input
                      placeholder="e.g. React, Python, ML"
                      value={filters.techStack}
                      onChange={(e) => setFilters(prev => ({ ...prev, techStack: e.target.value }))}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Monthly Salary Range: ${filters.salaryRange[0]} - ${filters.salaryRange[1]}
                    </label>
                    <Slider
                      value={filters.salaryRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, salaryRange: value as [number, number] }))}
                      max={15000}
                      min={3000}
                      step={500}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {filteredInternships.map((internship) => {
              const daysLeft = getDaysUntilDeadline(internship.deadline);
              return (
                <div key={internship.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{internship.title}</h3>
                        <div className="flex space-x-2">
                          <Badge className="bg-green-100 text-green-800">{internship.match}% match</Badge>
                          <Badge variant="outline">{internship.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <Button
                          variant="link"
                          className="text-blue-600 font-medium p-0 h-auto"
                          onClick={() => setSelectedCompany(internship.companyId)}
                        >
                          <Building className="h-4 w-4 mr-1" />
                          {internship.company}
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{internship.location}</span>
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />{internship.duration}</span>
                        <span className="flex items-center"><DollarSign className="h-3 w-3 mr-1" />${internship.salary}/month</span>
                        <span className="flex items-center"><Users className="h-3 w-3 mr-1" />{internship.companySize}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span className={`text-sm font-medium ${daysLeft <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                          Deadline: {internship.deadline} ({daysLeft > 0 ? `${daysLeft} days left` : 'Expired'})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {internship.techStack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{internship.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApply(internship.id, internship.title, internship.company)}
                      disabled={appliedInternships.includes(internship.id) || daysLeft <= 0}
                    >
                      {appliedInternships.includes(internship.id) ? "Applied" : daysLeft <= 0 ? "Expired" : "Apply Now"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSave(internship.id, internship.title, internship.company)}
                    >
                      {savedInternships.includes(internship.id) ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredInternships.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No internships match your current filters</p>
              <Button variant="outline" className="mt-2" onClick={() => setFilters({
                category: "",
                companySize: "",
                duration: "",
                techStack: "",
                salaryRange: [0, 100000]
              })}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCompany && (
        <CompanyProfileModal 
          companyId={selectedCompany} 
          isOpen={!!selectedCompany} 
          onClose={() => setSelectedCompany(null)} 
        />
      )}
    </div>
  );
};

export default InternshipBrowser;
