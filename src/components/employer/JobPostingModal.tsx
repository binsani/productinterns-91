import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useJobOperations } from "@/hooks/useJobOperations";
import { Loader2 } from "lucide-react";

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobPostingModal = ({ isOpen, onClose }: JobPostingModalProps) => {
  const { createJob, isCreating } = useJobOperations();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "full-time" as const,
    experience_level: "entry-level" as const,
    salary_min: "",
    salary_max: "",
    salary_currency: "USD",
    requirements: "",
    responsibilities: "",
    benefits: "",
    skills_required: "",
    is_remote: false,
    application_deadline: "",
    start_date: "",
    status: "active" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
        salary_currency: formData.salary_currency,
        requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
        responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').filter(r => r.trim()) : [],
        benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : [],
        skills_required: formData.skills_required ? formData.skills_required.split(',').map(s => s.trim()).filter(s => s) : [],
        is_remote: formData.is_remote,
        application_deadline: formData.application_deadline || undefined,
        start_date: formData.start_date || undefined,
        status: formData.status,
      });
      
      onClose();
      setFormData({
        title: "",
        description: "",
        location: "",
        job_type: "full-time",
        experience_level: "entry-level",
        salary_min: "",
        salary_max: "",
        salary_currency: "USD",
        requirements: "",
        responsibilities: "",
        benefits: "",
        skills_required: "",
        is_remote: false,
        application_deadline: "",
        start_date: "",
        status: "active",
      });
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Senior Product Manager"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and what you're looking for..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job_type">Job Type</Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value: any) => setFormData({ ...formData, job_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value: any) => setFormData({ ...formData, experience_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry Level</SelectItem>
                    <SelectItem value="mid-level">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_remote"
                checked={formData.is_remote}
                onCheckedChange={(checked) => setFormData({ ...formData, is_remote: checked })}
              />
              <Label htmlFor="is_remote">Remote Position</Label>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salary_min">Min Salary</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="salary_max">Max Salary</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                  placeholder="80000"
                />
              </div>
              <div>
                <Label htmlFor="salary_currency">Currency</Label>
                <Input
                  id="salary_currency"
                  value={formData.salary_currency}
                  onChange={(e) => setFormData({ ...formData, salary_currency: e.target.value })}
                  placeholder="USD"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="skills_required">Required Skills (comma-separated)</Label>
              <Input
                id="skills_required"
                value={formData.skills_required}
                onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                placeholder="Product Strategy, Data Analysis, Agile"
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Bachelor's degree in relevant field&#10;5+ years of product management experience&#10;Strong analytical skills"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
              <Textarea
                id="responsibilities"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Define product vision and roadmap&#10;Lead cross-functional teams&#10;Analyze market trends"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Health insurance&#10;401k matching&#10;Flexible work hours"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobPostingModal;
