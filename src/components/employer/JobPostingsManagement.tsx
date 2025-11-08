import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Edit, 
  Trash2,
  Eye,
  Briefcase,
  Clock
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { useJobOperations } from "@/hooks/useJobOperations";
import { useAuthStore } from "@/stores/authStore";
import JobPostingModal from "./JobPostingModal";

const JobPostingsManagement = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("active");
  
  const { data: jobs = [], isLoading } = useJobs();
  const { deleteJob, updateJob } = useJobOperations();

  // Filter jobs by employer and status
  const filteredJobs = jobs.filter((job: any) => {
    const matchesEmployer = job.employer_id === user?.id;
    const matchesStatus = job.status === activeStatus;
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesEmployer && matchesStatus && matchesSearch;
  });

  const handleDelete = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      await deleteJob(jobId);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    await updateJob({ id: jobId, status: newStatus as any });
  };

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return "Competitive";
    const curr = currency || "USD";
    if (min && max) return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${curr} ${min.toLocaleString()}+`;
    return `Up to ${curr} ${max?.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Job Postings</h2>
          <p className="text-muted-foreground">Manage your full-time job positions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatus} className="space-y-4 mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading jobs...</p>
              </CardContent>
            </Card>
          ) : filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No {activeStatus} jobs found. Create your first job posting!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job: any) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location || 'Not specified'}
                            {job.is_remote && ' (Remote)'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.job_type?.replace('-', ' ') || 'Full-time'}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.experience_level?.replace('-', ' ') || 'Entry level'}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills_required.slice(0, 5).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills_required.length > 5 && (
                        <Badge variant="outline">+{job.skills_required.length - 5} more</Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {job.application_deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {job.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(job.id, 'paused')}
                        >
                          Pause
                        </Button>
                      )}
                      {job.status === 'paused' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(job.id, 'active')}
                        >
                          Activate
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <JobPostingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default JobPostingsManagement;
