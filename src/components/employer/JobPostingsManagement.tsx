
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  MapPin, 
  Eye, 
  Users, 
  Calendar,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JobPostingModal from "./JobPostingModal";

const JobPostingsManagement = () => {
  const { toast } = useToast();
  const [isJobPostingModalOpen, setIsJobPostingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobPostings, setJobPostings] = useState([
    { 
      id: 1,
      title: "Product Management Intern", 
      location: "San Francisco, CA",
      type: "Full-time",
      applications: 15, 
      views: 245, 
      posted: "2024-01-15",
      status: "Active",
      expiresAt: "2024-03-15"
    },
    { 
      id: 2,
      title: "Junior PM Intern - Summer 2024", 
      location: "Remote",
      type: "Internship",
      applications: 23, 
      views: 187, 
      posted: "2024-01-08",
      status: "Active",
      expiresAt: "2024-04-08"
    },
    { 
      id: 3,
      title: "Associate Product Manager Intern", 
      location: "New York, NY",
      type: "Part-time",
      applications: 9, 
      views: 156, 
      posted: "2024-01-20",
      status: "Draft",
      expiresAt: "2024-05-20"
    },
  ]);

  const filteredJobs = jobPostings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteJob = (jobId: number, jobTitle: string) => {
    setJobPostings(prev => prev.filter(job => job.id !== jobId));
    toast({
      title: "Job Deleted",
      description: `${jobTitle} has been deleted successfully.`,
    });
  };

  const handleToggleStatus = (jobId: number) => {
    setJobPostings(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === "Active" ? "Paused" : "Active" }
        : job
    ));
    toast({
      title: "Status Updated",
      description: "Job posting status has been updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Paused": return "bg-yellow-100 text-yellow-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Job Postings Management</CardTitle>
              <CardDescription>Manage all your job postings and track their performance</CardDescription>
            </div>
            <Button onClick={() => setIsJobPostingModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search job postings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {job.applications}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {job.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(job.posted).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleStatus(job.id)}
                        >
                          {job.status === "Active" ? "Pause" : "Activate"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteJob(job.id, job.title)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <JobPostingModal 
        isOpen={isJobPostingModalOpen} 
        onClose={() => setIsJobPostingModalOpen(false)} 
      />
    </>
  );
};

export default JobPostingsManagement;
